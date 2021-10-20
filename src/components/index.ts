import * as Config from '../config'
import { Exception } from '../Exception'
import * as E from '../Exception/methods'
import rx from '../rx'
import { copy, isObject, same, smart } from '../util'
import { LoaderMetadata } from '../loader'
import { Result } from '../Result'
import * as Loader from '../loader'
import { Definition as OperationDefinition } from './Operation'
import { Definition as SecuritySchemeDefinition } from './SecurityScheme'
import { ExceptionMessageDataInput } from '../Exception/types'

export {
  Exception
}

export interface ComponentSchema<Definition=any> {
  // define whether the component allows "x-"" extensions
  allowsSchemaExtensions: boolean
  additionalProperties?: boolean | Schema
  properties?: SchemaProperty[]
  builder?: {
    // Run post-build code. Errors can be produced here, but should generally not be as that is the job of the validator.
    after?: (data: Data<Definition>) => void

    // Run pre-build code. Returning false will stop follow up building. Errors can be produced here, but should generally not be as that is the job of the validator.
    before?: (data: Data<Definition>) => boolean
  }
  validator?: {
    // Run additional custom validation code after component has proven valid and built. This will not run if the validation failed.
    after?: (data: Data<Definition>) => void

    // Run custom code before validate. Returning false will stop follow up validations.
    before?: (data: Data<Definition>) => boolean
  }
}

interface MapItem {
  definition: any
  instance: any
}

export interface Data<Definition=any> {
  // unchanging values
  root: {
    data: Data
    finally: Array<(data: Data) => void>
    loadCache: Record<string, any>
    major: number
    map: Map<any, MapItem[]>
    metadata: {
      [key: string]: any
      operationIdMap: {
        [operationId: string]: Array<Data<OperationDefinition>>
      }
      securitySchemes: {
        [name: string]: Data<SecuritySchemeDefinition>
      }
    }
    version: Version
  }

  // changes per component
  component: {
    constructor: ExtendedComponent
    data: Data
    definition: any
    reference: string // component reference
    schema: ComponentSchema
  }

  // always changing values
  context: {
    built: Definition
    chain: Data[]
    children: { [p: string]: Data }
    definition: Definition
    exception: Exception
    key: string
    schema: Schema
  }
}

export interface LoaderOptions {
  dereference?: boolean
  validate?: boolean
}

interface NotAllowed {
  name: string
  reason: string
}

export type Schema = SchemaAny | SchemaArray | SchemaBoolean | SchemaComponent | SchemaNumber | SchemaOneOf | SchemaString | SchemaObject

interface SchemaBase {
  // Set the default.
  default?: any

  // Get array of possible values.
  enum?: any[]

  // Determine if validation should be skipped.
  ignored?: boolean

  // Determine if value can be null
  nullable?: boolean
}

/**
 * The following block of code defines types and interfaces that make it easier
 * to interact as a developer with the components and their properties, especially
 * in the case where a property may be a reference or it may be another component.
 *
 * By default, all constructed components will assume that derferencing has
 * occurred. If a `load` function is called without dereferencing then the
 * component will be marked as referenced and all referencable properties
 * will be marked as references.
 *
 * Components that allow references can be manually typed by using the Dereference,
 * DereferenceUnknown, or Reference generics, as can be seen in the following examples:
 *
 * Example of OpenAPI component with all references implicitly resolved:
 * const openapi = new OpenAPI({ ... })
 *
 * Example of OpenAPI component with all references explicitly resolved:
 * const openapi = new OpenAPI<Dereferenced>({ ... })
 *
 * Example of OpenAPI component with all references explicitly unresolved:
 * const openapi = new OpenAPI<Referenced>({ ... })
 *
 * Example of OpenAPI component will all references explicitly unknown if resolved:
 * const openapi = new OpenAPI<ReferencedUnknown>({ ... })
 */
export interface Dereferenced { ref: 'dereferenced' }
export interface Referenced { ref: 'referenced' }
export interface ReferencedUnknown { ref: 'dereferenced-unknown' }
export type Referencable<HasReference, T> =
  HasReference extends Referenced ? Reference :
    HasReference extends ReferencedUnknown ? T | Reference : T
/**
 * End of dereference types and interfaces.
 */

export interface SchemaAny extends SchemaBase {
  type: 'any'
}

export interface SchemaArray extends SchemaBase {
  type: 'array'
  items: Schema
}

export interface SchemaBoolean extends SchemaBase {
  type: 'boolean'
}

export interface SchemaComponent extends SchemaBase {
  type: 'component'
  allowsRef: boolean
  component: ExtendedComponent
}

interface SchemaConditional {
  condition: (data: Data, componentDefinition: any) => boolean
  schema: Schema
}

export interface SchemaNumber extends SchemaBase {
  type: 'number'
  integer?: boolean
  maximum?: number
  minimum?: number
}

export interface SchemaOneOf extends SchemaBase {
  type: 'oneOf'
  oneOf: SchemaConditional[]
  error: (data: Data) => ExceptionMessageDataInput
}

export interface SchemaString extends SchemaBase {
  type: 'string'
  maxLength?: number
  minLength?: number
}

export interface SchemaObject extends SchemaBase {
  type: 'object'
  allowsSchemaExtensions: boolean
  additionalProperties?: boolean | Schema
  properties?: SchemaProperty[]
}

export interface SchemaProperty<SchemaType=Schema> {
  name: string
  notAllowed?: string // If this property could be allowed in certain circumstances but is not currently allowed then we provide a string here indicating why it is currently not allowed.
  required?: boolean
  schema: SchemaType
  versions?: string[]
}

export interface SpecMap {
  '2.0'?: string
  '3.0.0'?: string
  '3.0.1'?: string
  '3.0.2'?: string
  '3.0.3'?: string
}

export type Version = '2.0' | '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'

export interface ExtendedComponent<T extends OASComponent=any> {
  new (definition: any, version?: Version, ...args: any[]): T
  spec: SpecMap
  schemaGenerator: (data: Data) => ComponentSchema
  validate: (definition: any, version?: Version, ...args: any[]) => Exception
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class OASComponent<Definition=any> {
  protected constructor (Component: ExtendedComponent, definition: Definition, version?: Version, incomingData?: Data<Definition>) {
    const data: Data<Definition> = incomingData === undefined
      ? createComponentData('constructing', Component, definition, version, incomingData)
      : incomingData
    const { builder } = data.component.schema
    const { map } = data.root
    data.context.built = this

    // register the use of this component with this definition
    if (!map.has(this.constructor)) map.set(this.constructor, [])
    map.get(this.constructor)?.push({ definition, instance: this })

    // run before function if set
    if (typeof builder?.before === 'function') {
      if (!builder.before(data)) return data.context.exception
    }

    // run build
    buildObjectProperties(this, data)

    // run after function if set
    if (typeof builder?.after === 'function') builder.after(data)

    // trigger finally hooks if this is root
    if (incomingData === undefined) data.root.finally.forEach(fn => fn(data))
  }

  static extend (): void {

  }

  static get spec (): SpecMap {
    return {}
  }

  static schemaGenerator (data: Data): ComponentSchema {
    return {
      allowsSchemaExtensions: false
    }
  }

  // All classes that inherit this static method will overwrite it and call it directly, hiding the
  // third parameters from users of the library.
  static validate (definition: any, version?: Version, incomingData?: Data): Exception {
    const component = this as unknown as ExtendedComponent
    const data: Data = createComponentData('validating', component, definition, version, incomingData)
    const { context, root } = data
    const { validator } = data.component.schema
    const { chain, exception } = context
    const { version: v } = root
    const reference = data.component.reference
    const parent = chain[0]

    // check that this component is allowed for the active version
    if (component.spec[v] === undefined) {
      const invalidVersionForComponent = E.invalidVersionForComponent(component.name, v, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'both' }],
        reference
      })
      exception.message(invalidVersionForComponent)
      return exception
    }

    // run before function if set
    if (typeof validator?.before === 'function') {
      if (!validator.before(data)) return data.context.exception
    }

    // run schema validators
    const success = validate(data)
    if (success) {
      // run after function if set
      if (typeof validator?.after === 'function') validator.after(data)

      // trigger finally hooks if this is root
      if (incomingData === undefined) root.finally.forEach(fn => fn(data))
    }

    return exception
  }
}

export interface ReferenceDefinition {
  $ref: string
}

const referenceSchema: ComponentSchema<ReferenceDefinition> = {
  allowsSchemaExtensions: false,
  properties: [
    {
      name: '$ref',
      required: true,
      schema: {
        type: 'string'
      }
    }
  ]
}

export class Reference extends OASComponent {
  $ref!: string

  constructor (definition: ReferenceDefinition, version?: Version) {
    super(Reference, definition, version, arguments[2])
  }

  async load (validate?: boolean): Promise<OASComponent> {
    // TODO: implement this load function that will load the reference

    // identify current file location (use associated Data to determine context)

    // load file and find relevant node

    // optionally validate the loaded node

    // replace reference with found node

    // @ts-expect-error
    return null
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#reference-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#reference-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#reference-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#reference-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#reference-object'
  }

  static schemaGenerator (): ComponentSchema<ReferenceDefinition> {
    return referenceSchema
  }
}

// The following class is used for conditional typing
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ReferenceUnknown {}

export function build (data: Data): any {
  const { context, root } = data
  const { definition: componentDef } = data.component
  const { map, version } = root
  const { schema } = context
  const { definition } = context

  if (definition === undefined && 'default' in schema) {
    return schema.default
  } else {
    // if there is a $ref then build a Reference instance
    const hasRef = typeof definition === 'object' && definition !== null && '$ref' in definition
    if (hasRef) {
      // check if the definition has been used with this component previously, otherwise create the component
      const store = map.get(Reference)
      const found = store?.find(item => item.definition === definition)
      if (found !== undefined) {
        return found.instance
      } else {
        // @ts-expect-error
        return new Reference(definition, version, data)
      }
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
          const child = createChildData(data, def, key, schema.items)
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
        const child = Object.assign({}, data, { schema: match.schema })
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
function buildObjectProperties (context: any, data: Data): void {
  const { definition } = data.context
  const { definition: componentDef } = data.component
  const schema = data.context.schema as SchemaObject
  const properties = schema.properties !== undefined ? schema.properties : []
  const remainingProperties: string[] = Object.keys(definition)
  properties.forEach((prop: SchemaProperty) => {
    const name = prop.name
    const child = createChildData(data, definition[name], name, prop.schema)
    const allowed = prop.notAllowed === undefined

    // get the built value
    let value: any
    let found = false
    if (name in definition) {
      value = build(child)
      found = true
    } else if ('default' in prop.schema && allowed) {
      value = prop.schema.default(child, componentDef)
      found = true
    }
    if (value !== undefined) context[name] = value

    // if this property has been processed then remove from remaining properties
    if (found) {
      const index = remainingProperties.indexOf(name)
      if (index !== -1) remainingProperties.splice(index, 1)
    }
  })

  // default to excluding additional properties from build
  const additionalProperties: boolean | Schema = schema.additionalProperties !== undefined ? schema.additionalProperties : false
  const allowsSchemaExtensions = schema.allowsSchemaExtensions
  remainingProperties.forEach((key: string) => {
    const def = definition[key]
    if ((allowsSchemaExtensions && rx.extension.test(key)) || additionalProperties === true) {
      context[key] = def
    } else if (additionalProperties !== false) {
      const child = createChildData(data, definition[key], key, additionalProperties)
      const value: any = build(child)
      if (value !== undefined) context[key] = value
    }
  })
}

export function createChildData (data: Data, definition: any, key: string, schema: Schema): Data {
  const chain = data.context.chain.slice(0)
  chain.unshift(data)
  const childData = {
    root: data.root,
    component: data.component,
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

export function createComponentData<Definition> (action: 'constructing' | 'loading' | 'validating', component: ExtendedComponent, definition: Definition, version?: Version, data?: Data): Data {
  const v: Version = version === undefined ? Config.get().version : version

  const componentData: Data = {
    // @ts-expect-error - allow root.data to equal null
    root: data === undefined
      ? {
          data: null,
          finally: [],
          loadCache: {},
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
      constructor: component,
      // @ts-expect-error
      data: data === undefined ? null : data,
      definition,
      reference: component.spec[v] as string,
      schema: { allowsSchemaExtensions: true } // schema will be replaced momentarily
    },
    context: {
      built: {},
      chain: data?.context.chain ?? [],
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

  // if this is the root data object then assign root and component data properties to self
  if (data === undefined) {
    componentData.root.data = componentData
    componentData.component.data = componentData
  }

  // generate component schema and assign to component data
  const componentSchema = component.schemaGenerator(componentData)
  componentData.component.schema = componentSchema
  componentData.context.schema = {
    type: 'object',
    allowsSchemaExtensions: componentSchema.allowsSchemaExtensions,
    additionalProperties: componentSchema.additionalProperties,
    properties: componentSchema.properties
  }

  return componentData
}

export function normalizeLoaderOptions (options?: LoaderOptions): Required<LoaderOptions> {
  if (options === undefined) options = {}
  if (options.dereference === undefined) options.dereference = true
  if (options.validate === undefined) options.validate = true
  return options as Required<LoaderOptions>
}

// this is the code for loading either the OpenAPI or Swagger document
export async function loadRoot<T> (RootComponent: ExtendedComponent, path: string, options?: LoaderOptions): Promise<Result<T>> {
  options = normalizeLoaderOptions(options)

  // load file with dereference
  const config: LoaderMetadata = {
    cache: {},
    exception: new Exception('One or more [TYPE] found while loading ' + RootComponent.name + ' document')
  }
  const loaded = await Loader.load(path, { dereference: options.dereference }, config)

  // if there is an error then return now
  const [definition] = loaded
  const exception = loaded.exception as Exception
  if (loaded.hasError) return new Result(definition, exception) // first param will be undefined because of error

  // initialize data object
  const version: string = definition.openapi ?? definition.swagger
  const data = createComponentData('loading', RootComponent, definition, version as Version)
  data.loadCache = config.cache as Record<string, any>
  data.exception = exception

  // run validation then reset some data properties
  // @ts-expect-error
  if (options.validate === true) RootComponent.validate(definition, version, data)
  data.map = new Map()
  data.component.finally = []

  // build the component if there are no errors
  if (exception.hasError) return new Result(definition, exception) // first param will be undefined because of error
  // @ts-expect-error
  const component = new RootComponent(definition, version, data)
  return new Result(component, exception)
}

// return true if additional validation can occur, false if it should not
export function validate (data: Data): boolean {
  const { context } = data
  const { chain, exception } = context
  const { definition: componentDef, reference } = data.component
  const { map, version } = data.root
  const schema = context.schema as SchemaAny
  const parent = chain[0]
  let definition = context.definition

  // if this definition should be ignored
  if (schema.ignored === true) return false

  // if null then validate nullable
  if (definition === null) {
    if (schema.nullable !== true) {
      const mustNotBeNull = E.mustNotBeNull({
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      exception.message(mustNotBeNull)
    } else {
      context.built = null
    }
    return false
  }

  // if default is used then set it
  if (definition === undefined && schema.default !== undefined) {
    if ('default' in schema) definition = schema.default
  }

  // if enum is invalid then exit
  if (schema.enum !== undefined) {
    const found = schema.enum.find((v: any) => same(v, definition))
    if (found === undefined) {
      const enumNotMet = E.enumNotMet(schema.enum, definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(enumNotMet)
      if (level === 'error') return false
    }
  }

  // $ref property is only allowed for components, and only some of those. The exception is the Reference component that does allow it.
  const isRefComponent = data.component.constructor === Reference
  if (typeof definition === 'object' && '$ref' in definition && schema.type !== 'any' && schema.type !== 'component' && !isRefComponent) {
    const $refNotAllowed = E.$refNotAllowed({
      definition,
      locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'key' }],
      reference
    })
    const { level } = exception.message($refNotAllowed)
    if (level === 'error') return false
  }

  // check if refs allowed and ref is set
  const hasRef = typeof definition === 'object' && '$ref' in definition
  if (hasRef && !isRefComponent) {
    const s = schema as unknown as SchemaComponent
    if (!s.allowsRef) {
      const $refNotAllowed = E.$refNotAllowed({
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message($refNotAllowed)
      if (level === 'error') return false
    }
  }

  if (schema.type === 'any') {
    context.built = copy(definition)
    return true
  } else if (schema.type === 'array') {
    const s = schema as unknown as SchemaArray
    if (!Array.isArray(definition)) {
      const invalidType = E.invalidType('an array', definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
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

      // process each item in the array
      let success = true
      definition.forEach((def: any, i: number) => {
        const key = String(i)
        const child = createChildData(data, def, key, s.items)
        success = success && validate(child)
        context.built[i] = child.context.built
      })
      return success
    }
  } else if (schema.type === 'boolean') {
    if (typeof definition !== 'boolean') {
      const invalidType = E.invalidType('a boolean', definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    } else {
      context.built = definition
    }
    return true
  } else if (schema.type === 'component') {
    if (!isObject(definition)) {
      const invalidType = E.invalidType('a non-null object', definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    }

    // determine correct component
    const s = schema as unknown as SchemaComponent
    const component = hasRef ? Reference : s.component

    return mappable(component, data, {}, built => {
      const componentData = createComponentData('validating', component, definition, version, data)
      componentData.context.built = built
      const exception = component.validate(definition, version, componentData)
      const success = !exception.hasError
      return success
    })
  } else if (schema.type === 'number') {
    const s = schema as unknown as SchemaNumber
    let success = true
    if (typeof definition !== 'number') {
      const invalidType = E.invalidType('a number', definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    }
    if (s.integer === true && definition % 1 !== 0) {
      const invalidType = E.invalidType('an integer', definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(invalidType)
      success = level === 'error'
    }
    if (s.maximum !== undefined && definition > s.maximum) {
      const exceedsNumberBounds = E.exceedsNumberBounds('maximum', true, s.maximum, definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(exceedsNumberBounds)
      success = level === 'error'
    }
    if (s.minimum !== undefined && definition < s.minimum) {
      const exceedsNumberBounds = E.exceedsNumberBounds('minimum', true, s.minimum, definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(exceedsNumberBounds)
      success = level === 'error'
    }
    if (success) context.built = true
    return success
  } else if (schema.type === 'object') {
    // validate definition type
    if (!isObject(definition)) {
      const invalidType = E.invalidType('a non-null object', definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    }

    return mappable(schema, data, {}, (built) => {
      const schema = data.context.schema as SchemaObject

      const schemaProperties = schema.properties !== undefined ? schema.properties : []
      const missingRequiredProperties: string[] = []
      const validatedProperties: string[] = []
      const childrenData: { [key: string]: Data } = {}
      const notAllowed: NotAllowed[] = []

      // identify which properties are compatible with this version
      const versionProperties = schemaProperties
        .filter(prop => prop.versions === undefined || versionMatch(version, prop.versions))
        .map(prop => prop.name)

      // validate named properties and set defaults
      let success = true
      schemaProperties.forEach(prop => {
        const name = prop.name
        const child = childrenData[name] = createChildData(data, definition[name], name, prop.schema)
        const allowed = prop.notAllowed === undefined
        const versionMismatch = prop.versions !== undefined ? !versionMatch(version, prop.versions) : false
        if (name in definition) {
          validatedProperties.push(name)
          if (versionMismatch) {
            if (!versionProperties.includes(name)) {
              notAllowed.push({
                name,
                reason: 'Not part of OpenAPI specification version ' + version
              })
            }
          } else if (!allowed) {
            notAllowed.push({
              name,
              reason: prop.notAllowed as string
            })
          } else {
            const childSuccess = validate(child)
            if (childSuccess) built[name] = child.context.built
            success = success && childSuccess
          }
        } else if (prop.required === true && allowed) {
          missingRequiredProperties.push(name)
        } else if ('default' in prop.schema && allowed) {
          built[name] = child.context.built = prop.schema.default
        }
      })

      // validate other definition properties
      const additionalProperties: Schema | boolean = (() => {
        if (schema.additionalProperties === undefined) return false
        if (typeof schema.additionalProperties === 'boolean') return schema.additionalProperties
        return schema.additionalProperties
      })()
      Object.keys(definition).forEach(key => {
        // if property already validated then don't validate against additionalProperties
        if (validatedProperties.includes(key)) return

        // if a schema extension
        if (rx.extension.test(key)) {
          if (!schema.allowsSchemaExtensions && key !== 'x-enforcer') {
            const extensionNotAllowed = E.extensionNotAllowed({
              definition: definition[key],
              locations: [{ node: definition, key, type: 'key' }],
              reference
            })
            exception.message(extensionNotAllowed)
            if (extensionNotAllowed.level === 'error') success = false
          }
          return
        }

        // validate property
        const def = definition[key]
        if (additionalProperties === false) {
          notAllowed.push({
            name: key,
            reason: 'Property not part of the specification.'
          })
        } else if (additionalProperties !== true) {
          const child = createChildData(data, def, key, additionalProperties)
          const childSuccess = validate(child)
          if (childSuccess) built[key] = child.context.built
          success = success && childSuccess
        } else {
          built[key] = def
        }
      })

      // report any properties that are not allowed
      if (notAllowed.length > 0) {
        let notAllowedErrorCount = 0
        notAllowed.sort((a: NotAllowed, b: NotAllowed) => a.name < b.name ? -1 : 1)
        notAllowed.forEach(reason => {
          const propertyNotAllowed = E.propertyNotAllowed(reason.name, reason.reason, {
            definition,
            locations: [{ node: definition, key: reason.name, type: 'key' }],
            reference
          })
          const { level } = exception.message(propertyNotAllowed)
          if (level === 'error') notAllowedErrorCount++
        })
        if (notAllowedErrorCount > 0) success = false
      }

      // report on missing required properties
      if (missingRequiredProperties.length > 0) {
        const eMissingRequiredProperties = E.missingRequiredProperties(missingRequiredProperties, {
          definition,
          locations: [{ node: definition }],
          reference
        })
        const { level } = exception.message(eMissingRequiredProperties)
        success = level === 'error'
      }

      if (success) context.built = built
      return success
    })
  } else if (schema.type === 'oneOf') {
    const s = schema as unknown as SchemaOneOf
    const match = s.oneOf.find(item => item.condition(data, componentDef))
    if (match === undefined) {
      const { level } = exception.message(s.error(data))
      return level === 'error'
    } else {
      return validate({
        root: data.root,
        component: data.component,
        context: Object.assign({}, data.context, { schema: match.schema })
      })
    }
  } else if (schema.type === 'string') {
    const s = schema as unknown as SchemaString
    let success = true
    if (typeof definition !== 'string') {
      const invalidType = E.invalidType('a string', definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(invalidType)
      if (level === 'error') return false
    }
    if (s.maxLength !== undefined && definition.length > s.maxLength) {
      const exceedsStringLengthBounds = E.exceedsStringLengthBounds('maxLength', s.maxLength, definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(exceedsStringLengthBounds)
      if (level === 'error') success = false
    }
    if (s.minLength !== undefined && definition.length < s.minLength) {
      const exceedsStringLengthBounds = E.exceedsStringLengthBounds('minLength', s.minLength, definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(exceedsStringLengthBounds)
      if (level === 'error') success = false
    }

    if (success) context.built = definition
    return success
  } else {
    return false
  }
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
