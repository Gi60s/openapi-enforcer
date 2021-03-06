import {
  AnyComponent,
  ComponentOptionsFixed,
  ExtensionData,
  getComponentData,
  getComponentSchema,
  v2,
  v3
} from './components'
import * as Operation from './components/Operation'
import { IBuildMapper } from './BuildMapper'
import { Exception } from 'exception-tree'
import { booleanMapToStringArray, isObject, same, smart, stringArrayToBooleanMap } from './util'

const rxExtension = /^x-.+/

export interface Data<DefinitionType, BuiltType> {
  // unchanging values
  alert: {
    error (code: number, ...args: any[]): void
    ignore (code: number, ...args: any[]): void
    warn (code: number, ...args: any[]): void
  }
  components: v2 | v3
  map: IBuildMapper
  metadata: {
    [key: string]: any
    operationIdMap?: {
      [operationId: string]: Data<Operation.Definition, Operation.Object>
    }
  }
  options: ComponentOptionsFixed

  // changing values
  built: BuiltType
  chain: Array<Data<any, any>>
  definition: DefinitionType
  error: Exception
  key: string
  schema: Schema
  warning: Exception
}

interface NotAllowed {
  name: string
  reason?: string
}

export type Schema = SchemaAny | SchemaArray | SchemaBoolean | SchemaComponent<any, any> | SchemaNumber | SchemaString | SchemaObject

interface SchemaBase<Definition, Result> {
  // Run custom code after valid and built.
  after?: (data: Data<Definition, Result>) => void

  // Run custom code before validate. Returning false will stop follow up validations.
  before?: (data: Data<Definition, Result>) => boolean

  // Custom build step
  build?: (data: Data<Definition, Result>) => any

  // Set the default.
  default?: (data: Data<Definition, Result>) => Result

  // Get array of possible values.
  enum?: (data: Data<Definition, Result>) => Result[]

  // Determine if validation should be skipped.
  ignored?: (data: Data<Definition, Result>) => boolean

  // Determine if value can be null
  nullable?: (data: Data<Definition, Result>) => boolean
}

export interface SchemaAny extends SchemaBase<any, any> {
  type: 'any'
}

export interface SchemaArray<Definition=any[], Built=any[]> extends SchemaBase<Definition, Built> {
  type: 'array'
  items: Schema
}

export interface SchemaBoolean<Definition=boolean, Built=boolean> extends SchemaBase<Definition, Built> {
  type: 'boolean'
}

export interface SchemaComponent<Definition, Built> extends SchemaBase<Definition, Built> {
  type: 'component'
  allowsRef: boolean
  component: AnyComponent
}

export interface SchemaNumber<Definition=number, Built=number> extends SchemaBase<Definition, Built> {
  type: 'number'
  integer?: boolean
  maximum?: number
  minimum?: number
}

export interface SchemaString<Definition=string, Built=string> extends SchemaBase<Definition, Built> {
  type: 'string'
  maxLength?: number
  minLength?: number
}

export interface SchemaObject<Definition=object, Built=object> extends SchemaBase<Definition, Built> {
  type: 'object'
  allowsSchemaExtensions: boolean
  additionalProperties?: boolean | Schema
  required?: (data: Data<Definition, Built>) => string[]
  properties?: SchemaProperty[]
}

export interface SchemaProperty<SchemaType=Schema, Definition=any, Built=any> {
  name: string
  allowed?: (data: Data<Definition, Built>) => boolean | string // Whether property is even allowed. Omit `allowed` property to allow by default.
  schema: SchemaType
}

export type SchemaConstructor<Definition, Built> = (data: Data<Definition, Built>) => SchemaObject

// schema generator and definition to schema mapper
const componentMap: WeakMap<AnyComponent, { builder: SchemaConstructor<any, any>, schemas: WeakMap<any, Schema> }> = new WeakMap()
export const LookupMap = {
  get<Definition, Built> (component: AnyComponent, data: Data<Definition, Built>): Schema {
    const match = componentMap.get(component)
    if (match === undefined) throw Error('Invalid component context')
    let schema = match.schemas.get(data.definition)
    if (schema !== undefined) {
      schema = match.builder(data)
      match.schemas.set(data.definition, schema)
    }
    return schema
  },
  set<Definition, Built> (component: AnyComponent, builder: SchemaConstructor<Definition, Built>): undefined {
    componentMap.set(component, {
      builder,
      schemas: new WeakMap()
    })
    return undefined
  }
}

export function buildComponent<Definition, Built> (data: Data<Definition, Built>): undefined {
  const { built, definition } = data
  const schema = data.schema

  Object.keys(definition).forEach((key: string) => {
    if (key.startsWith('x-')) {
      // @ts-expect-error
      built[key] = definition[key]
    } else if ('properties' in schema) {
      // TODO: properties build
    } else if ('additionalProperties' in schema) {
      // TODO: additionalProperties build
    } else {
      // @ts-expect-error
      built[key] = definition[key]
    }
  })

  return undefined
}

// Returning true will allow the built value to be set, returning false will not set the built value
export function validateDefinition (data: Data<any, any>): boolean {
  const { definition, error, map, schema } = data

  // run base schema initialize validators
  const baseValidatorResult = runBaseValidators(data, schema)
  if (!baseValidatorResult.continue) return baseValidatorResult.set

  if (schema.type === 'any') {
    data.built = 'build' in schema ? schema.build(data) : definition
    return runCustomValidators(data)
  } else if (schema.type === 'array') {
    if (!Array.isArray(definition)) {
      error.message('Expected an array. Received: ' + smart(definition), 'DVTYPE')
      return false
    }

    let success = true
    if ('items' in schema) {
      data.built = []
      definition.forEach((def: any, i: number) => {
        const key = String(i)
        const child = buildChildData(data, def, key, schema.items)
        if (!validateChild(child, key)) success = false
      })
    }
    return success ? runCustomValidators(data) : false
  } else if (schema.type === 'boolean') {
    if (typeof definition !== 'boolean') {
      error.message('Expected a boolean. Received: ' + smart(definition), 'DVTYPE')
      return false
    }
    data.built = 'build' in schema ? schema.build(data) : definition
    return runCustomValidators(data)
  } else if (schema.type === 'number') {
    let success = true
    if (typeof definition !== 'number') {
      error.message('Expected a number. Received: ' + smart(definition), 'DVTYPE')
      return false
    }
    if (schema.integer === true && definition % 1 !== 0) {
      error.message('Value must be an integer. Received: ' + smart(definition), 'DVNINT')
      success = false
    }
    if ('maximum' in schema && definition > schema.maximum) {
      error.message('Value must be less than or equal to ' + schema.maximum + '. Received: ' + smart(definition), 'DVNMAX')
      success = false
    }
    if ('minimum' in schema && definition < schema.minimum) {
      error.message('Value must be greater than or equal to ' + schema.minimum + '. Received: ' + smart(definition), 'DVNMIN')
      success = false
    }
    if (!success) return false
    data.built = 'build' in schema ? schema.build(data) : definition
    return runCustomValidators(data)
  } else if (schema.type === 'object' || schema.type === 'component') {
    const oSchema = (schema.type === 'object' ? schema : getComponentSchema(schema.component, data))
    let success = true

    if (!isObject(definition)) {
      error.message('Expected a plain object. Received: ' + smart(definition), 'DVTYPE')
      return false
    }

    // if we have a "component" schema then run the base validators with the new schema
    if (schema !== oSchema) {
      const result = runBaseValidators(data, oSchema)
      if (!result.continue) return result.set
    }

    // catch infinite loop
    data.built = {}
    if (definition !== null && typeof definition === 'object') {
      const existing = map.getMappedBuild(definition, oSchema)
      if (existing !== undefined) {
        data.built = existing.built
        return existing.success
      }
      map.setMappedBuild(definition, oSchema, data.built)
    }

    // validate named properties and set defaults
    const schemaProperties = 'properties' in oSchema ? oSchema.properties : []
    const requiredProperties = 'required' in oSchema ? oSchema.required(data) : []
    const missingRequiredMap = stringArrayToBooleanMap(requiredProperties)
    const validatedPropertiesMap: { [key: string]: boolean } = {}
    const childrenData: { [key: string]: Data<any, any> } = {}
    const notAllowed: NotAllowed[] = []
    schemaProperties.forEach(prop => {
      const name = prop.name
      const allowed = prop.allowed
      const child = childrenData[name] = buildChildData(data, definition[name], name, prop.schema)
      if (name in definition) {
        missingRequiredMap[name] = false
        validatedPropertiesMap[name] = true
        const allow = allowed === undefined || allowed(child)
        if (allow === false || typeof allow === 'string') {
          notAllowed.push({
            name,
            reason: allow !== false ? allow : ''
          })
        } else if (!validateChild(child, name)) {
          success = false
        }
      } else if (prop.schema.default !== undefined) {
        if (validateChild(child, name)) {
          if (child.built !== undefined) data.built[name] = child.built
        } else {
          success = false
        }
      }
    })

    // validate other definition properties
    Object.keys(definition).forEach(key => {
      if (validatedPropertiesMap[key]) return

      missingRequiredMap[key] = false
      if (rxExtension.test(key)) return

      const def = definition[key]
      const additionalProperties = 'additionalProperties' in oSchema
        ? oSchema.additionalProperties
        : false
      if (additionalProperties === false) {
        notAllowed.push({
          name: key,
          reason: 'Additional property not allowed.'
        })
      } else if (additionalProperties !== true) {
        const child = buildChildData(data, def, key, additionalProperties)
        if (!validateChild(child, key)) success = false
      } else {
        data.built[key] = def
      }
    })

    // report any properties that are not allowed
    if (notAllowed.length > 0) {
      notAllowed.sort((a: NotAllowed, b: NotAllowed) => a.name < b.name ? -1 : 1)
      const reasons = notAllowed.filter(v => v.reason !== undefined && v.reason.length > 0)
      const message = 'One or more properties exist that are not allowed: ' + notAllowed.join(', ')
      if (reasons.length === 0) {
        error.message(message, 'DVPNAL')
      } else {
        const child = error.nest(message)
        reasons.forEach(reason => {
          child.message(reason.name + ': ' + reason.reason, 'DVPNAL')
        })
      }
      
      success = false
    }

    // report on missing required properties
    const missingRequired = booleanMapToStringArray(missingRequiredMap)
    if (missingRequired.length > 0) {
      error.message('Missing one or more required properties: ' + missingRequired.join(', '), 'DVPREQ')
      success = false
    }

    // run after and extension validators
    if (!runCustomValidators(data)) success = false

    map.setMappedBuild(definition, oSchema, data.built, success)
    return success
  } else if (schema.type === 'string') {
    let success = true
    if (typeof definition !== 'string') {
      error.message('Expected a string. Received: ' + smart(definition), 'DVTYPE')
      return false
    }
    if ('maxLength' in schema && definition.length > schema.maxLength) {
      error.message('Length must be less than or equal to ' + schema.maxLength + '. Received: ' + smart(definition), 'DVSNLN')
      success = false
    }
    if ('minLength' in schema && definition.length < schema.minLength) {
      error.message('Length must be greater than or equal to ' + schema.maxLength + '. Received: ' + smart(definition), 'DVSXLN')
      success = false
    }
    if (!success) return false
    data.built = 'build' in schema ? schema.build(data) : definition
    return runCustomValidators(data)
  } else {
    return false
  }
}

function buildChildData (data: Data<any, any>, definition: any, key: string, schema: Schema): Data<any, any> {
  const chain = data.chain.slice(0)
  chain.unshift(data)

  return {
    // unchanging values
    alert: data.alert,
    components: data.components,
    map: data.map,
    metadata: data.metadata,
    options: data.options,

    // changing values
    built: undefined,
    chain,
    definition,
    error: data.error.at(key),
    key,
    schema,
    warning: data.warning.at(key)
  }
}

function validateChild (child: Data<any, any>, key: string): boolean {
  const success = validateDefinition(child)
  if (success) child.chain[0].built[key] = child.built
  return success
}

function runBaseValidators (data: Data<any, any>, schema: Schema): { continue: boolean, set: boolean } {
  const { definition, error } = data

  // run before hook
  if (schema.before !== undefined) {
    // @ts-expect-error
    const okToContinue = schema.before(data)
    if (!okToContinue) {
      return { continue: false, set: !data.error.hasException }
    }
  }

  // if this definition should be ignored
  if (schema.ignored !== undefined) {
    // @ts-expect-error
    if (schema.ignored(data)) {
      return { continue: false, set: false }
    }
  }

  // if null then validate nullable
  if (definition === null) {
    // @ts-expect-error
    if (schema.nullable === undefined || !schema.nullable(data)) {
      error.message('Value must not be null', 'DVNNUL')
      return { continue: false, set: false }
    } else {
      data.built = null
      const success = runCustomValidators(data)
      return { continue: false, set: success }
    }
  }

  // if default is used then set it
  if (definition === undefined && schema.default !== undefined) {
    // @ts-expect-error
    const value = schema.default(data)
    if (value !== undefined) {
      data.built = value
      data.definition = value
    }
    const success = runCustomValidators(data)
    return { continue: false, set: success }
  }

  // if enum is invalid then exit
  if (schema.enum !== undefined) {
    // @ts-expect-error
    const matches = schema.enum(data)
    const found = matches.find((v: any) => same(v, definition))
    if (found === undefined) {
      const expected: string = matches.length > 1 ? 'one of: ' + matches.join(', ') : matches[0]
      error.message('Value must be ' + expected + '. Received: ' + smart(definition), 'DVENUM')
      return { continue: false, set: false }
    }
  }

  return { continue: true, set: true }
}

function runCustomValidators (data: Data<any, any>): boolean {
  let schema = data.schema
  const component = 'component' in schema ? schema.component : null
  if (schema.type === 'component') schema = getComponentSchema(schema.component, data)

  // run custom validation
  if (schema.after !== undefined) {
    // @ts-expect-error
    schema.after(data)
    if (data.error.hasException) return false
  }

  if (schema.type === 'object') {
    if (component !== null && component !== undefined) {
      const componentData = getComponentData(component)
      const extensions = componentData.definition.extensions

      // run component extension validations
      const length = extensions.length
      if (length > 0) {
        const extensionData: ExtensionData<any, any> = {
          built: data.built,
          components: componentData.components,
          definition: data.definition,
          error: data.error,
          key: data.key,
          warning: data.warning
        }

        for (let i = 0; i < length; i++) {
          extensions[i](extensionData)
        }

        if (data.error.hasException) return false
      }
    }
  }
  return true
}
