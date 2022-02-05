import { Exception } from '../../utils/Exception'
import { Schema2 as Definition2, Schema3 as Definition3 } from './definition-types'
import { Schema as Schema2 } from '../v2/Schema'
import { Schema as Schema3 } from '../v3/Schema'
import { copy, isObject, same } from '../../utils/util'
import { getDataTypeDefinition } from './schema-data-types'
import { Result } from '../../utils/Result'
import { OASComponent } from '../index'
import * as Randomizer from './randomizer'
import * as EC from '../../utils/error-codes'

type Definition = Definition2 | Definition3
export type Schema = Schema2 | Schema3

export interface TypeFormat {
  type: Type | ''
  format: string
}

interface DeterminedTypes {
  known: DeterminedTypesItems
  possible: DeterminedTypesItems
  get: (includePossible: boolean) => TypeFormat
}

type DeterminedTypesItems = Array<{ type: Type, formats: string[] }>

export interface DiscriminateResult<T> {
  key: string
  name: string
  schema: T | null
}

type Injector = (value: string, data: Record<string, string>) => string

export interface PopulateOptions {
  copy?: boolean
  depth?: number
  replacement?: 'colon' | 'doubleHandlebar' | 'handlebar' | 'none'
  useDefaults?: boolean
}

export interface RandomOptions {
  additionalPropertiesPossibility?: number
  arrayVariation?: number
  copy?: boolean
  decimalPlaces?: number
  defaultPossibility?: number
  definedPropertyPossibility?: number
  maxDepth?: number
  numberVariation?: number
  uniqueItemRetry?: number
}

type Type = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'integer'

export interface ValidateOptions {
  readWriteMode?: 'read' | 'write'
}

export const populateInjectors = {
  colon: buildInjector(() => /:([_$a-z][_$a-z0-9]*)/ig),
  doubleHandlebar: buildInjector(() => /{{([_$a-z][_$a-z0-9]*)}}/ig),
  handlebar: buildInjector(() => /{([_$a-z][_$a-z0-9]*)}/ig)
}

// a map for determining type based on property and properties based on type
const schemaPropertyMap = {
  types: {
    array: ['items', 'maxItems', 'minItems', 'uniqueItems'],
    boolean: [],
    integer: ['maximum', 'minimum', 'exclusiveMaximum', 'exclusiveMinimum', 'multipleOf'],
    number: ['maximum', 'minimum', 'exclusiveMaximum', 'exclusiveMinimum', 'multipleOf'],
    object: ['additionalProperties', 'discriminator', 'maxProperties', 'minProperties', 'properties'],
    string: ['maxLength', 'minLength', 'pattern']
  },
  properties: {
    additionalProperties: 'object',
    discriminator: 'object',
    exclusiveMaximum: 'number',
    exclusiveMinimum: 'number',
    items: 'array',
    maximum: 'number',
    maxItems: 'array',
    maxLength: 'string',
    maxProperties: 'object',
    minimum: 'number',
    minItems: 'array',
    minLength: 'string',
    minProperties: 'object',
    multipleOf: 'number',
    pattern: 'string',
    properties: 'object',
    uniqueItems: 'array'
  },
  keys: ['additionalProperties', 'discriminator', 'exclusiveMaximum', 'exclusiveMinimum', 'items',
    'maximum', 'maxItems', 'maxLength', 'maxProperties',
    'minimum', 'minItems', 'minLength', 'minProperties', 'multipleOf',
    'pattern', 'properties', 'uniqueItems'
  ]
}

class MapItem<R> {
  private readonly data: { key: any, result?: R }

  constructor (key: any) {
    this.data = { key }
  }

  setResult (result: R): MapItem<R> {
    this.data.result = result
    return this
  }

  get key (): any {
    return this.data.key
  }

  get result (): R | undefined {
    return this.data.result
  }
}

export class MapStore<R> {
  private readonly map: Map<Schema, Array<MapItem<R>>>

  constructor () {
    this.map = new Map()
  }

  get (schema: Schema, key: any): MapItem<R> {
    let items = this.map.get(schema)
    if (items === undefined) {
      items = []
      this.map.set(schema, items)
    }

    const index = items.findIndex(item => item.key === key)
    if (index === -1) {
      const item = new MapItem<R>(key)
      items.push(item)
      return item
    } else {
      return items[index]
    }
  }
}

export function analyze (schema: Schema, value: any, map: MapStore<boolean>): MapItem<boolean> {
  // watch for values that have already been validated against this value
  const mapped = map.get(schema, value)
  if (mapped.result !== undefined) return mapped

  // check for nullable
  if (value === null && (schema.enforcer.nullable === true || ('nullable' in schema && schema.nullable === true))) {
    return mapped.setResult(true)
  }

  if (schema.type === 'object') {

  }
}

export function deserialize<T = any> (schema: OASComponent, value: any): Result<T> {
  const exception = new Exception('Unable to deserialize')
  const { result } = serializer('deserialize', schema as unknown as Schema, value, new MapStore<any>(), exception)
  return new Result<T>(result, exception)
}

export function determineTypes (def: Definition | Schema, map: Map<Definition | Schema, DeterminedTypes>): DeterminedTypes {
  const existing = map.get(def)
  if (existing !== undefined) return existing

  const result: DeterminedTypes = {
    known: [],
    possible: [],
    get (includePossible): TypeFormat {
      if (this.known.length > 0) {
        const { type, formats } = this.known[0]
        const format = formats.filter(f => f.length > 0)[0] ?? ''
        return { type, format: format }
      } else if (includePossible && this.possible.length > 0) {
        const { type, formats } = this.possible[0]
        const format = formats.filter(f => f.length > 0)[0] ?? ''
        return { type, format: format }
      } else {
        return { type: '', format: '' }
      }
    }
  }
  map.set(def, result)

  if ('$ref' in def) return result

  if ('type' in def && def.type !== undefined) {
    addUniqueDeterminedType(result.known, def.type, def.format)
    return result
  }

  const keys = schemaPropertyMap.keys
  const length = keys.length
  for (let i = 0; i < length; i++) {
    const key = keys[i]
    if (key in def) {
      // @ts-expect-error
      const type = schemaPropertyMap.properties[keys[i]]
      if (type !== undefined) {
        addUniqueDeterminedType(result.known, type, def.format)
        break
      }
    }
  }
  if (result.known.length > 0) return result

  if ('allOf' in def && def.allOf !== undefined) {
    const length = def.allOf.length
    for (let i = 0; i < length; i++) {
      const types = determineTypes(def.allOf[i] as Schema, map)
      mergeUniqueDeterminedType(types.known, result.known)
      mergeUniqueDeterminedType(types.possible, result.possible)
    }
  } else if ('anyOf' in def && def.anyOf !== undefined) {
    const length = def.anyOf.length
    for (let i = 0; i < length; i++) {
      const types = determineTypes(def.anyOf[i] as Schema, map)
      mergeUniqueDeterminedType(types.known, result.possible)
      mergeUniqueDeterminedType(types.possible, result.possible)
    }
  } else if ('oneOf' in def && def.oneOf !== undefined) {
    const length = def.oneOf.length
    for (let i = 0; i < length; i++) {
      const types = determineTypes(def.oneOf[i] as Schema, map)
      mergeUniqueDeterminedType(types.known, result.possible)
      mergeUniqueDeterminedType(types.possible, result.possible)
    }
  }

  return result
}

// this is a best attempt merge function so no exceptions will be generated
export function merge (schema: Schema, target: Definition, map: Map<Schema, Definition>): Definition {
  const existing = map.get(schema)
  if (existing !== undefined) return existing

  const result: Definition = {}
  if (target.type !== undefined) result.type = target.type
  if (target.format !== undefined) result.format = target.format
  map.set(schema, result)

  if (schema.allOf !== undefined) {
    schema.allOf.forEach(s => {
      Object.assign(result, merge(s, target, map))
    })
  } else if ('anyOf' in schema && schema.anyOf !== undefined) {
    schema.anyOf.forEach(s => {
      const d = merge(s, {}, map)
      if (result.type === undefined || result.type === d.type) Object.assign(result, d)
    })
  } else if ('oneOf' in schema && schema.oneOf !== undefined) {
    const length = schema.oneOf.length
    for (let i = 0; i < length; i++) {
      const d = merge(schema.oneOf[i], {}, map)
      if (result.type === undefined || result.type === d.type) {
        Object.assign(result, d)
        break
      }
    }
  } else if (schema.type === undefined || result.type === undefined || schema.type === result.type) {
    Object.assign(result, schema)
  }

  return result
}

export function populate (schema: Schema, parameters: Record<string, any>, target: Record<string, any>, key: string, injector: Injector, exception: Exception, depth: number, options: Required<PopulateOptions>): void {
  if (depth === 0) return

  const value: any = target[key]

  if (schema.allOf !== undefined) {
    schema.allOf.forEach(schema => {
      populate(schema, parameters, target, key, injector, exception.at('allOf'), depth, options)
    })
  } else if ('anyOf' in schema || 'oneOf' in schema) {
    const mode = 'anyOf' in schema ? 'anyOf' : 'oneOf'
    if (schema.discriminator === undefined) {
      exception.message(...EC.schemaPopulateNoDiscriminator(mode))
    } else {
      const { name, key: discriminatorKey, schema: subSchema } = schema.discriminate(value)
      if (subSchema !== null) {
        populate(subSchema as Schema, parameters, target, key, injector, exception.at(mode), depth, options)
      } else {
        exception.message(...EC.schemaDiscriminatorUnmapped(discriminatorKey, name))
      }
    }
  } else if ('not' in schema) {
    exception.message(...EC.schemaPopulateNotSchema())
  } else {
    const { type } = determineTypes(schema, new Map()).get(true)
    if (type === 'array') {
      if (value !== undefined && !Array.isArray(value)) {
        exception.message(...EC.dataTypeInvalid('an array', value))
      } else {
        const applied = populateApply(schema, type, parameters, target, key, injector, options)
        if (schema.items !== undefined && Array.isArray(applied)) {
          const length = applied.length
          for (let i = 0; i < length; i++) {
            populate(schema.items as Schema, parameters, applied, String(i), injector, exception, depth - 1, options)
          }
        }
      }
    } else if (type === 'object') {
      if (value !== undefined && !isObject(value)) {
        exception.message(...EC.dataTypeInvalid('an object', value))
      } else {
        const appliedValue = populateApply(schema, type, parameters, target, key, injector, options)
        const applied = appliedValue ?? {}

        if (typeof schema.additionalProperties === 'object') {
          const properties = schema.properties ?? {}
          Object.keys(applied).forEach(key => {
            if (!(key in properties)) {
              populate(schema.additionalProperties as Schema, parameters, applied, key, injector, exception.at(key), depth - 1, options)
            }
          })
        }

        if (schema.properties !== undefined) {
          const properties = schema.properties
          Object.keys(properties).forEach(key => {
            populate(properties[key] as Schema, parameters, applied, key, injector, exception.at(key), depth - 1, options)
          })
        }

        if (Object.keys(applied).length > 0) {
          target[key] = applied
        }
      }
    } else {
      populateApply(schema, type, parameters, target, key, injector, options)
    }
  }
}

export function random (schema: Schema, target: Record<string, any>, key: string, exception: Exception, map: Map<object, boolean>, options: Required<RandomOptions>, depth: number): void {
  const value = target[key]

  if (typeof value === 'object' && value !== null) {
    const existing = map.get(value)
    if (existing === true) return
    map.set(value, true)
  }

  if (depth > options.maxDepth) return

  if (schema.enforcer.schema !== undefined && schema.enforcer.schema !== null) {
    schema = schema.enforcer.schema
  }

  if (schema.default !== undefined && Math.random() < options.defaultPossibility) {
    target[key] = copy(schema.default)
  } else if (schema.enum !== undefined && schema.enum.length > 0) {
    target[key] = copy(Randomizer.oneOf(schema.enum))
  } else if (schema.type === 'array') {
    if (value !== undefined && !Array.isArray(value)) {
      exception.message(...EC.dataTypeInvalid('an array', value))
    } else if (schema.items !== undefined) {
      const result = value ?? []
      const min: number = schema.minItems ?? result.length
      let max: number = schema.maxItems ?? min + options.arrayVariation - Math.round(0.5 * depth)
      if (max < min) max = min

      const length = Randomizer.number({ min, max })
      for (let i = 0; i < length; i++) {
        let retry = true
        let retriesRemaining = options.uniqueItemRetry
        while (retry && retriesRemaining > 0) {
          const o: { value?: any } = {}
          random(schema.items, o, 'value', exception.at(i), map, options, depth + 1)
          const value = o.value
          retry = schema.uniqueItems === true && value.findIndex((v: any) => same(v, value)) === -1
          if (!retry) {
            result[i] = value
          } else if (retry) {
            retriesRemaining--
          }
        }
      }
      target[key] = result
    }
  } else if (schema.type === 'boolean' && value === undefined) {
    const dataType = getDataTypeDefinition('boolean', schema.format)
    if (dataType !== undefined) {
      target[key] = dataType.random(schema)
    } else {
      target[key] = Randomizer.oneOf([true, false])
    }
  } else if (schema.type === 'integer' && value === undefined) {
    const dataType = getDataTypeDefinition('integer', schema.format)
    if (dataType !== undefined) {
      target[key] = dataType.random(schema)
    } else {
      target[key] = Math.round(Math.random() * 100)
    }
  } else if (schema.type === 'number' && value === undefined) {
    const dataType = getDataTypeDefinition('number', schema.format)
    if (dataType !== undefined) {
      target[key] = dataType.random(schema)
    } else {
      target[key] = Math.round(Math.random() * 10000) / 100
    }
  } else if (schema.type === 'object') {
    if (value === null) {
      target[key] = null
    } else if (value !== undefined && typeof value !== 'object') {
      exception.message(...EC.dataTypeInvalid('an object', value))
    } else {
      const result = value ?? {}
      const definedProperties = schema.properties !== undefined ? Object.keys(schema.properties) : []
      let count = 0

      // add required properties first
      if (schema.required !== undefined) {
        schema.required.forEach(key => {
          const index = definedProperties.indexOf(key)
          if (index !== -1) definedProperties.splice(index, 1)

          let subSchema: Schema | boolean = schema.properties?.[key] ?? schema.additionalProperties ?? true
          if (subSchema === true) subSchema = randomSchema(schema.constructor)
          if (subSchema !== false) random(subSchema, result, key, exception.at(key), map, options, depth + 1)
          count++
        })
      }

      // add defined properties (in random order)
      let definedPropertiesLength = definedProperties.length
      const maxProperties = schema.maxProperties ?? Number.MAX_SAFE_INTEGER
      while (definedPropertiesLength > 0 && count < maxProperties) {
        if (Math.random() < options.definedPropertyPossibility) {
          const index = Math.floor(Math.random() * definedPropertiesLength)
          const key = definedProperties[index]
          random(schema.properties?.[key] as Schema, result, key, exception.at(key), map, options, depth + 1)
          count++
        }
        definedPropertiesLength--
      }

      // add additional properties
      if (schema.additionalProperties !== false) {
        const minProperties = schema.minProperties ?? 0
        let addMoreProperties = count < minProperties || Math.random() < options.additionalPropertiesPossibility
        let additionalPropertiesIndex = 1
        while (addMoreProperties && count < maxProperties) {
          const key = 'additionalProperty' + String(additionalPropertiesIndex++)
          if (!(key in result)) {
            const subSchema = schema.additionalProperties === true || schema.additionalProperties === undefined ? randomSchema(schema.constructor) : schema.additionalProperties
            random(subSchema, result, key, exception.at(key), map, options, depth + 1)
            count++
            addMoreProperties = count < minProperties || Math.random() < options.additionalPropertiesPossibility
          }
        }
      }

      target[key] = result
    }
  } else if (schema.type === 'string' && value === undefined) {
    const dataType = getDataTypeDefinition('string', schema.format)
    if (dataType !== undefined) {
      target[key] = dataType.random(schema)
    } else {
      target[key] = ''
    }
  }
}

export function serialize<T> (schema: OASComponent, value: any): Result<T> {
  const exception = new Exception('Unable to serialize')
  const { result } = serializer('serialize', schema as unknown as Schema, value, new MapStore<any>(), exception)
  return new Result<T>(result, exception)
}

// validate a deserialized value
// TODO: how to handle validation if the schema is not a dereferenced object?
export function validate (schema: Schema, value: any, map: MapStore<boolean>, exception: Exception, options: ValidateOptions): MapItem<boolean> {
  // watch for values that have already been validated against this value
  const mapped = map.get(schema, value)
  if (mapped.result !== undefined) return mapped

  // check for nullable
  if (value === null && (schema.enforcer.nullable === true || ('nullable' in schema && schema.nullable === true))) {
    return mapped.setResult(true)
  }

  let valid: boolean = true
  if ('allOf' in schema) {
    const child = exception.nest('Did not validate against all schemas')
    schema.allOf?.forEach((schema, index) => {
      const { result } = validate(schema, value, map, child.at(index), options)
      if (result === false) valid = false
    })
  } else if ('anyOf' in schema && schema.anyOf !== undefined) {
    if ('discriminator' in schema) {
      const { key, schema: childSchema } = schema.discriminate(value)
      if (childSchema === null) {
        exception.message(...EC.schemaDiscriminatorUnmapped(key, value[key]))
        valid = false
      } else {
        const { result } = validate(childSchema as Schema, value, map, exception.at(value[key]), options)
        if (result === false) valid = false
      }
    } else {
      const anyOfException = new Exception('Did not validate against at least one schema')
      const length = schema.anyOf.length
      let foundValidAnyOf = false
      for (let i = 0; i < length; i++) {
        const child = anyOfException.at(i)
        const { result } = validate(schema.anyOf[i], value, map, child, options)
        if (result === true) {
          foundValidAnyOf = true
          break
        }
      }
      if (!foundValidAnyOf) {
        exception.push(anyOfException)
        valid = false
      }
    }
  } else if ('not' in schema) {
    const { result } = validate(schema, value, map, new Exception(), options)
    if (result === true) {
      exception.message(...EC.schemaShouldNotValidate())
      valid = false
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      exception.message(...EC.dataTypeInvalid('an array', value))
      valid = false
    } else {
      const length = value.length
      if (schema.maxItems !== undefined && schema.maxItems < length) {
        exception.message(...EC.dataTypeMaxItems(schema.maxItems, length))
        valid = false
      }
      if (schema.minItems !== undefined && schema.minItems > length) {
        exception.message(...EC.dataTypeMinItems(schema.minItems, length))
        valid = false
      }
      if (schema.uniqueItems === true) {
        const singles: any[] = []
        value.forEach((item, index) => {
          const length = singles.length
          let found = false
          for (let i = 0; i < length; i++) {
            if (same(item, singles[i])) {
              exception.message(...EC.dataTypeUnique(index))
              found = true
              valid = false
              break
            }
          }
          if (!found) singles.push(item)
        })
      }
      if (schema.items !== undefined) {
        value.forEach((val, index) => {
          const { result } = validate(schema.items as Schema, val, map, exception.at(index), options)
          if (result === false) valid = false
        })
      }
    }
  } else if (schema.type === 'object') {
    if (!isObject(value)) {
      exception.message(...EC.dataTypeInvalid('a non-null object', value))
      valid = false
    } else {
      const properties = schema.properties ?? {}
      const keys = Object.keys(value)

      // determine which properties are required when considering readOnly or writeOnly status
      const readWriteMode = options.readWriteMode
      const readWriteOnly: string[] = []
      const required = schema.required !== undefined
        ? schema.required.filter(name => {
          const prop: Schema | undefined = properties[name]
          if (options.readWriteMode === undefined || prop === undefined) return true
          if (options.readWriteMode === 'write' && prop.readOnly === false) return true
          if (options.readWriteMode === 'read' && (prop as Schema3).writeOnly === false) return true
          return false
        })
        : []

      // validate each property in the value
      keys.forEach(key => {
        // remove item for required remaining array
        const index = required.indexOf(key)
        if (index !== -1) required.splice(index, 1)

        if (key in properties) {
          const prop = properties[key]
          if ((readWriteMode === 'write' && prop.readOnly === true) || (readWriteMode === 'read' && (prop as Schema3).writeOnly === true)) readWriteOnly.push(key)
          const { result } = validate(prop, value[key], map, exception.at(key), options)
          if (result === false) valid = false
        } else {
          if (schema.additionalProperties === false) {
            exception.at(key).message(...EC.dataTypePropertyNotAllowed())
            valid = false
          } else if (typeof schema.additionalProperties === 'object') {
            const prop = schema.additionalProperties
            if ((readWriteMode === 'write' && prop.readOnly === true) || (readWriteMode === 'read' && (prop as Schema3).writeOnly === true)) readWriteOnly.push(key)
            const { result } = validate(prop, value[key], map, exception.at(key), options)
            if (result === false) valid = false
          }
        }
      })

      // validate that all required are present
      if (required.length > 0) {
        exception.message(...EC.dataTypePropertyMissing(required))
        valid = false
      }

      // validate that we only have readable or writable properties
      if (readWriteOnly.length > 0) {
        if (readWriteMode === 'write') {
          exception.message(...EC.dataTypeReadOnly(readWriteOnly))
          valid = false
        } else if (readWriteMode === 'read') {
          exception.message(...EC.dataTypeWriteOnly(readWriteOnly))
          valid = false
        }
      }

      // validate number of properties
      const propertyCount = Object.keys(properties).length
      if (schema.maxProperties !== undefined && propertyCount > schema.maxProperties) {
        exception.message(...EC.dataTypeMaxProperties(schema.maxProperties, propertyCount))
        valid = false
      }
      if (schema.minProperties !== undefined && propertyCount < schema.minProperties) {
        exception.message(...EC.dataTypeMinProperties(schema.minProperties, propertyCount))
        valid = false
      }

      // if a discriminator is present then validate discriminator mapping
      if (schema.discriminator !== undefined) {
        const details = schema.discriminate(value)
        if (details.schema != null) {
          const { result } = validate(details.schema as Schema, value, map, exception, options)
          if (result === false) valid = false
        } else if (details.name !== undefined) {
          exception.message(...EC.schemaDiscriminatorUnmapped(details.key, details.name))
          valid = false
        } // else - already taken care of because it's a missing required error
      }
    }
  } else {
    // validate primitive data types
    // @ts-expect-error
    if (schema.type !== undefined && schema.type !== '') {
      const dataType = getDataTypeDefinition(schema.type, schema.format)
      if (dataType !== undefined) {
        valid = valid && dataType.validate(value, exception, schema)
      } else {
        valid = false
      }
    }
  }

  if (schema.enum !== undefined) {
    const length = schema.enum.length
    let found = false
    for (let i = 0; i < length; i++) {
      if (same(value, schema.enum[i])) {
        found = true
        break
      }
    }
    if (!found) {
      exception.message(...EC.dataTypeEnum(schema.enum, value))
      valid = false
    }
  }

  return mapped.setResult(valid)
}

function addUniqueDeterminedType (to: DeterminedTypesItems, type: string, format: string = ''): void {
  const index = to.findIndex(v => v.type === type)
  if (index === -1) {
    to.push({
      type: type as Type,
      formats: [format]
    })
  } else {
    const item = to[index]
    if (!item.formats.includes(format)) item.formats.push(format)
  }
}

// create a replacement function for the populate injectors
function buildInjector (rxGenerator: () => RegExp): Injector {
  return function (value: string, data: Record<string, string>): string {
    const rx = rxGenerator()
    let match
    let result = ''
    let offset = 0
    while ((match = rx.exec(value)) !== null) {
      const property = match[1]
      result += value.substring(offset, match.index) + (data[property] !== undefined ? data[property] : match[0])
      offset = match.index + match[0].length
    }
    return result + value.substr(offset)
  }
}

function mergeUniqueDeterminedType (from: DeterminedTypesItems, to: DeterminedTypesItems): void {
  from.forEach(v => {
    const type = v.type
    v.formats.forEach(format => {
      addUniqueDeterminedType(to, type, format)
    })
  })
}

function populateApply (schema: Schema, type: string, parameters: Record<string, any>, target: Record<string, any>, key: string, injector: Injector, options: Required<PopulateOptions>): any {
  const directive = schema.enforcer.extensions.populate ?? {}
  if (directive.condition !== undefined && directive.condition in parameters && parameters[directive.condition] === false) return

  if (target[key] === undefined) {
    if (directive.id !== undefined && directive.id in parameters) {
      const value: any = parameters[directive.id]
      if (value !== undefined) target[key] = value
    } else if (key in parameters) {
      const value: any = parameters[key]
      if (value !== undefined) target[key] = value
    } else if ((directive.default !== undefined || schema.default !== undefined) && directive.useDefault !== false && options.useDefaults) {
      const value = directive.default ?? schema.default
      const replacement = typeof value === 'string' ? directive.replacement ?? options.replacement : 'none'
      target[key] = replacement === 'none' ? value : injector(value, parameters)
    }
  }

  return target[key]
}

function randomSchema (Constructor: any): Schema {
  // type "string" format "binary" or "byte" cannot be serialized or deserialized w/o schema
  // so they are omitted from the list of possible random schemas
  const def = Randomizer.oneOf([
    { type: 'boolean' },
    { type: 'integer' },
    { type: 'number' },
    { type: 'string' },
    { type: 'string', format: 'date' },
    { type: 'string', format: 'date-time' }
  ])
  return new Constructor(def)
}

function serializer (mode: 'deserialize' | 'serialize', schema: Schema, value: any, map: MapStore<any>, exception: Exception): MapItem<any> {
  // watch for values that have already been deserialized against this value
  const mapped = map.get(schema, value)
  if (mapped.result !== undefined) return mapped

  // handle nullable
  if (value === null && (schema.enforcer.nullable === true || ('nullable' in schema && schema.nullable === true))) {
    return mapped.setResult(null)
  }

  const types = determineTypes(schema, new Map())
  const { type, format } = types.get(true)

  if (('anyOf' in schema || 'oneOf' in schema) && types.known.length === 0 && types.possible.length > 0) {
    sortDeterminedTypes(types)
    const length = types.possible.length
    for (let i = 0; i < length; i++) {
      const { type, formats } = types.possible[i]
      const format = formats[0] ?? ''
      const childException = new Exception()
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const { result } = serializer(mode, { type, format } as Schema, value, new MapStore(), childException)
      if (!childException.hasException) {
        const resultType = typeof result
        if (type === 'boolean' && resultType === 'boolean') return mapped.setResult(result)
        if ((type === 'number' || type === 'integer') && resultType === 'number' && !isNaN(result)) return mapped.setResult(result)
        if (type === 'string' && resultType === 'string') return mapped.setResult(result)
        if (type === 'array' && Array.isArray(result)) return mapped.setResult(result)
        if (type === 'object' && resultType === 'object') return mapped.setResult(result)

        const dataType = getDataTypeDefinition(type, format)
        if (dataType !== undefined) {
          const length = dataType.constructors.length
          for (let j = 0; j < length; j++) {
            if (result instanceof dataType.constructors[j]) return mapped.setResult(result)
          }
        }
      }
    }

    // unable to deserialize or serialize
    const schemaKey = 'anyOf' in schema ? 'anyOf' : 'oneOf'
    exception.at(schemaKey).message(...EC.schemaIndeterminate(mode))
  } else if (type === '' || 'not' in schema) {
    return mapped.setResult(value)
  } else if (type === 'array') {
    if (Array.isArray(value)) {
      const result: any[] = []
      const item = mapped.setResult(result)
      value.forEach((v: any, i: number) => {
        result.push(serializer(mode, schema.items as Schema, v, map, exception.at(i)).result)
      })
      return item
    } else {
      exception.message(...EC.dataTypeInvalid('an array', value))
    }
  } else if (type === 'object') {
    if (isObject(value)) {
      const result: any = {}
      const item = mapped.setResult(result)
      const additionalProperties = schema.additionalProperties ?? true
      const properties = schema.properties ?? {}
      Object.keys(value).forEach(key => {
        if (key in properties) {
          result[key] = serializer(mode, properties[key], value[key], map, exception.at(key)).result
        } else if (additionalProperties === true) {
          result[key] = value[key]
        } else if (additionalProperties !== false) {
          result[key] = serializer(mode, additionalProperties, value[key], map, exception.at(key)).result
        }
      })
      if ('discriminator' in schema) {
        const d = schema.discriminate(value)
        if (d.schema !== null) {
          Object.assign(result, serializer(mode, d.schema as Schema, value, map, exception).result)
        } else {
          exception.message(...EC.schemaDiscriminatorUnmapped(d.key, d.name))
        }
      }
      return item
    }
  } else {
    const dataType = getDataTypeDefinition(type, format)
    if (dataType !== undefined) {
      return mapped.setResult(dataType[mode](value, schema))
    } else {
      mapped.setResult(value)
    }
  }

  return mapped
}

function sortDeterminedTypes (store: DeterminedTypes): void {
  ;['known', 'possible'].forEach(key => {
    // @ts-expect-error
    store[key].sort((a, b) => {
      if (a === 'number') return -1
      if (b === 'number') return 1
      if (a === 'boolean') return -1
      if (b === 'boolean') return 1
      if (a === 'string') return -1
      if (b === 'string') return 1
      if (a === 'array') return -1
      if (b === 'array') return 1
      if (a === 'object') return -1
      if (b === 'object') return 1
      return -1
    })
    // @ts-expect-error
    store[key].forEach(item => {
      item.formats.sort((a: string, b: string) => {
        if (a === '') return 1
        if (b === '') return -1
        return -1
      })
    })
  })
}
