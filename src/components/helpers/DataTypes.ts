/**
 * Problems to solve:
 *
 * 1. Need a way to define deserialize, random, serialize, validate for each primitive data type
 * 2. Need a way to define toNumber to numeric primitive types
 * 3. Need a way to extend and use existing primitive types
 * 4. Want to make types being returned explicit
 */

import { Schema as Schema2 } from '../v2/Schema'
import { Schema as Schema3 } from '../v3/Schema'
import { Exception } from '../../utils/Exception'
import rx from '../../utils/rx'
import * as random from './Randomizer'
import { noop, smart } from '../../utils/util'

export interface DataType<DeserializedType, SerializedType> {
  type: string
  format: string
  constructors: Function[]
  deserialize: (value: SerializedType, schema: Schema) => DeserializedType
  random: (schema: Schema) => DeserializedType
  serialize: (value: DeserializedType, schema: Schema) => SerializedType
  toNumber: null | ((value: DeserializedType, schema: Schema) => number)
  validate: (value: DeserializedType, exception: Exception, schema: Schema) => boolean
}

// TODO: figure out how to export this so it can be extended and maintain types for users
export interface DataTypeRegistry {
  boolean: {
    default: DataType<boolean, boolean>
  }
  number: {
    default: DataType<number, number>
    int32: DataType<number, number>
    int64: DataType<number, number>
  }
  integer: {
    default: DataType<number, number>
    float: DataType<number, number>
    double: DataType<number, number>
  }
  string: {
    default: DataType<string, string>
    binary: DataType<Uint8Array, string>
    byte: DataType<Uint8Array, string>
    date: DataType<Date, string>
    'date-time': DataType<Date, string>
    password: DataType<string, string>
  }
  [type: string]: Record<string, DataType<any, any>>
}

type Schema = Schema2 | Schema3

// This is an error because we haven't defined the required types yet, but we will below
// @ts-expect-error
const DataTypes: DataTypeRegistry = {}
const abc = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'] // base64 alphabet
const zeros = '00000000'
const noopDefinition: DataType<any, any> = {
  type: '',
  format: '',
  constructors: [],
  deserialize: v => v,
  random: noop,
  serialize: v => v,
  toNumber: null,
  validate: () => true
}

export function getDataTypeDefinition (type: string, format?: string): DataType<any, any> | undefined {
  if (type === undefined || type === '') {
    // throw Error('Type not specified')
    return undefined
  } else if (!(type in DataTypes)) {
    // throw Error('Type is not defined: ' + type)
    return undefined
  } else {
    const formatNotSpecified = format === undefined || format === ''
    const formatKey = formatNotSpecified ? 'default' : format
    if (formatKey in DataTypes[type]) {
      return DataTypes[type][formatKey]
    } else if (!formatNotSpecified) {
      return getDataTypeDefinition(type, '')
    }
  }
}

export function getNoopTypeDefinition (): DataType<any, any> {
  return noopDefinition
}

export function extendDataTypeDefinition<DeserializedType, SerializedType> (fromType: string, fromFormat: string, definition: Partial<DataType<DeserializedType, SerializedType>>): void {
  if (fromFormat === undefined) fromFormat = 'default'
  const dataType = getDataTypeDefinition(fromType, fromFormat)
  if (dataType === undefined) throw Error('Unable to extend type and format because it does not exist: ' + fromType + ' ' + fromFormat)

  const copy = Object.assign({}, dataType)
  copy.constructors = dataType.constructors.slice(0) ?? []
  setDataTypeDefinition(Object.assign(copy, definition))
}

export function setDataTypeDefinition<DeserializedType, SerializedType> (definition: DataType<DeserializedType, SerializedType>): void {
  let { type, format } = definition
  if (type === undefined || type === '') throw Error('Invalid type specified. Value must be a non-empty string.')
  if (format === undefined || format === '') format = 'default'
  if (!(type in DataTypes)) {
    if (format !== 'default') throw Error('You must specify the default format for a new type before you can specify additional formats. New type: ' + type)
    DataTypes[type] = {}
  }
  DataTypes[type][format] = definition
}

setDataTypeDefinition<boolean, boolean>({
  type: 'boolean',
  format: 'default',
  constructors: [],
  deserialize (value: boolean): boolean {
    return value
  },
  random (): boolean {
    return random.oneOf([true, false])
  },
  serialize (value: boolean): boolean {
    return value
  },
  toNumber: null,
  validate (value: boolean, exception: Exception): boolean {
    if (typeof value !== 'boolean') {
      exception.message('Expected a boolean. Received: ' + smart(value))
      return false
    } else {
      return true
    }
  }
})

setDataTypeDefinition<number, number>({
  type: 'number',
  format: 'default',
  constructors: [],
  deserialize: function (value: string | number): number {
    return +value
  },
  random: function (schema: Schema): number {
    const { max, min } = determineMaxMin(this, schema, 'maximum', 'minimum', 1000)
    return random.number({
      decimalPlaces: 4,
      exclusiveMax: schema.exclusiveMaximum ?? false,
      exclusiveMin: schema.exclusiveMinimum ?? false,
      min,
      max,
      multipleOf: schema.multipleOf === undefined ? 0 : this.deserialize(schema.multipleOf, schema)
    })
  },
  serialize: function (value: number): number {
    return value
  },
  toNumber: function (value: number): number {
    return value
  },
  validate: function (value: number, exception: Exception, schema: Schema): boolean {
    let valid = true
    try {
      if (typeof value !== 'number') {
        exception.message('Expected a number. Received: ' + smart(value))
        valid = false
      } else {
        if (schema.maximum !== undefined) {
          const maximum = this.deserialize(schema.maximum, schema)
          if (schema.exclusiveMaximum === true && value >= maximum) {
            const serializedValue = this.serialize(value, schema)
            exception.message(`Value must be less than ${String(schema.maximum)}. Received: ${String(serializedValue)}`)
            valid = false
          } else if (value > maximum) {
            const serializedValue = this.serialize(value, schema)
            exception.message(`Value must be less than or equal to ${String(schema.maximum)}. Received: ${String(serializedValue)}`)
            valid = false
          }
        }

        if (schema.minimum !== undefined) {
          const minimum = this.deserialize(schema.minimum, schema)
          if (schema.exclusiveMinimum === true && value >= minimum) {
            const serializedValue = this.serialize(value, schema)
            exception.message(`Value must be greater than ${String(schema.minimum)}. Received: ${String(serializedValue)}`)
            valid = false
          } else if (value > minimum) {
            const serializedValue = this.serialize(value, schema)
            exception.message(`Value must be greater than or equal to ${String(schema.minimum)}. Received: ${String(serializedValue)}`)
            valid = false
          }
        }

        if (schema.multipleOf !== undefined) {
          const multipleOf = this.deserialize(schema.multipleOf, schema)
          if (value % multipleOf !== 0) {
            const serializedValue = this.serialize(value, schema)
            exception.message(`Expected a multiple of ${String(schema.multipleOf)}. Received: ${String(serializedValue)}`)
            valid = false
          }
        }
      }
    } catch (e: any) {
      exception.message('Unexpected error: ' + String(e.message))
      valid = false
    }
    return valid
  }
})
extendDataTypeDefinition<number, number>('number', '', { format: 'float' })
extendDataTypeDefinition<number, number>('number', '', { format: 'double' })

extendDataTypeDefinition<number, number>('number', '', {
  type: 'integer',
  format: 'default',
  validate: function (value: number, exception: Exception, schema: Schema): boolean {
    if (typeof value !== 'number' || Math.round(value) !== value) {
      exception.message('Expected an integer. Received: ' + smart(value))
      return false
    } else {
      const numberType = getDataTypeDefinition('number')
      return numberType?.validate(value, exception, schema) ?? false
    }
  }
})
extendDataTypeDefinition<number, number>('integer', '', { format: 'int32' })
extendDataTypeDefinition<number, number>('integer', '', { format: 'int64' })

setDataTypeDefinition<string, string>({
  type: 'string',
  format: 'default',
  constructors: [],
  deserialize: function (value: string): string {
    return value
  },
  random: function (schema: Schema): string {
    const { min, max } = determineMaxMin(this, schema, 'maxLength', 'minLength', 20)
    return random.text({
      maxLength: max,
      minLength: min,
      pattern: schema.pattern
    })
  },
  serialize: function (value: string): string {
    return value
  },
  toNumber: null,
  validate: function (value: string, exception: Exception): boolean {
    if (typeof value !== 'string') {
      exception.message('Expected an integer. Received: ' + smart(value))
      return false
    }
    return true
  }
})

setDataTypeDefinition<Uint8Array, string>({
  type: 'string',
  format: 'binary',
  constructors: [Uint8Array],
  deserialize: function (value: string, schema: Schema): Uint8Array {
    if (typeof value !== 'string' || !rx.binary.test(value)) {
      throw Error('Expected a binary octet string')
    } else {
      const length = value.length
      const array = []
      for (let i = 0; i < length; i += 8) array.push(parseInt(value.substr(i, 8), 2))
      return Uint8Array.from(array)
    }
  },
  random: function (schema: Schema): Uint8Array {
    let { min, max } = determineMaxMin(this, schema, 'maxLength', 'minLength', 1000)
    min = Math.round(min / 8)
    max = Math.round(max / 8)

    const length = random.number({ min, max })
    const array = []
    for (let i = 0; i < length; i++) array.push(Math.floor(Math.random() * 256))
    return Uint8Array.from(array)
  },
  serialize: function (value: Uint8Array): string {
    if (value instanceof Uint8Array) {
      let binary = ''
      for (let i = 0; i < value.length; i++) {
        const byte = value[i].toString(2)
        binary += zeros.substr(byte.length) + byte
      }
      return binary
    } else {
      throw Error('Expected a Unit8Array instance. Received: ' + smart(value))
    }
  },
  toNumber: null,
  validate: function (value: Uint8Array, exception: Exception, schema: Schema): boolean {
    if (value instanceof Uint8Array) {
      const valueLength = value.length * 8
      let valid = true
      if (schema.maxLength !== undefined && valueLength >= schema.maxLength) {
        exception.message(`Uint8Array must be less than or equal to ${String(schema.maxLength)}. Actual length: ${value.length}`)
        valid = false
      }
      if (schema.minLength !== undefined && valueLength <= schema.minLength) {
        exception.message(`Uint8Array must be greater than or equal to ${String(schema.minLength)}. Actual length: ${value.length}`)
        valid = false
      }
      return valid
    } else {
      exception.message('Expected value to be a Uint8Array. Received: ' + smart(value))
      return false
    }
  }
})

setDataTypeDefinition<Uint8Array, string>({
  type: 'string',
  format: 'byte',
  constructors: [Uint8Array],
  deserialize: function (value: string, schema: Schema): Uint8Array {
    if (typeof value === 'string') {
      value = value.replace(/(\s)/gm, '')
      if (!rx.byte.test(value) || value.length % 4 !== 0) {
        throw Error('Expected a base64 string')
      } else {
        const result = []
        const length = value.length / 4
        for (let i = 0; i < length; i++) {
          const chunk = [...value.slice(4 * i, 4 * i + 4)]
          const bin = chunk.map(x => abc.indexOf(x).toString(2).padStart(6, '0')).join('')
          const bytes = (bin.match(/.{1,8}/g) as string[]).map(x => +('0b' + x))
          result.push(...bytes.slice(0, 3 - (value[4 * i + 2] === '=' ? 1 : 0) - (value[4 * i + 3] === '=' ? 1 : 0)))
        }
        return Uint8Array.from(result)
      }
    } else {
      throw Error('Expected a base64 string')
    }
  },
  random: getDataTypeDefinition('string', 'binary')?.random ?? noop,
  serialize: function (value: Uint8Array, schema: Schema): string {
    function bin (n: number): string {
      return n.toString(2).padStart(8, '0') // convert num to 8-bit binary string
    }

    if (value instanceof Uint8Array) {
      const length = value.length
      const loopLength = (length - 1) / 3
      let result = ''
      for (let i = 0; i <= loopLength; i++) {
        const c1 = i * 3 + 1 >= length // case when "=" is on end
        const c2 = i * 3 + 2 >= length // case when "=" is on end
        const chunk = (bin(value[3 * i]) + bin(c1 ? 0 : value[3 * i + 1]) + bin(c2 ? 0 : value[3 * i + 2]))
        const r = (chunk.match(/.{1,6}/g) as string[]).map((x, j) => j === 3 && c2 ? '=' : (j === 2 && c1 ? '=' : abc[+('0b' + x)]))
        result += r.join('')
      }
      return result
    } else {
      throw Error('Expected value to be a Uint8Array. Received: ' + smart(value))
    }
  },
  toNumber: null,
  validate: function (value: Uint8Array, exception: Exception, schema: Schema): boolean {
    if (value instanceof Uint8Array) {
      const valueLength = value.length * 4
      let valid = true
      if (schema.maxLength !== undefined && valueLength >= schema.maxLength) {
        exception.message(`Uint8Array must be less than or equal to ${String(schema.maxLength)}. Actual length: ${value.length}`)
        valid = false
      }
      if (schema.minLength !== undefined && valueLength <= schema.minLength) {
        exception.message(`Uint8Array must be greater than or equal to ${String(schema.minLength)}. Actual length: ${value.length}`)
        valid = false
      }
      return valid
    } else {
      exception.message('Expected value to be a Uint8Array. Received: ' + smart(value))
      return false
    }
  }
})

setDataTypeDefinition<Date, string>({
  type: 'string',
  format: 'date',
  constructors: [Date],
  deserialize: function (value: string): Date {
    if (typeof value !== 'string' || !rx.date.test(value)) {
      throw Error('Expected a date string of the format YYYY-MM-DD')
    } else {
      const d = new Date(value)
      if (isNaN(+d)) {
        throw Error('Value is not a valid date')
      } else {
        return new Date(+d + d.getTimezoneOffset() * 60000)
      }
    }
  },
  random: function (schema: Schema): Date {
    const { min, max } = determineMaxMin(this, schema, 'maximum', 'minimum', 157248000000) // 5 years
    const num = random.number({ max, min })
    return new Date(num)
  },
  serialize: function (value: Date): string {
    if (value instanceof Date && !isNaN(+value)) {
      const d = new Date(+value)
      d.setHours(0, 0, 0, 0)
      d.setMinutes(d.getTimezoneOffset())
      return d.toISOString().substring(0, 10)
    } else {
      throw Error('Cannot serialize an invalid date')
    }
  },
  toNumber: function (value: Date): number {
    return +value
  },
  validate: function (value: Date, exception: Exception, schema: Schema): boolean {
    if (value instanceof Date && !isNaN(+value)) {
      const toNumber = this.toNumber
      if (toNumber !== null) {
        const numberType = getDataTypeDefinition('number')
        if (numberType !== undefined) {
          return numberType.validate(toNumber(value, schema), exception, schema)
        }
      }
      return true
    } else {
      exception.message('Expected a valid date object. Received: ' + smart(value))
      return false
    }
  }
})

extendDataTypeDefinition<Date, string>('string', 'date', {
  format: 'date-time',
  deserialize: function (value: string): Date {
    if (typeof value !== 'string' || !rx.date.test(value)) {
      throw Error('Expected a date string of the format YYYY-MM-DDThh:mm:ss.sssZ')
    } else {
      const d = new Date(value)
      if (isNaN(+d)) {
        throw Error('Value is not a valid date')
      } else {
        return d
      }
    }
  },
  serialize: function (value: Date): string {
    if (value instanceof Date && !isNaN(+value)) {
      return value.toISOString()
    } else {
      throw Error('Cannot serialize an invalid date')
    }
  }
})

function determineMaxMin (context: DataType<any, any>, schema: Schema, maxProperty: 'maximum' | 'maxLength' | 'maxItems' | 'maxProperties', minProperty: 'minimum' | 'minLength' | 'minItems' | 'minProperties', variation: number): { max: number, min: number } {
  const hasMaximum = schema[maxProperty] !== undefined
  const hasMinimum = schema[minProperty] !== undefined
  let max: number
  let min: number

  if (hasMaximum && hasMinimum) {
    max = context.deserialize(schema.maximum, schema)
    min = context.deserialize(schema.minimum, schema)
  } else if (hasMaximum) {
    max = context.deserialize(schema.maximum, schema)
    min = max - variation
  } else if (hasMinimum) {
    min = context.deserialize(schema.minimum, schema)
    max = min + variation
  } else {
    max = Math.ceil(variation * 0.75)
    min = max - variation
  }

  return { max, min }
}
