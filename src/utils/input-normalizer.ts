import { Exception } from '../Exception'
import { smart } from './util'
import { Result } from './Result'

export type Schema = SchemaArray | SchemaBoolean | SchemaNumber | SchemaObject | SchemaOneOf | SchemaString | SchemaUndefined

interface SchemaBase<T> {
  type: string
  default?: T
  enum?: T[]
}

export interface SchemaArray {
  type: 'array'
  items?: Schema
  maxItems?: number
  minItems?: number
}

export interface SchemaBoolean extends SchemaBase<boolean> {
  type: 'boolean'
}

export interface SchemaNumber extends SchemaBase<number> {
  type: 'number'
  exclusiveMaximum?: boolean // default: false
  exclusiveMinimum?: boolean // default: false
  maximum?: number
  minimum?: number
  multipleOf?: number
}

export interface SchemaObject {
  type: 'object'
  additionalProperties?: boolean | Schema // default: true
  nullable?: boolean // default: false
  properties?: Record<string, Schema>
  required?: string[]
}

export interface SchemaOneOf extends SchemaBase<any> {
  type: 'oneOf'
  oneOf: Schema[]
}

export interface SchemaString extends SchemaBase<string> {
  type: 'string'
  maxLength?: number
  minLength?: number
  pattern?: RegExp
}

export interface SchemaUndefined {
  type: 'undefined'
}

export function normalizer<T=any> (schema: Schema): (value: T, exception: Exception) => Result<T> {
  return (value: T): Result<T> => {
    return normalize(value, schema, new Exception('Input is not valid'))
  }
}

export const N = {
  Array (items: Schema): SchemaArray {
    return {
      type: 'array',
      items
    }
  },
  Boolean (config: Partial<SchemaBoolean> = {}): SchemaBoolean {
    return Object.assign({ type: 'boolean' }, config)
  },
  Record (...schemas: Schema[]): SchemaObject {
    const additionalProperties: Schema = schemas.length > 1
      ? { type: 'oneOf', oneOf: schemas }
      : schemas[0]
    return {
      type: 'object',
      additionalProperties
    }
  },
  Object (config: Partial<SchemaObject> = {}): SchemaObject {
    return Object.assign({ type: 'object' }, config)
  },
  OneOf (...schemas: Schema[]): Schema {
    if (schemas.length === 1) {
      return schemas[0]
    } else {
      return {
        type: 'oneOf',
        oneOf: schemas
      }
    }
  },
  String (config: Partial<SchemaString> = {}): SchemaString {
    return Object.assign({ type: 'string' }, config)
  },
  Undefined (): SchemaUndefined {
    return { type: 'undefined' }
  }
}

function normalize (value: any, schema: Schema, exception: Exception): Result<any> {
  if (value === undefined && 'default' in schema && schema.default !== undefined) {
    return new Result(schema.default)
  }

  if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      exception.add.invalidInput('Expected an array. Received: ' + smart(value))
    } else {
      const length = value.length
      if (schema.maxItems !== undefined && schema.maxItems < length) {
        exception.add.invalidInput('Expected an array with ' + String(schema.maxItems) + ' or less items.')
      }
      if (schema.minItems !== undefined && schema.minItems > length) {
        exception.add.invalidInput('Expected an array with ' + String(schema.maxItems) + ' or more items.')
      }
      if (schema.items !== undefined) {
        value = value.map((v: any, index: number) => {
          const r = normalize(v, schema.items as Schema, exception.at(index))
          return r.value
        })
      }
    }
  } else if (schema.type === 'boolean') {
    if (typeof value !== 'boolean') {
      exception.add.invalidInput('Expected a boolean. Received: ' + smart(value))
    }
  } else if (schema.type === 'number') {
    if (typeof value !== 'number') {
      exception.add.invalidInput('Expected a number. Received: ' + smart(value))
    } else {
      if (schema.maximum !== undefined) {
        if (schema.exclusiveMaximum === true && value >= schema.maximum) {
          exception.add.invalidInput('Expected the value to be less than ' + String(schema.maximum))
        } else if (value > schema.maximum) {
          exception.add.invalidInput('Expected the value to be less than or equal to ' + String(schema.maximum))
        }
      }
      if (schema.minimum !== undefined) {
        if (schema.exclusiveMinimum === true && value <= schema.minimum) {
          exception.add.invalidInput('Expected the value to be greater than ' + String(schema.minimum))
        } else if (value > schema.minimum) {
          exception.add.invalidInput('Expected the value to be greater than or equal to ' + String(schema.minimum))
        }
      }
      if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0) {
        exception.add.invalidInput('Expected the value to be a multiple of ' + String(schema.multipleOf))
      }
    }
  } else if (schema.type === 'object') {
    if (typeof value !== 'object' || (value === null && schema.nullable !== true)) {
      exception.add.invalidInput('Expected a ' + (schema.nullable !== true ? 'non-null ' : '') + 'object. Received: ' + smart(value))
    } else if (value !== null) {
      const missingRequired = schema.required ?? []
      const propertiesNotAllowed: string[] = []
      Object.keys(value).forEach(key => {
        const index = missingRequired.indexOf(key)
        if (index !== -1) missingRequired.splice(index, 1)

        if (schema.properties?.[key] !== undefined) {
          const r = normalize(value[key], schema.properties[key], exception.at(key))
          value[key] = r.value
        } else if (schema.additionalProperties === false) {
          propertiesNotAllowed.push(key)
        } else if (schema.additionalProperties !== true) {
          const r = normalize(value[key], schema.additionalProperties as Schema, exception.at(key))
          value[key] = r.value
        }
      })

      const schemaProperties = schema.properties ?? {}
      Object.keys(schemaProperties).forEach(key => {
        const hasDefault = 'default' in schemaProperties[key]
        if (!(key in value) && hasDefault) {
          // @ts-expect-error
          value[key] = schemaProperties[key]?.default
        }
      })

      if (propertiesNotAllowed.length > 0) {
        exception.add.invalidInput('Object has one or more properties that are not allowed: ' + propertiesNotAllowed.join(', '))
      }
    }
  } else if (schema.type === 'oneOf') {
    const length = schema.oneOf.length
    const exceptions: Exception[] = []
    let success = false
    for (let i = 0; i < length; i++) {
      const e = new Exception()
      exceptions.push(e)
      const r = normalize(value, schema.oneOf[i], e)
      if (r.value !== undefined) {
        success = true
        value = r.value
        break
      }
    }
    if (!success) {
      const e = exception.nest('Value did not match any of the possible values.')
      exceptions.forEach(ex => e.push(ex))
    }
  } else if (schema.type === 'string') {
    if (typeof value !== 'string') {
      exception.add.invalidInput('Expected a string. Received: ' + smart(value))
    } else {
      const length = value.length
      if (schema.maxLength !== undefined && schema.maxLength < length) {
        exception.add.invalidInput('Expected the string length to be less than or equal to ' + String(schema.maxLength))
      }
      if (schema.minLength !== undefined && schema.minLength > length) {
        exception.add.invalidInput('Expected the string length to be greater than or equal to ' + String(schema.minLength))
      }
      if (schema.pattern !== undefined && !schema.pattern.test(value)) {
        exception.add.invalidInput('The value did not match the required pattern.')
      }
    }
  } else if (schema.type === undefined) {
    if (typeof value !== 'undefined') {
      exception.add.invalidInput('Expected undefined. Received: ' + smart(value))
    }
  }

  if ('enum' in schema && schema.enum !== undefined && schema.enum.findIndex(value) === -1) {
    exception.add.invalidInput('Expected one of: ' + schema.enum.join(', ') + '. Received: ' + smart(value))
  }

  return new Result(value, exception)
}
