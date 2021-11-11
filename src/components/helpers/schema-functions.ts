import { Exception } from '../../utils/Exception'
import { ValidateOptions } from '../Schema'
import { Schema2 as Definition2, Schema3 as Definition3 } from './DefinitionTypes'
import { Schema as Schema2 } from '../v2/Schema'
import { Schema as Schema3 } from '../v3/Schema'
import { isObject, same, smart } from '../../utils/util'
import { getDataTypeDefinition } from './DataTypes'
import { Enforcer } from '../index'

type Definition = Definition2 | Definition3
type Schema = Schema2 | Schema3

export interface TypeFormat {
  type: string
  format: string
}

interface DeterminedTypes {
  known: DeterminedTypesItems
  possible: DeterminedTypesItems
  get: (includePossible: boolean) => TypeFormat
}

type DeterminedTypesItems = Array<{ type: string, formats: string[] }>

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

export function deserialize (schema: Schema, value: any, map: MapStore<any>, exception: Exception): MapItem<any> {
  // watch for values that have already been deserialized against this value
  const mapped = map.get(schema, value)
  if (mapped.result !== undefined) return mapped

  // handle nullable
  if (value === null && (schema['x-nullable'] === true || ('nullable' in schema && schema.nullable === true))) {
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
      const { result } = deserialize({ type, format } as Schema, value, new MapStore(), childException)
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

    // unable to deserialize
    const schemaKey = 'anyOf' in schema ? 'anyOf' : 'oneOf'
    exception.at(schemaKey).message('Unable to determine deserialization method for value: ' + smart(value))
  } else if (type === '') {
    return mapped.setResult(value)
  } else if (type === 'array') {
    if (Array.isArray(value)) {
      const result: any[] = []
      const item = mapped.setResult(result)
      value.forEach((v: any, i: number) => {
        result.push(deserialize(schema.items as Schema, v, map, exception.at(i)).result)
      })
      return item
    } else {
      exception.message('Expected an array. Received: ' + smart(value))
    }
  } else if (type === 'object') {
    if (isObject(value)) {
      const result: any = {}
      const item = mapped.setResult(result)
      const additionalProperties = schema.additionalProperties ?? true
      const properties = schema.properties ?? {}
      Object.keys(value).forEach(key => {
        if (key in properties) {
          result[key] = deserialize(properties[key], value[key], map, exception.at(key)).result
        } else if (additionalProperties === true) {
          result[key] = value[key]
        } else if (additionalProperties !== false) {
          result[key] = deserialize(additionalProperties, value[key], map, exception.at(key)).result
        }
      })
      if ('discriminator' in schema) {
        const d = schema.discriminate(value)
        if (d.schema !== null) {
          Object.assign(result, deserialize(d.schema, value, map, exception).result)
        } else {
          exception.message('Discriminator property "' + d.key + '" as "' + d.name + '" did not map to a schema.')
        }
      }
      return item
    }
  } else {
    const dataType = getDataTypeDefinition(type, format)
    if (dataType !== undefined) {
      return mapped.setResult(dataType.deserialize(value, schema))
    } else {
      mapped.setResult(value)
    }
  }

  return mapped
}

export function determineTypes (def: Definition | Schema, map: Map<Definition | Schema, DeterminedTypes>): DeterminedTypes {
  const existing = map.get(def)
  if (existing !== undefined) return existing

  const result: DeterminedTypes = {
    known: [],
    possible: [],
    get (includePossible) {
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

// validate a deserialized value
// TODO: how to handle validation if the schema is a dereferenced object?
export function validate (schema: Schema, value: any, map: MapStore<boolean>, exception: Exception, options: ValidateOptions): MapItem<boolean> {
  // watch for values that have already been validated against this value
  const mapped = map.get(schema, value)
  if (mapped.result !== undefined) return mapped

  // check for nullable
  if (value === null && (schema['x-nullable'] === true || ('nullable' in schema && schema.nullable === true))) {
    return mapped.setResult(true)
  }

  let valid: boolean = true
  if ('allOf' in schema) {
    const child = exception.nest('Did not validate against all schemas')
    schema.allOf?.forEach((schema, index) => {
      const { result } = validate(schema, value, map, child, options)
      if (result === false) valid = false
    })
  } else if ('anyOf' in schema && schema.anyOf !== undefined) {
    if ('discriminator' in schema) {
      const { key, schema: childSchema } = schema.discriminate(value)
      if (childSchema === null) {
        exception.message(`Discriminator property "${key}" as "${String(value[key])}" did not map to a schema.`)
        valid = false
      } else {
        const { result } = validate(childSchema, value, map, exception.at(value[key]), options)
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
      exception.message('Value should not validate against schema')
      valid = false
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      exception.message('Expected an array. Received: ' + smart(value))
      valid = false
    } else {
      const length = value.length
      if (schema.maxItems !== undefined && schema.maxItems < length) {
        exception.message('Too many items in the array. Maximum of ' + String(schema.maxItems) + '. Found ' + String(length) + ' items')
        valid = false
      }
      if (schema.minItems !== undefined && schema.minItems > length) {
        exception.message('Too few items in the array. Minimum of ' + String(schema.minItems) + '. Found ' + String(length) + ' items')
        valid = false
      }
      if (schema.uniqueItems === true) {
        const singles: any[] = []
        value.forEach((item, index) => {
          const length = singles.length
          let found = false
          for (let i = 0; i < length; i++) {
            if (same(item, singles[i])) {
              exception.message('Array items must be unique. Value is not unique at index: ' + String(index))
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
      exception.message('Expected a non-null object. Received: ' + smart(value))
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
            exception.at(key).message('Property not allowed')
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
        exception.message('One or more required properties missing: ' + required.join(', '))
        valid = false
      }

      // validate that we only have readable or writable properties
      if (readWriteOnly.length > 0) {
        if (readWriteMode === 'write') {
          exception.message('Cannot write to read only properties: ' + readWriteOnly.join(', '))
          valid = false
        } else if (readWriteMode === 'read') {
          exception.message('Cannot read from write only properties: ' + readWriteOnly.join(', '))
          valid = false
        }
      }

      // validate number of properties
      const propertyCount = Object.keys(properties).length
      if (schema.maxProperties !== undefined && propertyCount > schema.maxProperties) {
        exception.message('Object with ' + String(propertyCount) + ' properties has more than the maximum number of allowed properties: ' + String(schema.maxProperties))
        valid = false
      }
      if (schema.minProperties !== undefined && propertyCount < schema.minProperties) {
        exception.message('Object with ' + String(propertyCount) + ' properties has less than the minimum number of allowed properties: ' + String(schema.maxProperties))
        valid = false
      }

      // if a discriminator is present then validate discriminator mapping
      if (schema.discriminator !== undefined) {
        const details = schema.discriminate(value)
        if (details.schema != null) {
          const { result } = validate(details.schema, value, map, exception, options)
          if (result === false) valid = false
        } else if (details.name !== undefined) {
          exception.message('Discriminator property "' + details.key + '" as "' + details.name + '" did not map to a schema')
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
        valid = valid && dataType.validate(schema, exception, value)
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
      exception.message('Value ' + smart(value) + ' did not meet enum requirements')
      valid = false
    }
  }

  return mapped.setResult(valid)
}

function addUniqueDeterminedType (to: DeterminedTypesItems, type: string, format: string = ''): void {
  const index = to.findIndex(v => v.type === type)
  if (index === -1) {
    to.push({
      type,
      formats: [format]
    })
  } else {
    const item = to[index]
    if (!item.formats.includes(format)) item.formats.push(format)
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
      item.formats.sort((a, b) => {
        if (a === '') return 1
        if (b === '') return -1
        return -1
      })
    })
  })
}

/*
function determineTypeRecursive (def: Definition | Schema, map: Map<Definition | Schema, string>, context: TypeFormat): TypeFormat {
  const existing = map.get(def)
  if (existing !== undefined) return { type: '', format: '' }
  map.set(def, '')

  if ('$ref' in def) {
    return { type: '', format: '' }
  } else if (def.type !== undefined) {
    return {
      type: def.type,
      format: def.format ?? ''
    }
  } else if ('discriminator' in def) {
    // only objects can use the discriminator, so if that property exists then it must be an object
    return { type: 'object', format: '' }
  } else if ('items' in def || 'maxItems' in def || 'minItems' in def || 'uniqueItems' in def) {
    return { type: 'array', format: '' }
  } else if ('additionalProperties' in def || 'properties' in def || 'maxProperties' in def || 'minProperties' in def) {
    return { type: 'object', format: '' }
  } else if ('maxLength' in def || 'minLength' in def || 'pattern' in def) {
    return {
      type: 'string',
      format: def.format ?? ''
    }
  } else if ('maximum' in def || 'minimum' in def || 'exclusiveMaximum' in def || 'exclusiveMinimum' in def || 'multipleOf' in def) {
    return {
      type: 'number',
      format: def.format ?? ''
    }
  } else if ('default' in def) {
    const value = def.default
    if (Array.isArray(value)) {
      return { type: 'array', format: '' }
    } else {
      return { type: typeof value, format: '' }
    }
  } else if ('example' in def) {
    const value = def.example
    if (Array.isArray(value)) {
      return 'array'
    } else {
      return typeof value
    }
  } else if (def.enum !== undefined && def.enum.length > 0) {
    const value = def.enum[0]
    if (Array.isArray(value)) {
      return 'array'
    } else {
      return typeof value
    }
  } else if ('allOf' in def) {
    const copy = def.allOf.slice(0)
    const length = copy.length
    const typeSet: Set<string> = new Set()
    copy.sort(determineTypeSort)
    for (let i = 0; i < length; i++) {
      const type = determineTypeRecursive(copy[i], map, contextType)
      if (contextType === '' && type !== '') contextType = type
      typeSet.add(type)
    }
    const types = Array.from(typeSet)
    if (types.length > 1) throw Error('Type conflict between allOf schemas. Determined types: ' + types.join(', '))
    return types.length === 1 ? types[0] : ''
  } else if ('anyOf' in def || 'oneOf' in def) {
    const copy = def['anyOf' in def ? 'anyOf' : 'oneOf'].slice(0)
    const length = copy.length
    const typeSet: Set<string> = new Set()
    copy.sort(determineTypeSort)
    for (let i = 0; i < length; i++) {
      typeSet.add(determineTypeRecursive(copy[i], map, contextType))
    }
    const types = Array.from(typeSet)
    if (contextType !== '' && !types.includes(contextType) && !types.includes('')) throw Error('Type conflict within oneOf schemas. Expected at least one to match type: ' + contextType)
    return contextType === '' ? types[0] : contextType
  } else {
    return ''
  }
}
*/

/* function determineTypeSort (a: Definition | Schema, b: Definition | Schema): number {
  if (a.type !== undefined && b.type === undefined) return -1 // if a type is defined then it has highest priority
  if (a.type === undefined && b.type !== undefined) return 1
  if (a.allOf !== undefined && b.allOf === undefined) return -1
  if (a.allOf === undefined && b.allOf !== undefined) return 1
  if (a.anyOf === undefined && b.anyOf !== undefined) return -1
  if (a.oneOf === undefined && b.oneOf !== undefined) return -1
  if (a.anyOf !== undefined && b.anyOf === undefined) return 1
  if (a.oneOf !== undefined && b.oneOf === undefined) return 1
  return -1
} */
