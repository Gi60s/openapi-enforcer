// import * as Config from '../utils/config'
import { DefinitionException } from '../DefinitionException'
import * as E from '../DefinitionException/methods'
import rx from '../utils/rx'
import { copy, getLatestSpecVersion, isObject, same, smart } from '../utils/util'
import { LoaderMetadata } from '../utils/loader'
import { DefinitionResult } from '../DefinitionException/DefinitionResult'
import * as Loader from '../utils/loader'
import { ExceptionMessageDataInput, Level } from '../DefinitionException/types'
import {
  Operation2 as OperationDefinition2,
  Operation3 as OperationDefinition3,
  SecurityScheme2 as SecuritySchemeDefinition2,
  SecurityScheme3 as SecuritySchemeDefinition3,
  Reference as ReferenceDefinition
} from './helpers/DefinitionTypes'

export {
  DefinitionException,
  ReferenceDefinition
}

type OperationDefinition = OperationDefinition2 | OperationDefinition3
type SecuritySchemeDefinition = SecuritySchemeDefinition2 | SecuritySchemeDefinition3

export interface ComponentSchema<Definition=any> {
  // define whether the component allows "x-"" extensions
  allowsSchemaExtensions: boolean
  additionalProperties?: {
    namespace: string
    schema: Schema
  }
  properties?: SchemaProperty[]
  builder?: {
    // Run post-build code. Errors can be produced here, but should generally not be as that is the job of the validator.
    after?: (data: Data<Definition>, enforcer: EnforcerData<Definition>) => void

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

interface DataMetadata {
  [key: string]: any
  operationIdMap: {
    [operationId: string]: Array<Data<OperationDefinition>>
  }
  securitySchemes: {
    [name: string]: Data<SecuritySchemeDefinition>
  }
}

export interface Data<Definition=any> {
  // unchanging values
  root: {
    data: Data
    lastly: Lastly
    loadCache: Record<string, any>
    loadOptions: Loader.Options
    major: number
    map: Map<any, MapItem[]>
    metadata: DataMetadata
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
    chain: Chain
    children: { [p: string]: Data }
    definition: Definition
    exception: DefinitionException
    key: string
    schema: Schema
  }
}

export interface EnforcerData<Definition, Extension=EnforcerExtension> {
  [key: string]: any
  data: Data<Definition>
  extensions: Extension
  metadata: DataMetadata
  findAncestor: <T>(component: ExtendedComponent) => T | undefined
  findAncestorData: (component: ExtendedComponent) => Data<Definition> | undefined
}

export interface EnforcerExtension {
  exceptions?: Record<string, Level> // the key is the code to modify the level on and the value is the new level
  nullable?: boolean
}

export interface EnforcerExtensionSchema extends EnforcerExtension {
  populate?: {
    condition?: string // The name of the parameter to check for truthy value before populating the value
    default?: any // When populating, overwrite the schema default with this value. If the type is a string then replacement may occur.
    id?: string // The parameter name to use to find the replacement value. String replacement will not occur.
    replacement?: 'colon' | 'doubleHandlebar' | 'handlebar' | 'none' // Set to none to skip parameter replacement.
    useDefault?: boolean // Set to false to prevent the default value from being used during populate.
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
  ignored?: false | string

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
  maxItems?: number
  minItems?: number
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
  additionalProperties?: {
    namespace?: string
    schema: Schema
  }
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
  validate: (definition: any, version?: Version, ...args: any[]) => DefinitionException
}

export const Enforcer = Symbol('Enforcer')

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class OASComponent<Definition=any> {
  readonly enforcer: EnforcerData<Definition>

  protected constructor (Component: ExtendedComponent, definition: Definition, version?: Version, incomingData?: Data<Definition>) {
    const data: Data<Definition> = createComponentData('constructing', Component, definition, version, incomingData)
    const { builder } = data.component.schema
    const { map } = data.root
    data.context.built = this as unknown as Definition
    this.enforcer = {
      data,
      metadata: data.root.metadata,
      extensions: (data.context.definition as any)['x-enforcer'] ?? {},
      findAncestor<T> (component: ExtendedComponent): T | undefined {
        const ancestorData = findAncestor(data, component as unknown as ExtendedComponent)
        if (ancestorData === undefined) return
        return ancestorData.context.built as T
      },
      findAncestorData (component: ExtendedComponent): Data<Definition> | undefined {
        return findAncestor(data, component)
      }
    }

    // maybe add the extension object
    if ('allowsSchemaExtensions' in data.context.schema && data.context.schema.allowsSchemaExtensions) {
      // @ts-expect-error
      this.extensions = {}
    }

    // register the use of this component with this definition
    if (!map.has(this.constructor)) map.set(this.constructor, [])
    map.get(this.constructor)?.push({ definition, instance: this })

    // run before function if set
    if (typeof builder?.before === 'function') {
      if (!builder.before(data)) return
    }

    // run build
    buildObjectProperties(this, data)

    // run after function if set
    if (typeof builder?.after === 'function') builder.after(data, this.enforcer)

    // trigger lastly hooks if this is root
    if (incomingData === undefined) data.root.lastly.run(data)
  }

  static extend (): void {

  }

  static spec = {}

  static schemaGenerator (data: Data): ComponentSchema {
    return {
      allowsSchemaExtensions: false
    }
  }

  // All classes that inherit this static method will overwrite it and call it directly, hiding the
  // third parameters from users of the library.
  static validate (definition: any, version?: Version, incomingData?: Data): DefinitionException {
    const component = this as unknown as ExtendedComponent
    const data: Data = createComponentData('validating', component, definition, version, incomingData)
    const { context, root } = data
    const { validator } = data.component.schema
    const { chain, exception } = context
    const { version: v } = root
    const reference = data.component.reference
    const parent = chain[0]

    if (incomingData !== undefined) context.built = incomingData.context.built

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
    const success = validateObjectProperties(data.context.built, data)
    if (success) {
      // run after function if set
      if (typeof validator?.after === 'function') validator.after(data)

      // trigger lastly hooks if this is root
      if (incomingData === undefined) root.lastly.run(data)
    }

    return exception
  }
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

  static validate (definition: ReferenceDefinition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
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
        const child = {
          root: data.root,
          component: data.component,
          context: Object.assign({}, data.context, { schema: match.schema })
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
function buildObjectProperties (context: any, data: Data): void {
  const { definition } = data.context
  const schema = data.context.schema as SchemaObject
  const properties = schema.properties !== undefined ? schema.properties : []
  const remainingProperties: string[] = Object.keys(definition)
  properties.forEach((prop: SchemaProperty) => {
    const name = prop.name
    const propSchema = prop.schema
    const child = createChildData(data, definition[name], name, propSchema)
    const allowed = prop.notAllowed === undefined

    // get the built value
    let value: any
    let found = false
    if (typeof propSchema.ignored === 'string') {
      found = true
    } else if (name in definition) {
      value = build(child)
      found = true
    } else if ('default' in prop.schema && allowed) {
      value = prop.schema.default
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
  const additionalProperties = schema.additionalProperties !== undefined ? schema.additionalProperties : false
  const allowsSchemaExtensions = schema.allowsSchemaExtensions
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
      const child = createChildData(data, definition[key], key, additionalProperties.schema)
      const value: any = build(child)
      if (value !== undefined) additionalPropertiesContext[key] = value
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
  const v: Version = version === undefined ? getLatestSpecVersion(component.spec) as Version : version

  const componentData: Data = {
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
      constructor: component,
      // @ts-expect-error
      data: null,
      definition,
      reference: component.spec[v] as string,
      schema: { allowsSchemaExtensions: true } // schema will be replaced momentarily
    },
    context: {
      built: {},
      chain: data?.context.chain ?? new Chain(),
      children: data?.context.children ?? {},
      definition: definition,
      exception: data?.context.exception ?? new DefinitionException('One or more [TYPE] found while ' + action + ' ' + component.name + ' object' + ':'),
      key: data?.context.key ?? '',
      schema: {
        type: 'object',
        allowsSchemaExtensions: true
      }
    }
  }
  componentData.component.data = componentData

  // if this is the root data object then assign root to self
  if (data === undefined) componentData.root.data = componentData

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

class Chain extends Array<Data> {
  toString (): string {
    const start = this.length - 1
    const ar: string[] = []
    for (let i = start; i >= 0; i--) {
      let node: Data = this[i]
      let value = node.context.key
      if (node === node.component.data) value += ' [' + node.component.constructor.name + ']'
      node = node.context.chain[0]
      ar.push(value)
    }
    return ar.join(' > ')
  }
}

class Lastly extends Array<(data: Data) => void> {
  private completedData: Data | undefined = undefined

  push (...items: Array<(data: Data) => void>): number {
    let count = super.push(...items)
    if (this.completedData !== undefined) {
      this.run(this.completedData)
      count = 0
    }
    return count
  }

  run (data: Data): void {
    let done = false
    do {
      const fn = this.shift()
      if (fn === undefined) {
        done = true
      } else {
        fn(data)
      }
    } while (!done)
    this.completedData = data
  }
}

export function findAncestor<Definition> (data: Data, component: ExtendedComponent): Data<Definition> | undefined {
  let node: Data | undefined = data.component.data
  do {
    node = node.context.chain[0]?.component.data
    if (node?.component.constructor === component) return node
  } while (node !== undefined)
}

export function normalizeLoaderOptions (options?: LoaderOptions): Required<LoaderOptions> {
  if (options === undefined) options = {}
  if (options.dereference === undefined) options.dereference = true
  if (options.validate === undefined) options.validate = true
  return options as Required<LoaderOptions>
}

// this is the code for loading either the OpenAPI or Swagger document
export async function loadRoot<T> (RootComponent: ExtendedComponent, path: string, options?: LoaderOptions): Promise<DefinitionResult<T>> {
  options = normalizeLoaderOptions(options)

  // load file with dereference
  const config: LoaderMetadata = {
    cache: {},
    exception: new DefinitionException('One or more [TYPE] found while loading ' + RootComponent.name + ' document')
  }
  const loadOptions: Loader.Options = { dereference: options.dereference }
  const loaded = await Loader.load(path, loadOptions, config)

  // if there is an error then return now
  const [definition] = loaded
  const exception = loaded.exception as DefinitionException
  if (loaded.hasError) return new DefinitionResult(definition, exception) // first param will be undefined because of error

  // initialize data object
  const version: string = definition.openapi ?? definition.swagger
  const data = createComponentData('loading', RootComponent, definition, version as Version)
  data.root.loadCache = config.cache as Record<string, any>
  data.root.loadOptions = loadOptions
  data.context.exception = exception

  // run validation then reset some data properties
  if (options.validate === true) {
    RootComponent.validate(definition, version as Version, data)
    data.root.lastly.run(data) // we have to run lastly here because we passed the "data" into the validate function
  }
  data.root.map = new Map()
  data.root.lastly = new Lastly()

  // build the component if there are no errors
  if (exception.hasError) return new DefinitionResult(definition, exception) // first param will be undefined because of error
  // @ts-expect-error
  const component = new RootComponent(definition, version, data)
  data.root.lastly.run(data) // we have to run lastly here because we passed the "data" into the constructor function
  return new DefinitionResult(component, exception)
}

// return true if additional validation can occur, false if it should not
export function validate (data: Data): boolean {
  const { context } = data
  const { chain, exception, key } = context
  const { definition: componentDef, reference } = data.component
  const { map, version } = data.root
  const schema = context.schema as SchemaAny
  const parent = chain[0]
  let definition = context.definition

  // if this definition should be ignored
  if (typeof schema.ignored === 'string') {
    if (definition !== undefined && key !== '') {
      const propertyIgnored = E.propertyIgnored(key, schema.ignored, {
        definition,
        locations: [{ node: chain[0].context.definition, key: key }],
        reference
      })
      exception.message(propertyIgnored)
    }
    return false
  }

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
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }]
      })
      const { level } = exception.message(enumNotMet)
      if (level === 'error') return false
    }
  }

  // $ref property is only allowed for components, and only some of those. The exception is the Reference component that does allow it.
  const isRefComponent = data.component.constructor === Reference
  let hasAccountedForRefError = false
  if (typeof definition === 'object' && '$ref' in definition && schema.type !== 'any' && schema.type !== 'component' && !isRefComponent) {
    hasAccountedForRefError = true
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
  if (hasRef && !isRefComponent && !hasAccountedForRefError) {
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

      // validate the correct number of items
      const itemCount = definition.length
      if (s.minItems !== undefined && itemCount < s.minItems) {
        const exceedsArrayLengthBounds = E.exceedsArrayLengthBounds('minItems', s.minItems, itemCount, {
          definition,
          locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'both' }]
        })
        const { level } = exception.message(exceedsArrayLengthBounds)
        if (level === 'error') return false
      }
      if (s.maxItems !== undefined && itemCount > s.maxItems) {
        const exceedsArrayLengthBounds = E.exceedsArrayLengthBounds('maxItems', s.maxItems, itemCount, {
          definition,
          locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'both' }]
        })
        const { level } = exception.message(exceedsArrayLengthBounds)
        if (level === 'error') return false
      }

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
      // const componentData = createComponentData('validating', component, definition, version, data)
      // componentData.context.built = built
      // @ts-expect-error
      const exception = component.validate(definition, version, data)
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
      if (level === 'error') success = false
    }
    if (s.maximum !== undefined && definition > s.maximum) {
      const exceedsNumberBounds = E.exceedsNumberBounds('maximum', true, s.maximum, definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(exceedsNumberBounds)
      if (level === 'error') success = false
    }
    if (s.minimum !== undefined && definition < s.minimum) {
      const exceedsNumberBounds = E.exceedsNumberBounds('minimum', true, s.minimum, definition, {
        definition,
        locations: [{ node: parent?.context.definition, key: parent?.context.key, type: 'value' }],
        reference
      })
      const { level } = exception.message(exceedsNumberBounds)
      if (level === 'error') success = false
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
      const success = validateObjectProperties(built, data)
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

function validateObjectProperties (context: any, data: Data): boolean {
  const { definition, exception } = data.context
  const { reference } = data.component
  const schema = data.context.schema as SchemaObject
  const version = data.root.version

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
        if (childSuccess) context[name] = child.context.built
        success = success && childSuccess
      }
    } else if (prop.required === true && allowed) {
      missingRequiredProperties.push(name)
    } else if ('default' in prop.schema && allowed) {
      context[name] = child.context.built = prop.schema.default
    }
  })

  // validate other definition properties
  const additionalProperties = schema.additionalProperties !== undefined ? schema.additionalProperties : false
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
    } else {
      const child = createChildData(data, def, key, additionalProperties.schema)
      const childSuccess = validate(child)
      if (childSuccess) context[key] = child.context.built
      success = success && childSuccess
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
