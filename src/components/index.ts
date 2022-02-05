// import * as Config from '../utils/config'
import { DefinitionException } from '../DefinitionException'
import { Exception } from '../utils/Exception'
import * as E from '../DefinitionException/methods'
import rx from '../utils/rx'
import { copy, getLatestSpecVersion, isObject, same, smart } from '../utils/util'
import { LoaderMetadata } from '../utils/loader'
import { DefinitionResult } from '../DefinitionException/DefinitionResult'
import * as Loader from '../utils/loader'
import { ExceptionMessageDataInput, Level } from '../DefinitionException/types'
import { Lastly } from './helpers/Lastly'
import { Chain } from './helpers/Chain'
import {
  BuilderData,
  BuilderMetadata,
  Component as EnforcerComponent,
  ComponentData,
  ComponentSchema,
  Data,
  ValidatorData,
  Version
} from './helpers/builder-validator-types'

type Computed<T> = T | ComputeFunction<T>

export type ComputeFunction<T> = (compute: ComponentData) => T

export interface EnforcerData<Definition, Extension=Record<string, any>> {
  [key: string]: any
  data: BuilderData<Definition>
  extensions: EnforcerExtension & Extension // specific to x- extensions in the openapi document
  metadata: BuilderMetadata
  findAncestor: <T>(component: EnforcerComponent) => T | undefined
  findAncestorData: <Definition=any, Built=any> (component: EnforcerComponent) => BuilderData<Definition, Built> | undefined
}

export interface EnforcerExtension {
  exceptions?: Record<string, Level> // the key is the code to modify the level on and the value is the new level
  nullable?: boolean
}

export interface LoaderOptions {
  validate?: boolean
}

interface NotAllowed {
  name: string
  reason: string
}

export type Schema = SchemaAny | SchemaArray | SchemaBoolean | SchemaComponent | SchemaNumber | SchemaOneOf | SchemaString | SchemaObject

interface SchemaBase<T=any> {
  // Set the default.
  default?: Computed<T>

  // Get array of possible values.
  enum?: Computed<T[]>

  // Determine if validation should be skipped.
  ignored?: Computed<false | string>

  // Determine if value can be null
  nullable?: Computed<boolean>
}

export interface SchemaAny extends SchemaBase {
  type: 'any'
}

export interface SchemaArray extends SchemaBase<any[]> {
  type: 'array'
  items: Computed<Schema>
  maxItems?: Computed<number>
  minItems?: Computed<number>
}

export interface SchemaBoolean extends SchemaBase<boolean> {
  type: 'boolean'
}

export interface SchemaComponent extends SchemaBase {
  type: 'component'
  allowsRef: Computed<boolean>
  component: EnforcerComponent
}

interface SchemaConditional {
  condition: (data: Data, componentDefinition: any) => boolean
  schema: Computed<Schema>
}

export interface SchemaNumber extends SchemaBase<number> {
  type: 'number'
  integer?: Computed<boolean>
  maximum?: Computed<number>
  minimum?: Computed<number>
}

export interface SchemaOneOf extends SchemaBase {
  type: 'oneOf'
  oneOf: SchemaConditional[]
  error: (data: ValidatorData) => ExceptionMessageDataInput // only called by validator, not builder
}

export interface SchemaString extends SchemaBase<string> {
  type: 'string'
  maxLength?: Computed<number>
  minLength?: Computed<number>
}

export interface SchemaObject extends SchemaBase<Record<string, any>> {
  type: 'object'
  allowsSchemaExtensions: Computed<boolean>
  additionalProperties?: Computed<{
    namespace?: string // for building only, put additional properties within a parent property with this namespace as a value
    schema: Schema
  }>
  properties?: SchemaProperty[]
}

export interface SchemaProperty<SchemaType=Schema> {
  name: string
  after?: (cache: Record<string, any>, value: any, built: Record<string, any>, data: BuilderData | ValidatorData) => void // Run this after property has been processed. Common use case is to use component cache to save values.
  before?: (cache: Record<string, any>, data: BuilderData | ValidatorData) => void
  notAllowed?: Computed<string | undefined> // If this property could be allowed in certain circumstances but is not currently allowed then we provide a string here indicating why it is currently not allowed.
  required?: Computed<boolean>
  schema: Computed<SchemaType>
  versions?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class OASComponent<Definition=any, ComponentConstructor extends EnforcerComponent=any> {
  readonly enforcer: EnforcerData<Definition>

  constructor (Component: ComponentConstructor, definition: Definition, version?: Version, incomingData?: BuilderData<Definition, ComponentConstructor>) {
    const data = createComponentData<BuilderData<Definition, ComponentConstructor>>('constructing', Component, Exception, definition, version, incomingData)
    const { hooks } = data.component.schema
    const { map } = data.root
    data.context.built = this as unknown as ComponentConstructor
    data.component.built = data.context.built
    this.enforcer = {
      data,
      metadata: data.root.metadata,
      extensions: (data.context.definition as any)['x-enforcer'] ?? {},
      findAncestor<T> (component: EnforcerComponent): T | undefined {
        const ancestorData = findAncestorData(data, component)
        if (ancestorData === undefined) return
        return ancestorData.context.built as T
      },
      findAncestorData<Definition=any, Built=any> (component: EnforcerComponent): BuilderData<Definition, Built> | undefined {
        return findAncestorData<Definition, Built>(data, component) as BuilderData
      }
    }

    // maybe add the extension object - this 'extensions' type will be defined for components that have an 'extensions' object
    const allowsSchemaExtensions = 'allowsSchemaExtensions' in data.context.schema && data.context.schema.allowsSchemaExtensions
    if (typeof allowsSchemaExtensions === 'function' ? allowsSchemaExtensions(data.component) : allowsSchemaExtensions) {
      // @ts-expect-error
      this.extensions = {}
    }

    // register the use of this component with this definition
    if (!map.has(this.constructor)) map.set(this.constructor, [])
    map.get(this.constructor)?.push({ definition, instance: this })

    // run before-build functions
    const beforeBuild = hooks['before-build']
    const beforeBuildLength = beforeBuild.length
    for (let i = 0; i < beforeBuildLength; i++) {
      if (!beforeBuild[i](data)) return
    }

    // run build
    buildObjectProperties(this, data)

    // run after-build functions
    const afterBuild = hooks['after-build']
    const afterBuildLength = afterBuild.length
    for (let i = 0; i < afterBuildLength; i++) {
      afterBuild[i](data)
    }

    // trigger lastly hooks if this is root
    if (incomingData === undefined) data.root.lastly.run(data)
  }

  static extend (): void {

  }

  static spec = {}

  // This value will be overwritten by individual components
  static get schema (): ComponentSchema {
    return new ComponentSchema<any, any>({
      allowsSchemaExtensions: false
    })
  }
}

export function componentValidate<Definition=any> (component: EnforcerComponent, definition: Definition, version?: Version, incomingData?: ValidatorData<Definition>): DefinitionException {
  const data: ValidatorData = createComponentData<ValidatorData<Definition>>('validating', component, DefinitionException, definition, version, incomingData)
  const { context, root } = data
  const { hooks } = data.component.schema
  const { chain, exception } = context
  const { version: v } = root
  const parent = chain[0]

  if (incomingData !== undefined) {
    context.built = incomingData.context.built
    data.component.built = context.built
  }

  // check that this component is allowed for the active version
  if (component.spec[v] === undefined) {
    const invalidVersionForComponent = E.invalidVersionForComponent(data,
      { node: parent?.context.definition, key: parent?.context.key, type: 'both' },
      component.name,
      v)
    exception.message(invalidVersionForComponent)
    return exception
  }

  // run before-validate functions
  const beforeValidate = hooks['before-validate']
  const beforeValidateLength = beforeValidate.length
  for (let i = 0; i < beforeValidateLength; i++) {
    if (!beforeValidate[i](data)) return data.context.exception
  }

  // run schema validators
  const success = validateObjectProperties(data.context.built, data)
  if (success) {
    // run after-validate functions
    const afterValidate = hooks['after-validate']
    const afterValidateLength = afterValidate.length
    for (let i = 0; i < afterValidateLength; i++) {
      afterValidate[i](data)
    }

    // trigger lastly hooks if this is root
    if (incomingData === undefined) root.lastly.run(data)
  }

  return exception
}

export function build (data: BuilderData): any {
  const { context, root } = data
  const { definition: componentDef } = data.component
  const { map, version } = root
  const { schema } = context
  const { definition, exception } = context

  if (definition === undefined && 'default' in schema) {
    return typeof schema.default === 'function' ? schema.default(data.component) : schema.default
  } else {
    // if there is a $ref then throw an error - we need dereferenced objects for component object's functions to work.
    const hasRef = typeof definition === 'object' && definition !== null && '$ref' in definition
    if (hasRef) {
      exception.message('COMP_BUIL_NO_REFS', 'All references must be resolved before building.')
    } else if (schema.type === 'any') {
      return definition
    } else if (schema.type === 'array') {
      if (!Array.isArray(definition)) throw Error('Invalid definition type. Expected an array. Received: ' + smart(definition))

      const store = map.get(schema)
      const found = store?.find(item => item.definition === definition)
      if (found !== undefined) {
        return found.instance
      } else {
        const built: any[] = []
        if (!map.has(schema)) map.set(schema, [])
        map.get(schema)?.push({ definition, instance: built })

        definition.forEach((def: any, i: number) => {
          const key = String(i)
          const itemsSchema = typeof schema.items === 'function' ? schema.items(data.component) : schema.items
          const child = createChildData(data, def, key, itemsSchema) as BuilderData
          built.push(build(child))
        })
        return built
      }
    } else if (schema.type === 'boolean') {
      if (typeof definition !== 'boolean') throw Error('Invalid definition type. Expected a boolean. Received: ' + smart(definition))
      return definition
    } else if (schema.type === 'component') {
      if (!isObject(definition)) throw Error('Invalid definition type. Expected an object. Received: ' + smart(definition))
      const Component = schema.component

      // check if the definition has been used with this component previously, otherwise create the component
      const store = map.get(Component)
      const found = store?.find(item => item.definition === definition)
      if (found !== undefined) {
        return found.instance
      } else {
        // creating the component will also register it with the store. See the OASComponent constructor to see where it is registered.
        return new Component(definition, version, data)
      }
    } else if (schema.type === 'number') {
      if (typeof definition !== 'number') throw Error('Invalid definition type. Expected a number. Received: ' + smart(definition))
      return definition
    } else if (schema.type === 'oneOf') {
      const match = schema.oneOf.find(item => item.condition(data, componentDef))
      if (match === undefined) {
        throw Error('Definition does not meet any of the possible conditions. Received: ' + smart(definition))
      } else {
        const matchedSchema = typeof match.schema === 'function' ? match.schema(data.component) : match.schema
        const child = {
          root: data.root,
          component: data.component,
          context: Object.assign({}, data.context, { schema: matchedSchema })
        }
        return build(child)
      }
    } else if (schema.type === 'object') {
      if (!isObject(definition)) throw Error('Invalid definition type. Expected an object. Received: ' + smart(definition))

      return mappable(schema, data, {}, (built) => {
        buildObjectProperties(built, data)
        return built
      })
    } else if (schema.type === 'string') {
      if (typeof definition !== 'string') throw Error('Invalid definition type. Expected a string. Received: ' + smart(definition))
      return definition
    } else {
      return definition
    }
  }
}

// similar to the build function but instead of returning the built value it inserts it into the context object
function buildObjectProperties (context: any, data: BuilderData): void {
  const { definition } = data.context
  const schema = data.context.schema as SchemaObject
  const properties = schema.properties !== undefined ? schema.properties : []
  const remainingProperties: string[] = Object.keys(definition)
  const cache = data.component.cache

  properties.forEach(prop => {
    const name = prop.name
    const propSchema = typeof prop.schema === 'function' ? prop.schema(data.component) : prop.schema
    const child = createChildData(data, definition[name], name, propSchema) as BuilderData

    if (prop.before !== undefined) prop.before(cache, data)

    const notAllowed = typeof prop.notAllowed === 'function' ? prop.notAllowed(data.component) : prop.notAllowed
    const ignored = typeof propSchema.ignored === 'function' ? propSchema.ignored(data.component) : propSchema.ignored
    const allowed = notAllowed === undefined

    // get the built value
    let value: any
    let found = false
    if (typeof ignored === 'string') {
      found = true
    } else if (name in definition) {
      value = build(child)
      found = true
    } else if ('default' in propSchema && allowed) {
      value = typeof propSchema.default === 'function' ? propSchema.default(data.component) : propSchema.default
      found = true
    }
    if (value !== undefined) context[name] = value

    // run the after function if it exists, even if the value is undefined
    if (prop.after !== undefined) prop.after(cache, value, context, data)

    // if this property has been processed then remove from remaining properties
    if (found) {
      const index = remainingProperties.indexOf(name)
      if (index !== -1) remainingProperties.splice(index, 1)
    }
  })

  // default to excluding additional properties from build
  const additionalProperties = schema.additionalProperties !== undefined
    ? (typeof schema.additionalProperties === 'function' ? schema.additionalProperties(data.component) : schema.additionalProperties)
    : false
  const allowsSchemaExtensions = typeof schema.allowsSchemaExtensions === 'function' ? schema.allowsSchemaExtensions(data.component) : schema.allowsSchemaExtensions
  const hasNamespaceForAdditionalProperties = additionalProperties !== false && additionalProperties.namespace !== undefined
  const additionalPropertiesContext = hasNamespaceForAdditionalProperties ? {} : context
  const isComponent = context instanceof OASComponent
  if (hasNamespaceForAdditionalProperties) context[additionalProperties.namespace as string] = additionalPropertiesContext

  remainingProperties.forEach((key: string) => {
    const def = definition[key]
    if ((allowsSchemaExtensions && rx.extension.test(key))) {
      if (isComponent) {
        // @ts-expect-error
        context.extensions[renameExtension(key)] = def
      } else {
        context[key] = def
      }
    } else if (additionalProperties !== false) {
      const child = createChildData(data, definition[key], key, additionalProperties.schema) as BuilderData
      const value: any = build(child)
      if (value !== undefined) additionalPropertiesContext[key] = value
    }
  })
}

export function createChildData (data: Data, definition: any, key: string, schema: Schema): Data {
  const chain = data.context.chain.slice(0)
  // @ts-expect-error
  chain.unshift(data)
  const childData: Data = {
    root: data.root,
    component: data.component,
    // @ts-expect-error
    context: {
      built: undefined,
      chain,
      children: {},
      definition,
      exception: data.context.exception.at(key),
      key,
      schema
    }
  }
  data.context.children[key] = childData
  return childData
}

function createComponentData<D extends Data> (action: 'constructing' | 'loading' | 'validating', component: EnforcerComponent, Exception: any, definition: any, version?: Version, data?: D): D {
  const v: Version = version === undefined ? getLatestSpecVersion(component.spec) as Version : version

  const componentData: ValidatorData = {
    // @ts-expect-error - allow root.data to equal null
    root: data === undefined
      ? {
          data: null,
          lastly: new Lastly(),
          loadCache: {},
          loadOptions: { dereference: true },
          major: parseInt(v.split('.')[0]),
          map: new Map(),
          metadata: {
            operationIdMap: {},
            securitySchemes: {}
          },
          version: v
        }
      : data.root,
    component: {
      built: null, // overwritten below
      cache: {},
      constructor: component,
      // @ts-expect-error
      data: null, // data will be replaced momentarily
      definition,
      reference: component.spec[v] as string,
      // @ts-expect-error
      schema: null // schema will be replaced momentarily
    },
    context: {
      built: {},
      // @ts-expect-error
      chain: data?.context.chain ?? new Chain(),
      // @ts-expect-error
      children: data?.context.children ?? {},
      definition: definition,
      exception: data?.context.exception ?? new Exception('One or more [TYPE] found while ' + action + ' ' + component.name + ' object' + ':'),
      key: data?.context.key ?? '',
      schema: {
        type: 'object',
        allowsSchemaExtensions: true
      }
    }
  }
  componentData.component.data = componentData
  componentData.component.built = componentData.context.built

  // if this is the root data object then assign root to self
  if (data === undefined) componentData.root.data = componentData

  // generate component schema and assign to component data
  const componentSchema = component.schema
  componentData.component.schema = componentSchema
  componentData.context.schema = {
    type: 'object',
    allowsSchemaExtensions: componentSchema.allowsSchemaExtensions,
    additionalProperties: componentSchema.additionalProperties,
    properties: componentSchema.properties
  }

  return componentData as D
}

export function findAncestorData<Definition=any, Built=any> (data: Data, component: EnforcerComponent): Data<Definition, Built> | undefined {
  let node: Data | undefined = data.component.data
  do {
    node = node.context.chain[0]?.component.data
    if (node?.component.constructor === component) return node
  } while (node !== undefined)
}

export function normalizeLoaderOptions (options?: LoaderOptions): Required<LoaderOptions> {
  if (options === undefined) options = {}
  if (options.validate === undefined) options.validate = true
  return options as Required<LoaderOptions>
}

// this is the code for loading either the OpenAPI or Swagger document
export async function loadRoot<T> (RootComponent: EnforcerComponent, path: string, options?: LoaderOptions): Promise<DefinitionResult<T>> {
  options = normalizeLoaderOptions(options)

  // load file with dereference
  const config: LoaderMetadata = {
    cache: {},
    exception: new DefinitionException('One or more [TYPE] found while loading ' + RootComponent.name + ' document')
  }
  const loadOptions: Loader.Options = { dereference: true }
  const loaded = await Loader.load(path, loadOptions, config)

  // if there is an error then return now
  const [definition] = loaded
  const exception = loaded.exception as DefinitionException
  if (loaded.hasError) return new DefinitionResult(definition, exception) // first param will be undefined because of error

  // initialize data object
  const version: string = definition.openapi ?? definition.swagger

  // run validation
  if (options.validate === true) {
    const data: ValidatorData = createComponentData('loading', RootComponent, DefinitionException, definition, version as Version)
    data.root.loadCache = config.cache as Record<string, any>
    data.root.loadOptions = {
      dereference: true, // everything must be dereferenced for a build
      validate: options?.validate ?? true
    }
    data.context.exception = exception
    RootComponent.validate(definition, version as Version, data)
    data.root.lastly.run(data) // we have to run lastly here because we passed the "data" into the validate function
  }

  // build the component if there are no errors
  if (exception.hasError) return new DefinitionResult(definition, exception) // first param will be undefined because of error
  const data: BuilderData = createComponentData('loading', RootComponent, Exception, definition, version as Version)
  data.root.loadCache = config.cache as Record<string, any>
  // @ts-expect-error
  const component = new RootComponent(definition, version, data)
  data.root.lastly.run(data) // we have to run lastly here because we passed the "data" into the constructor function
  return new DefinitionResult(component, exception)
}

// return true if additional validation can occur, false if it should not
function validate (data: ValidatorData): boolean {
  const { context } = data
  const { chain, exception, key } = context
  const { definition: componentDef } = data.component
  const { map, version } = data.root
  const schema = context.schema as SchemaAny
  const parent = chain[0]
  let definition = context.definition

  // if this definition should be ignored
  const ignored = typeof schema.ignored === 'function' ? schema.ignored(data.component) : schema.ignored
  if (typeof ignored === 'string') {
    if (definition !== undefined && key !== '') {
      const propertyIgnored = E.propertyIgnored(data, { node: chain[0].context.definition, key: key }, key, ignored)
      exception.message(propertyIgnored)
    }
    return false
  }

  // if null then validate nullable
  if (definition === null) {
    const nullable = typeof schema.nullable === 'function' ? schema.nullable(data.component) : schema.nullable
    if (nullable !== true) {
      const mustNotBeNull = E.mustNotBeNull(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' })
      exception.message(mustNotBeNull)
    } else {
      context.built = null
    }
    return false
  }

  // if default is used then set it
  if (definition === undefined && schema.default !== undefined) {
    if ('default' in schema) definition = typeof schema.default === 'function' ? schema.default(data.component) : schema.default
  }

  // if enum is invalid then exit
  if (schema.enum !== undefined) {
    const enumValues = typeof schema.enum === 'function' ? schema.enum(data.component) : schema.enum
    const found = enumValues.find((v: any) => same(v, definition))
    if (found === undefined) {
      const enumNotMet = E.enumNotMet(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, enumValues, definition)
      const { level } = exception.message(enumNotMet)
      if (level === 'error') return false
    }
  }

  // $ref property is only allowed for components, and only some of those. The exception is the Reference component that does allow it.
  const schemaAsComponent: SchemaComponent = schema as unknown as SchemaComponent
  const allowsRef: boolean = schemaAsComponent.type === 'component' &&
    typeof schemaAsComponent.allowsRef === 'function'
    ? schemaAsComponent.allowsRef(data.component)
    : schemaAsComponent.allowsRef as boolean
  const canBeRefDefinition: boolean = schema.type === 'any' || allowsRef
  let hasAccountedForRefError = false
  if (typeof definition === 'object' && '$ref' in definition && !canBeRefDefinition) {
    hasAccountedForRefError = true
    const $refNotAllowed = E.$refNotAllowed(data, { node: parent?.context.definition, key: parent?.context.key, type: 'key' })
    const { level } = exception.message($refNotAllowed)
    if (level === 'error') return false
  }

  // check if refs allowed and ref is set
  const hasRef = typeof definition === 'object' && '$ref' in definition
  if (hasRef && canBeRefDefinition) {
    const siblingProperties = Object.keys(definition).filter(k => k !== '$ref')
    if (siblingProperties.length > 0) {
      const $refIgnoresSiblings = E.$refIgnoresSiblings(data, { node: parent?.context.definition }, siblingProperties)
      const { level } = exception.message($refIgnoresSiblings)
      return level === 'error'
    } else {
      return true
    }
  } else if (hasRef && !canBeRefDefinition && !hasAccountedForRefError) {
    const $refNotAllowed = E.$refNotAllowed(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' })
    const { level } = exception.message($refNotAllowed)
    if (level === 'error') return false
  }

  if (schema.type === 'any') {
    context.built = copy(definition)
    return true
  } else if (schema.type === 'array') {
    const s = schema as unknown as SchemaArray
    if (!Array.isArray(definition)) {
      const invalidType = E.invalidType(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'an array', definition)
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    }

    // if instance already exists then return instance
    const store = map.get(schema)
    const found = store?.find(item => item.definition === definition)
    if (found !== undefined) {
      context.built = found.instance
      return true
    } else {
      // create reference for instance being created
      const storeItem: { definition: any, instance: any } = { definition, instance: [] }
      context.built = storeItem.instance
      if (!map.has(schema)) map.set(schema, [])
      map.get(schema)?.push(storeItem)

      // validate the correct number of items
      const itemCount = definition.length
      const maxItems: number | undefined = typeof s.maxItems === 'function' ? s.maxItems(data.component) : s.maxItems
      const minItems: number | undefined = typeof s.minItems === 'function' ? s.minItems(data.component) : s.minItems
      if (minItems !== undefined && itemCount < minItems) {
        const exceedsArrayLengthBounds = E.exceedsArrayLengthBounds(data, { node: parent?.context.definition, key: parent?.context.key, type: 'both' }, 'minItems', minItems, itemCount)
        const { level } = exception.message(exceedsArrayLengthBounds)
        if (level === 'error') return false
      }
      if (maxItems !== undefined && itemCount > maxItems) {
        const exceedsArrayLengthBounds = E.exceedsArrayLengthBounds(data, { node: parent?.context.definition, key: parent?.context.key, type: 'both' }, 'maxItems', maxItems, itemCount)
        const { level } = exception.message(exceedsArrayLengthBounds)
        if (level === 'error') return false
      }

      // process each item in the array
      let success = true
      const itemsSchema = typeof s.items === 'function' ? s.items(data.component) : s.items
      definition.forEach((def: any, i: number) => {
        const key = String(i)
        const child = createChildData(data, def, key, itemsSchema) as ValidatorData
        success = success && validate(child)
        context.built[i] = child.context.built
      })
      return success
    }
  } else if (schema.type === 'boolean') {
    if (typeof definition !== 'boolean') {
      const invalidType = E.invalidType(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'a boolean', definition)
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    } else {
      context.built = definition
    }
    return true
  } else if (schema.type === 'component') {
    // determine correct component
    const s = schema as unknown as SchemaComponent
    const component = s.component

    if (!isObject(definition)) {
      let prefix: 'a ' | 'an ' = 'a '
      switch (component.name) {
        case 'Encoding':
        case 'Example':
        case 'ExternalDocumentation':
        case 'Info':
        case 'Items':
        case 'OAuthFlow':
        case 'OAuthFlows':
        case 'OpenAPI':
        case 'Operation':
          prefix = 'an '
      }
      const invalidType = E.invalidType(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, prefix + component.name + ' object definition', definition)
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    }

    return mappable(component, data, {}, built => {
      const exception = component.validate(definition, version, data)
      return !exception.hasError // success
    })
  } else if (schema.type === 'number') {
    const s = schema as unknown as SchemaNumber
    let success = true
    if (typeof definition !== 'number') {
      const invalidType = E.invalidType(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'a number', definition)
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    }

    const isInteger = typeof s.integer === 'function' ? s.integer(data.component) : s.integer
    if (isInteger === true && definition % 1 !== 0) {
      const invalidType = E.invalidType(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'an integer', definition)
      const { level } = exception.message(invalidType)
      if (level === 'error') success = false
    }

    const maximum = typeof s.maximum === 'function' ? s.maximum(data.component) : s.maximum
    if (maximum !== undefined && definition > maximum) {
      const exceedsNumberBounds = E.exceedsNumberBounds(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'maximum', true, maximum, definition)
      const { level } = exception.message(exceedsNumberBounds)
      if (level === 'error') success = false
    }

    const minimum = typeof s.minimum === 'function' ? s.minimum(data.component) : s.minimum
    if (minimum !== undefined && definition < minimum) {
      const exceedsNumberBounds = E.exceedsNumberBounds(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'minimum', true, minimum, definition)
      const { level } = exception.message(exceedsNumberBounds)
      if (level === 'error') success = false
    }
    if (success) context.built = true
    return success
  } else if (schema.type === 'object') {
    // validate definition type
    if (!isObject(definition)) {
      const invalidType = E.invalidType(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'a non-null object', definition)
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    }

    return mappable(schema, data, {}, (built) => {
      const success = validateObjectProperties(built, data)
      context.built = built
      return success
    })
  } else if (schema.type === 'oneOf') {
    const s = schema as unknown as SchemaOneOf
    const match = s.oneOf.find(item => item.condition(data, componentDef))
    if (match === undefined) {
      const { level } = exception.message(s.error(data))
      return level === 'error'
    } else {
      const matchedSchema = typeof match.schema === 'function' ? match.schema(data.component) : match.schema
      return validate({
        root: data.root,
        component: data.component,
        context: Object.assign({}, data.context, { schema: matchedSchema })
      })
    }
  } else if (schema.type === 'string') {
    const s = schema as unknown as SchemaString
    let success = true
    if (typeof definition !== 'string') {
      const invalidType = E.invalidType(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'a string', definition)
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    }

    const maxLength = typeof s.maxLength === 'function' ? s.maxLength(data.component) : s.maxLength
    if (maxLength !== undefined && definition.length > maxLength) {
      const exceedsStringLengthBounds = E.exceedsStringLengthBounds(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'maxLength', maxLength, definition)
      const { level } = exception.message(exceedsStringLengthBounds)
      if (level === 'error') success = false
    }

    const minLength = typeof s.minLength === 'function' ? s.minLength(data.component) : s.minLength
    if (minLength !== undefined && definition.length < minLength) {
      const exceedsStringLengthBounds = E.exceedsStringLengthBounds(data, { node: parent?.context.definition, key: parent?.context.key, type: 'value' }, 'minLength', minLength, definition)
      const { level } = exception.message(exceedsStringLengthBounds)
      if (level === 'error') success = false
    }

    if (success) context.built = definition
    return success
  } else {
    return false
  }
}

function validateObjectProperties (context: any, data: ValidatorData): boolean {
  const { definition, exception } = data.context
  const schema = data.context.schema as SchemaObject
  const version = data.root.version

  const schemaProperties = schema.properties !== undefined ? schema.properties : []
  const missingRequiredProperties: string[] = []
  const validatedProperties: string[] = []
  const childrenData: { [key: string]: ValidatorData } = {}
  const notAllowedItems: NotAllowed[] = []
  const cache = data.component.cache

  // identify which properties are compatible with this version
  const versionProperties = schemaProperties
    .filter(prop => prop.versions === undefined || versionMatch(version, prop.versions))
    .map(prop => prop.name)

  // validate named properties and set defaults
  let success = true
  schemaProperties.forEach(prop => {
    const name = prop.name
    const propertySchema = typeof prop.schema === 'function' ? prop.schema(data.component) : prop.schema
    const child = childrenData[name] = createChildData(data, definition[name], name, propertySchema) as ValidatorData
    const notAllowed = typeof prop.notAllowed === 'function' ? prop.notAllowed(data.component) : prop.notAllowed
    const versionMismatch = prop.versions !== undefined ? !versionMatch(version, prop.versions) : false
    const allowed = notAllowed === undefined && !versionMismatch
    if (name in definition) {
      validatedProperties.push(name)
      if (versionMismatch) {
        if (!versionProperties.includes(name)) {
          notAllowedItems.push({
            name,
            reason: 'OpenAPI specification version ' + version + ' does not allow the "' + name + '" property' +
              (prop.versions !== undefined ? ', but these versions do: ' + prop.versions.join(', ') : '') + '.'
          })
        }
      } else if (!allowed) {
        notAllowedItems.push({
          name,
          reason: notAllowed as string
        })
      } else {
        if (prop.before !== undefined) prop.before(cache, data)
        const childSuccess = validate(child)
        if (childSuccess) {
          context[name] = child.context.built
          if (prop.after !== undefined) prop.after(cache, context[name], context, data)
        }
        success = success && childSuccess
      }
    } else if ((typeof prop.required === 'function' ? prop.required(data.component) : prop.required) === true && allowed) {
      missingRequiredProperties.push(name)
    } else if ('default' in propertySchema && allowed) {
      context[name] = child.context.built = typeof propertySchema.default === 'function' ? propertySchema.default(data.component) : propertySchema.default
    }
  })

  // validate other definition properties
  const additionalProperties = typeof schema.additionalProperties === 'function'
    ? schema.additionalProperties(data.component)
    : schema.additionalProperties ?? false
  const allowsSchemaExtensions = typeof schema.allowsSchemaExtensions === 'function'
    ? schema.allowsSchemaExtensions(data.component)
    : schema.allowsSchemaExtensions
  Object.keys(definition).forEach(key => {
    // if property already validated then don't validate against additionalProperties
    if (validatedProperties.includes(key)) return

    // if a schema extension
    if (rx.extension.test(key)) {
      if (!allowsSchemaExtensions && key !== 'x-enforcer') {
        const extensionNotAllowed = E.extensionNotAllowed(data, { node: definition, key, type: 'key' })
        exception.message(extensionNotAllowed)
        if (extensionNotAllowed.level === 'error') success = false
      }
      return
    }

    // if a $ref then this has alrady been addressed earlier in the function
    if (key === '$ref') return

    // validate property
    const def = definition[key]
    if (additionalProperties === false) {
      notAllowedItems.push({
        name: key,
        reason: 'Property not part of the specification.'
      })
    } else {
      const child = createChildData(data, def, key, additionalProperties.schema) as ValidatorData
      const childSuccess = validate(child)
      if (childSuccess) context[key] = child.context.built
      success = success && childSuccess
    }
  })

  // report any properties that are not allowed
  if (notAllowedItems.length > 0) {
    let notAllowedErrorCount = 0
    notAllowedItems.sort((a: NotAllowed, b: NotAllowed) => a.name < b.name ? -1 : 1)
    notAllowedItems.forEach(reason => {
      const propertyNotAllowed = E.propertyNotAllowed(data, { node: definition, key: reason.name, type: 'key' }, reason.name, reason.reason)
      const { level } = exception.message(propertyNotAllowed)
      if (level === 'error') notAllowedErrorCount++
    })
    if (notAllowedErrorCount > 0) success = false
  }

  // report on missing required properties
  if (missingRequiredProperties.length > 0) {
    const eMissingRequiredProperties = E.missingRequiredProperties(data, { node: definition }, missingRequiredProperties)
    const { level } = exception.message(eMissingRequiredProperties)
    if (level === 'error') success = false
  }

  // if (success) context.built = built
  return success
}

function renameExtension (key: string): string {
  return key
    .replace(/^x-/, '')
    .replace(/(-\w)/g, k => k[1].toUpperCase())
}

function mappable (key: any, data: Data, value: any, handler: (value: any) => any): any {
  const { map } = data.root
  const { definition } = data.context

  // if instance already exists then return instance
  const store = map.get(key)
  const found = store?.find(item => item.definition === definition)
  if (found !== undefined) {
    data.context.built = found.instance
    return data.context.built
  } else {
    if (!map.has(key)) map.set(key, [])
    map.get(key)?.push({
      definition,
      instance: value
    })
    data.context.built = value

    return handler(value)
  }
}

function versionMatch (current: Version, versions: string[]): boolean {
  const [major, minor, patch] = current.split('.')
  const length = versions.length
  for (let i = 0; i < length; i++) {
    const [a, b, c] = (versions[i] + '.x.x').split('.')
    if (major === a && (b === 'x' || minor === b) && (c === 'x' || patch === c)) return true
  }
  return false
}
