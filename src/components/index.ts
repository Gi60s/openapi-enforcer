import * as Config from '../config'
import { Exception } from '../Exception'
import * as E from '../Exception/methods'
import rx from '../rx'
import { no, yes, isObject, same, smart, adjustExceptionLevel, addExceptionLocation } from '../util'
import { lookup } from '../loader'

export const componentSchemasMap: WeakMap<ExtendedComponent, SchemaObject> = new WeakMap()

export {
  Exception
}

interface MapItem {
  definition: any
  instance: any
}

export interface Data {
  // unchanging values
  major: number
  map: Map<any, MapItem[]>
  metadata: {
    [key: string]: any
    operationIdMap?: {
      [operationId: string]: Data[]
    }
    securitySchemes?: {
      [name: string]: Data
    }
  }
  root: Data
  version: Version

  // changes per component
  component: Data
  reference: string
  finally: Array<(componentData: Data) => void>

  // always changing values
  built: any
  chain: Data[]
  definition: any
  exception: Exception
  key: string
  schema: Schema
}

interface NotAllowed {
  name: string
  reason?: string
}

export type Schema = SchemaAny | SchemaArray | SchemaBoolean | SchemaComponent | SchemaNumber | SchemaOneOf | SchemaString | SchemaObject

interface SchemaBase {
  // Run custom code after valid and built.
  after?: (data: Data, componentDefinition: any) => void

  // Run custom code before validate. Returning false will stop follow up validations.
  before?: (data: Data, componentDefinition: any) => boolean

  // Custom build step
  build?: (data: Data, componentDefinition: any) => any

  // Set the default.
  default?: (data: Data, componentDefinition: any) => any

  // Get array of possible values.
  enum?: (data: Data, componentDefinition: any) => any[]

  // Determine if validation should be skipped.
  ignored?: (data: Data, componentDefinition: any) => boolean

  // Determine if value can be null
  nullable?: (data: Data, componentDefinition: any) => boolean
}

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
  // component: new(...args: any[]) => OASComponent // inherits from typeof OASComponent
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
}

export interface SchemaString extends SchemaBase {
  type: 'string'
  maxLength?: number
  minLength?: number
}

export interface SchemaObject extends SchemaBase {
  type: 'object'
  allowsSchemaExtensions: (data: Data, componentDefinition: any) => boolean
  additionalProperties?: boolean | Schema
  properties?: SchemaProperty[]
}

export interface SchemaProperty<SchemaType=Schema> {
  name: string
  allowed?: (data: Data, componentDefinition: any) => true | string // Whether property is even allowed. Omit `allowed` property to allow by default.
  required?: (data: Data, componentDefinition: any) => boolean
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

export function clearCache (component: ExtendedComponent): void {
  componentSchemasMap.delete(component)
}

export interface ExtendedComponent<T extends OASComponent=any> {
  new (definition: any, version?: Version, ...args: any[]): T
  spec: SpecMap
  schemaGenerator: () => SchemaObject
  validate: (definition: any, version?: Version, ...args: any[]) => Exception
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class OASComponent {
  [key: string]: any

  protected constructor (data: Data) {
    const { definition, map } = data
    data.component = data
    data.reference = (this.constructor as OASComponent).spec[data.version]

    // register the use of this component with this definition
    if (!map.has(this.constructor)) map.set(this.constructor, [])
    map.get(this.constructor)?.push({ definition, instance: this })

    // get the schema for this component
    const Component = this.constructor as ExtendedComponent
    data.schema = componentSchemasMap.get(Component) ?? Component.schemaGenerator()

    // begin building properties
    buildObjectProperties(this, data)

    // trigger finally hooks
    data.finally.forEach(fn => fn(data))

    if (typeof data.schema.build === 'function') {
      throw Error('Schema of type SchemaObject does not support build function.')
    }
  }

  static extend (): void {

  }

  static get spec (): SpecMap {
    return {}
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: () => false
    }
  }

  static validate (definition: any, version?: Version, incomingData?: Data): Exception {
    const data: Data = initializeData('validating ' + this.name + ' object', definition, version, incomingData)
    data.component = data
    data.schema = componentSchemasMap.get(this as unknown as ExtendedComponent) ?? this.schemaGenerator()
    validate(data)

    return data.exception
  }
}

export interface ReferenceDefinition {
  $ref: string
}

export class Reference extends OASComponent {
  $ref!: string

  constructor (definition: ReferenceDefinition, version?: Version) {
    const data = initializeData('constructing Reference object', definition, version, arguments[2])
    super(data)
  }

  async load (validate?: boolean): Promise<OASComponent> {
    // TODO: implement this load function that will load the reference

    // identify current file location

    // load file and find relevant node

    // optionally validate the loaded node

    // replace reference with found node

    // @ts-expect-error
    return null
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#reference-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#reference-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#reference-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#reference-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#reference-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: no,
      properties: [
        {
          name: '$ref',
          required: yes,
          schema: {
            type: 'string'
          }
        }
      ]
    }
  }

  static validate (definition: ReferenceDefinition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}

export function initializeData<Definition> (exceptionMessage: string, definition: Definition, version?: Version, data?: Data): Data {
  if (data === undefined) {
    const v: string = version === undefined ? Config.get().version : version
    data = {
      // unchanging values
      major: parseInt(v.split('.')[0]),
      map: new Map(),
      metadata: {},
      // @ts-expect-error
      root: null,
      version: v as Version,

      // changes per component
      // @ts-expect-error
      component: null,
      finally: [],

      // always changing values
      built: undefined,
      chain: [],
      definition: definition,
      exception: new Exception('One or more [TYPE] found while ' + exceptionMessage + ':'),
      key: '',
      schema: { type: 'any' }
    }
    // @ts-expect-error
    data.root = data
  }
  return data as Data
}

export function build (data: Data): any {
  const { definition, map, schema } = data
  const componentDef = data.component.definition
  if (definition !== undefined) {
    if (schema.type === 'any') {
      data.built = definition
    } else if (schema.type === 'array') {
      if (!Array.isArray(definition)) throw Error('Invalid definition type. Expected an array. Received: ' + smart(definition))

      const store = map.get(schema)
      const found = store?.find(item => item.definition === definition)
      if (found !== undefined) {
        data.built = found.instance
        return data.built // already processed everything so we can return early
      } else {
        data.built = []
        if (!map.has(schema)) map.set(schema, [])
        map.get(schema)?.push({ definition, instance: data.built })

        definition.forEach((def: any, i: number) => {
          const key = String(i)
          const child = buildChildData(data, def, key, schema.items)
          data.built.push(build(child))
        })
      }
    } else if (schema.type === 'boolean') {
      if (typeof definition !== 'boolean') throw Error('Invalid definition type. Expected a boolean. Received: ' + smart(definition))
      data.built = definition
    } else if (schema.type === 'component') {
      if (!isObject(definition)) throw Error('Invalid definition type. Expected an object. Received: ' + smart(definition))
      const Component = schema.component

      // check if the definition has been used with this component previously, otherwise create the component
      const store = map.get(Component)
      const found = store?.find(item => item.definition === definition)
      if (found !== undefined) {
        data.built = found.instance
      } else {
        data.built = new Component(definition, data.version, data)
      }
    } else if (schema.type === 'number') {
      if (typeof definition !== 'number') throw Error('Invalid definition type. Expected a number. Received: ' + smart(definition))
      data.built = definition
    } else if (schema.type === 'oneOf') {
      const match = schema.oneOf.find(item => item.condition(data, data.component.definition))
      if (match === undefined) {
        throw Error('Definition does not meet any of the possible conditions. Received: ' + smart(definition))
      } else {
        const child = Object.assign({}, data, { schema: match.schema })
        const value: any = build(child)
        if (value !== undefined) data.built = value
      }
    } else if (schema.type === 'object') {
      if (!isObject(definition)) throw Error('Invalid definition type. Expected an object. Received: ' + smart(definition))

      const store = map.get(schema)
      const found = store?.find(item => item.definition === definition)
      if (found !== undefined) {
        data.built = found.instance
        return data.built // already processed defaults and build too so we can return early
      } else {
        data.built = {}
        if (!map.has(schema)) map.set(schema, [])
        map.get(schema)?.push({ definition, instance: data.built })
        buildObjectProperties(data.built, data)
      }
    } else if (schema.type === 'string') {
      if (typeof definition !== 'string') throw Error('Invalid definition type. Expected a string. Received: ' + smart(definition))
      data.built = definition
    }
  }

  if (data.built === undefined && typeof schema.default === 'function') {
    data.built = schema.default(data, componentDef)
  }

  if (typeof schema.build === 'function') {
    if (schema.type === 'array') {
      throw Error('Schema of type SchemaArray does not support build function.')
    } else if (schema.type === 'object') {
      throw Error('Schema of type SchemaObject does not support build function.')
    }
    data.built = schema.build(data, componentDef)
  }

  return data.built
}

export function buildChildData (data: Data, definition: any, key: string, schema: Schema): Data {
  const chain = data.chain.slice(0)
  chain.unshift(data)

  return {
    // unchanging values
    major: data.major,
    map: data.map,
    metadata: data.metadata,
    root: data.root,
    version: data.version,

    // changes per component
    component: data.component,
    reference: data.reference,
    finally: data.finally,

    // always changing values
    built: undefined,
    chain,
    definition,
    exception: data.exception.at(key),
    key,
    schema
  }
}

export function validate (data: Data): any { // return value is what to add to built
  const { exception, key, map } = data
  const componentDef = data.component.definition
  const definition = data.definition
  const schema = data.schema as SchemaAny
  const parent = data.chain[0]

  // run before hook
  if (schema.before !== undefined) {
    const okToContinue = schema.before(data, componentDef)
    if (!okToContinue) return data.built
  }

  // if this definition should be ignored
  if (schema.ignored !== undefined) {
    if (schema.ignored(data, componentDef)) return
  }

  // if null then validate nullable
  if (definition === null) {
    if (schema.nullable === undefined || !schema.nullable(data, componentDef)) {
      const mustNotBeNull = E.mustNotBeNull(data.reference)
      addExceptionLocation(mustNotBeNull, lookup(parent?.definition, key, 'value'))
      exception.message(mustNotBeNull)
      return
    } else {
      data.built = null
      return runAfterValidator(data)
    }
  }

  // if default is used then set it
  if (definition === undefined && schema.default !== undefined) {
    const value = schema.default(data, componentDef)
    if (value !== undefined) data.built = value
    return runAfterValidator(data)
  }

  // if enum is invalid then exit
  if (schema.enum !== undefined) {
    const matches = schema.enum(data, componentDef)
    const found = matches.find((v: any) => same(v, definition))
    if (found === undefined) {
      const enumNotMet = E.enumNotMet(data.reference, matches, definition)
      addExceptionLocation(enumNotMet, lookup(parent?.definition, key, 'value'))
      exception.message(enumNotMet)
      return
    }
  }

  // $ref property is only allowed for components, and only some of those
  if (typeof definition === 'object' && '$ref' in definition && schema.type !== 'any' && schema.type !== 'component') {
    const $refNotAllowed = E.$refNotAllowed(data.reference)
    adjustExceptionLevel(parent, $refNotAllowed)
    addExceptionLocation($refNotAllowed, lookup(parent?.definition, key, 'key'))
    exception.message($refNotAllowed)
  }

  if (schema.type === 'any') {
    data.built = definition
    if (typeof schema.build === 'function') data.built = schema.build(data, componentDef)
    return runAfterValidator(data)
  } else if (schema.type === 'array') {
    const s = schema as unknown as SchemaArray
    if (!Array.isArray(definition)) {
      const invalidType = E.invalidType(data.reference, 'an array', definition)
      addExceptionLocation(invalidType, lookup(parent?.definition, key, 'value'))
      exception.message(invalidType)
      return
    }

    // if instance already exists then return instance
    const store = map.get(schema)
    const found = store?.find(item => item.definition === definition)
    if (found !== undefined) {
      data.built = found.instance
      return data.built // already processed everything so we can return early
    } else {
      let success = true

      // create reference for instance being created
      const storeItem: { definition: any, instance: any } = { definition, instance: [] }
      data.built = storeItem.instance
      if (!map.has(schema)) map.set(schema, [])
      map.get(schema)?.push(storeItem)

      // process each item in the array
      definition.forEach((def: any, i: number) => {
        const key = String(i)
        const child = buildChildData(data, def, key, s.items)
        const value = validate(child)
        if (value === undefined) {
          success = false
        } else {
          data.built[i] = value
        }
      })
      if (typeof schema.build === 'function') throw Error('Schema of type SchemaArray does not support build function.')
      if (success) {
        storeItem.instance = runAfterValidator(data)
        return storeItem.instance // storeItem.instance === data.built
      } else {
        return undefined
      }
    }
  } else if (schema.type === 'boolean') {
    if (typeof definition !== 'boolean') {
      const invalidType = E.invalidType(data.reference, 'a boolean', definition)
      addExceptionLocation(invalidType, lookup(parent?.definition, key, 'value'))
      exception.message(invalidType)
      return undefined
    }
    data.built = definition
    if (typeof schema.build === 'function') data.built = schema.build(data, componentDef)
    return runAfterValidator(data)
  } else if (schema.type === 'component') {
    if (!isObject(definition)) {
      const invalidType = E.invalidType(data.reference, 'a non-null object', definition)
      addExceptionLocation(invalidType, lookup(parent?.definition, key, 'value'))
      exception.message(invalidType)
      return undefined
    }

    const s = schema as unknown as SchemaComponent
    let component = s.component

    // check if refs allowed and ref is set
    const hasRef = '$ref' in definition
    if (hasRef) {
      if (!s.allowsRef) {
        const $refNotAllowed = E.$refNotAllowed(data.reference)
        adjustExceptionLevel(parent, $refNotAllowed)
        addExceptionLocation($refNotAllowed, lookup(parent?.definition, key, 'value'))
        exception.message($refNotAllowed)
        return
      } else {
        component = Reference
      }
    }

    // check that this component is allowed for the active version
    if (component.spec[data.version] === undefined) {
      const invalidVersionForComponent = E.invalidVersionForComponent(data.reference, component.name, data.version)
      addExceptionLocation(invalidVersionForComponent, lookup(parent?.definition, key))
      data.exception.message(invalidVersionForComponent)
      return undefined
    }

    return mappable(component, data, {}, (built) => {
      // build the child data object
      const child: Data = {
        // unchanging values
        major: data.major,
        map: data.map,
        metadata: data.metadata,
        root: data.root,
        version: data.version,

        // changes per component
        component: data,
        reference: component.spec[data.version] as string,
        finally: [],

        // always changing values
        built,
        chain: [data].concat(data.chain),
        definition: data.definition,
        exception: data.exception,
        key: data.key,
        schema: componentSchemasMap.get(component) ?? component.schemaGenerator()
      }
      validateObject(child)
      data.finally.forEach(fn => fn(child))
      return data.built
    })
  } else if (schema.type === 'number') {
    const s = schema as unknown as SchemaNumber
    let success = true
    if (typeof definition !== 'number') {
      const invalidType = E.invalidType(data.reference, 'a number', definition)
      addExceptionLocation(invalidType, lookup(parent?.definition, key, 'value'))
      exception.message(invalidType)
      return false
    }
    if (s.integer === true && definition % 1 !== 0) {
      const invalidType = E.invalidType(data.reference, 'an integer', definition)
      addExceptionLocation(invalidType, lookup(parent?.definition, key, 'value'))
      exception.message(invalidType)
      success = false
    }
    if (s.maximum !== undefined && definition > s.maximum) {
      const exceedsNumberBounds = E.exceedsNumberBounds(data.reference, 'maximum', true, s.maximum, definition)
      addExceptionLocation(exceedsNumberBounds, lookup(parent?.definition, key, 'value'))
      exception.message(exceedsNumberBounds)
      success = false
    }
    if (s.minimum !== undefined && definition < s.minimum) {
      const exceedsNumberBounds = E.exceedsNumberBounds(data.reference, 'minimum', true, s.minimum, definition)
      addExceptionLocation(exceedsNumberBounds, lookup(parent?.definition, key, 'value'))
      exception.message(exceedsNumberBounds)
      success = false
    }
    if (!success) return false

    data.built = definition
    if (typeof schema.build === 'function') data.built = schema.build(data, componentDef)
    return runAfterValidator(data)
  } else if (schema.type === 'object') {
    // validate definition type
    if (!isObject(definition)) {
      const invalidType = E.invalidType(data.reference, 'a non-null object', definition)
      addExceptionLocation(invalidType, lookup(parent?.definition, key, 'value'))
      exception.message(invalidType)
      return undefined
    }

    return mappable(schema, data, {}, () => {
      validateObject(data)
    })
  } else if (schema.type === 'string') {
    const s = schema as unknown as SchemaString
    let success = true
    if (typeof definition !== 'string') {
      const invalidType = E.invalidType(data.reference, 'a string', definition)
      addExceptionLocation(invalidType, lookup(parent?.definition, key, 'value'))
      exception.message(invalidType)
      return false
    }
    if (s.maxLength !== undefined && definition.length > s.maxLength) {
      const exceedsStringLengthBounds = E.exceedsStringLengthBounds(data.reference, 'maxLength', s.maxLength, definition)
      addExceptionLocation(exceedsStringLengthBounds, lookup(parent?.definition, key, 'value'))
      exception.message(exceedsStringLengthBounds)
      success = false
    }
    if (s.minLength !== undefined && definition.length < s.minLength) {
      const exceedsStringLengthBounds = E.exceedsStringLengthBounds(data.reference, 'minLength', s.minLength, definition)
      addExceptionLocation(exceedsStringLengthBounds, lookup(parent?.definition, key, 'value'))
      exception.message(exceedsStringLengthBounds)
      success = false
    }

    if (success) {
      data.built = definition
      if (schema.build !== undefined) data.built = schema.build(data, componentDef)
      return runAfterValidator(data)
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}

function buildObjectProperties (context: any, data: Data): void {
  const { definition, component } = data
  const componentDef = component.definition
  const schema = data.schema as SchemaObject
  const properties = schema.properties !== undefined ? schema.properties : []
  const remainingProperties: string[] = Object.keys(definition)
  properties.forEach((property: SchemaProperty) => {
    const key: string = property.name
    const subSchema = property.schema
    if (key in definition || subSchema.default !== undefined) {
      const child = buildChildData(data, definition[key], key, subSchema)
      const value: any = build(child)
      if (value !== undefined) context[key] = value

      const index = remainingProperties.indexOf(key)
      if (index !== -1) remainingProperties.splice(index, 1)
    }
  })

  // default to excluding additional properties from build
  const additionalProperties: boolean | Schema = schema.additionalProperties !== undefined ? schema.additionalProperties : false
  const allowsSchemaExtensions = schema.allowsSchemaExtensions(data, componentDef)
  remainingProperties.forEach((key: string) => {
    const def = definition[key]
    if ((allowsSchemaExtensions && rx.extension.test(key)) || additionalProperties === true) {
      context[key] = def
    } else if (additionalProperties !== false) {
      const child = buildChildData(data, definition[key], key, additionalProperties)
      const value: any = build(child)
      if (value !== undefined) context[key] = value
    }
  })
}

function mappable (key: any, data: Data, value: any, handler: (value: any) => any): any {
  const { map, definition } = data

  // if instance already exists then return instance
  const store = map.get(key)
  const found = store?.find(item => item.definition === definition)
  if (found !== undefined) {
    data.built = found.instance
    return data.built
  } else {
    if (!map.has(key)) map.set(key, [])
    map.get(key)?.push({
      definition,
      instance: value
    })
    data.built = value

    return handler(value)
  }
}

function runAfterValidator (data: Data): any {
  const schema = data.schema as SchemaAny
  if (schema.after !== undefined) schema.after(data, data.component.definition)
  return data.built
}

function validateObject (data: Data): any {
  const { definition, exception } = data
  const componentDef = data.component.definition
  const schema = data.schema as SchemaObject

  const schemaProperties = schema.properties !== undefined ? schema.properties : []
  const missingRequiredProperties: string[] = []
  const validatedProperties: string[] = []
  const childrenData: { [key: string]: Data } = {}
  const notAllowed: NotAllowed[] = []

  // identify which properties are compatible with this version
  const versionProperties = schemaProperties
    .filter(prop => {
      const versionMismatch = prop.versions !== undefined ? !versionMatch(data.version, prop.versions) : false
      return !versionMismatch
    })
    .map(prop => prop.name)

  // validate named properties and set defaults
  let success = true
  schemaProperties.forEach(prop => {
    const name = prop.name
    const child = childrenData[name] = buildChildData(data, definition[name], name, prop.schema)
    const allowed = prop.allowed === undefined ? true : prop.allowed(child, componentDef)
    const versionMismatch = prop.versions !== undefined ? !versionMatch(data.version, prop.versions) : false
    if (name in definition) {
      validatedProperties.push(name)
      if (versionMismatch) {
        if (!versionProperties.includes(name)) {
          notAllowed.push({
            name,
            reason: 'Not part of OpenAPI specification version ' + data.version
          })
        }
      } else if (allowed !== true) {
        notAllowed.push({
          name,
          reason: allowed
        })
      } else {
        const value = validate(child)
        if (value === undefined) {
          success = false
        } else {
          data.built[name] = value
        }
      }
    } else if (prop.required?.(child, componentDef) === true) {
      missingRequiredProperties.push(name)
    } else if (prop.schema.default !== undefined) {
      child.built = prop.schema.default(child as any, componentDef)
    }
  })

  // validate other definition properties
  const additionalProperties: Schema | boolean = (() => {
    if (schema.additionalProperties === undefined) return false
    if (typeof schema.additionalProperties === 'boolean') return schema.additionalProperties
    return schema.additionalProperties
  })()
  const allowsSchemaExtensions = schema.allowsSchemaExtensions(data, componentDef)
  Object.keys(definition).forEach(key => {
    // if property already validated then don't validate against additionalProperties
    if (validatedProperties.includes(key)) return

    // if a schema extension
    if (rx.extension.test(key)) {
      if (!allowsSchemaExtensions && key !== 'x-enforcer') {
        const extensionNotAllowed = E.extensionNotAllowed(data.reference)
        addExceptionLocation(extensionNotAllowed, lookup(definition, key))
        exception.message(extensionNotAllowed)
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
      const child = buildChildData(data, def, key, additionalProperties)
      const value = validate(child)
      if (value === undefined) {
        success = false
      } else {
        data.built[key] = value
      }
    } else {
      data.built[key] = def
    }
  })

  // report any properties that are not allowed
  if (notAllowed.length > 0) {
    notAllowed.sort((a: NotAllowed, b: NotAllowed) => a.name < b.name ? -1 : 1)
    notAllowed.forEach(reason => {
      const propertyNotAllowed = E.propertyNotAllowed(data.reference, reason.name, reason.reason ?? '')
      addExceptionLocation(propertyNotAllowed, lookup(definition, reason.name))
      exception.message(propertyNotAllowed)
    })
    success = false
  }

  // report on missing required properties
  if (missingRequiredProperties.length > 0) {
    const eMissingRequiredProperties = E.missingRequiredProperties(data.reference, missingRequiredProperties)
    addExceptionLocation(eMissingRequiredProperties, lookup(definition))
    exception.message(eMissingRequiredProperties)
    success = false
  }

  if (typeof schema.build === 'function') throw Error('Schema of type SchemaObject does not support build function.')
  return success ? runAfterValidator(data) : undefined
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
