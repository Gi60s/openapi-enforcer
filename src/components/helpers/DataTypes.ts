import { Exception } from '../../Exception'
import * as E from '../../Exception/methods'
import * as random from './Randomizer'
import { isValidDateString } from '../../util'
import { Definition as Schema } from '../Schema'
import RandExp from 'randexp'
import rx from '../../rx'

const dataTypeWarnings: { [k: string]: boolean } = {}
// const handlers: { 'common-define': Function[] } = { 'common-define': [] }

export interface DefinitionInput {
  constructors?: Function[]
  deserialize?: (data: { exception: Exception, schema: Schema, value: any }) => any
  isNumeric?: boolean
  random?: (data: { exception: Exception, options: RandomOptions, schema: Schema }) => any
  serialize?: (data: { exception: Exception, schema: Schema, value: any }) => any
  validate?: (data: { exception: Exception, schema: Schema, value: any }) => void
}

export interface Definition extends DefinitionInput {
  type: Type
  format?: string
}

export interface RandomOptions {
  additionalPropertiesPossibility?: number
  arrayVariation?: number
  defaultPossibility?: number
  definedPropertyPossibility?: number
  maxDepth?: number
  numberVariation?: number
  uniqueItemRetry?: number
}

export type Type = 'boolean' | 'integer' | 'number' | 'string'

export class DataTypeStore {
  readonly constructors: Set<Function>
  readonly store: Record<Type, { [format: string]: Definition }>
  readonly parent: DataTypeStore | null

  constructor (parent: DataTypeStore | null) {
    this.constructors = new Set()
    this.parent = parent
    this.store = {
      boolean: {},
      integer: {},
      number: {},
      string: {}
    }
  }

  define (type: Type, format: string, definition: DefinitionInput): DataTypeStore {
    const exists = this.getDefinition(type, format)
    if (exists !== undefined) throw Error('Defined type already exists: ' + type + (format !== undefined && format.length > 0 ? ' ' + format : ''))

    // add defaults
    const copy: Definition = Object.assign(definition)
    if (copy.format === undefined) copy.format = ''
    if (copy.constructors === undefined) copy.constructors = []
    if (copy.deserialize === undefined) copy.deserialize = noop
    if (copy.isNumeric === undefined) copy.isNumeric = false
    // @ts-expect-error
    if (copy.random === undefined) copy.random = noop
    if (copy.serialize === undefined) copy.serialize = noop
    if (copy.validate === undefined) copy.validate = noop

    if (definition.deserialize !== null || definition.serialize !== null || definition.validate !== null) {
      if (typeof definition !== 'object' ||
        typeof definition.deserialize !== 'function' ||
        typeof definition.serialize !== 'function' ||
        typeof definition.validate !== 'function' ||
        ('random' in definition && typeof definition.random !== 'function')) throw Error('Invalid data type definition. Must be an object that defines handlers for "deserialize", "serialize", and "validate" with optional "random" handler.')

      if ('constructors' in definition) {
        if (!Array.isArray(definition.constructors)) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          throw Error('Invalid data type constructors value. Expected an array of functions. Received: ' + definition.constructors)
        }
        definition.constructors.forEach((fn: Function) => {
          if (typeof fn !== 'function') {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            throw Error('Invalid constructor specified. Expected a function, received: ' + fn)
          }
          this.constructors.add(fn)
        })
      } else {
        const key = type + '-' + (format !== undefined && format.length > 0 ? ' ' + format : '')
        if (!dataTypeWarnings[key]) {
          dataTypeWarnings[key] = true
          console.warn('WARNING: Data type definition missing recommended "constructors" property for type "' + type + '"' +
            (format !== undefined && format.length > 0 ? ' and format "' + format + '"' : '') + '.')
        }
      }
    }

    // store the definition
    this.store[type][copy.format] = copy

    // run baseDataStore define handlers
    // if (this === baseDataStore) {
    //   handlers['common-define'].forEach(fn => {
    //     fn(definition)
    //   })
    // }

    return this
  }

  defineMultiple (target: { [type: string]: string[] }, definition: DefinitionInput): DataTypeStore {
    Object.keys(target).forEach((type: string) => {
      const formats: string[] = (target as any)[type]
      formats.forEach((format: string) => {
        this.define(type as Type, format, definition)
      })
    })
    return this
  }

  getDefinition (type: Type, format?: string): Definition | undefined {
    if (format === undefined) format = ''
    const def = this.store[type][format]
    if (def !== undefined) {
      return def
    } else if (this.parent !== null) {
      return this.parent.getDefinition(type, format)
    }
  }

  getFormats (type: Type): string[] {
    const formats: string[] = this.store[type] !== undefined ? Object.keys(this.store[type]) : []
    if (this.parent !== null) formats.push(...this.parent.getFormats(type))
    return formats.filter(f => f !== '')
  }
}

export const base = new DataTypeStore(null)

// export function on (type: 'common-define', handler: Function): void {
//   handlers[type].push(handler)
// }

export function typeIsValid (type: Type): boolean {
  switch (type) {
    case 'boolean':
    case 'integer':
    case 'number':
    case 'string':
      return true
    default:
      return false
  }
}

function noop<T> ({ value }: { value: T }): T {
  return value
}

base.define('boolean', '', {
  random () {
    return random.oneOf([true, false])
  },
  validate ({ exception, value }) {
    if (value !== true && value !== false) {
      exception.message(E.invalidType('', 'a boolean', value))
    }
  }
})

base.defineMultiple({ integer: ['', 'int32', 'int64'], number: ['', 'float', 'double'] }, {
  isNumeric: true,
  random ({ options, schema }) {
    const { min, max } = determineMaxMin(schema, 'minimum', 'maximum', options.numberVariation ?? 1000)
    return random.number({
      decimalPlaces: schema.type === 'integer' ? 0 : random.number({ min: 1, max: 4 }),
      exclusiveMax: 'exclusiveMaximum' in schema ? schema.exclusiveMaximum : false,
      exclusiveMin: 'exclusiveMinimum' in schema ? schema.exclusiveMinimum : false,
      max,
      min,
      multipleOf: schema.multipleOf === undefined ? 0 : schema.multipleOf
    })
  },
  validate ({ exception, schema, value }) {
    if (isNaN(value) || Math.round(value) !== value || typeof value !== 'number') {
      exception.message(E.invalidType('', 'an integer', value))
    } else {
      validateMaxMin(exception, schema, 'integer', 'maximum', 'minimum', true, value, schema.maximum as number, schema.minimum as number)
      if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0) {
        exception.message(E.notMultipleOf('', schema.multipleOf, value))
      }
    }
  }
})

base.defineMultiple({ string: ['', 'password'] }, {
  random ({ exception, options, schema }) {
    if (schema.format === 'password') {
      exception.message(E.randomPasswordWarning())
    }
    if (schema.pattern !== undefined) {
      return new RandExp(schema.pattern).gen()
    } else {

    }
    const { min, max } = determineMaxMin(schema, 'minLength', 'maxLength', options.numberVariation ?? 20)
    return random.text({
      maxLength: max,
      minLength: min
    })
  }
})

base.define('string', 'binary', {
  constructors: [Buffer],
  random ({ options, schema }) {
    const { min, max } = determineMaxMin(schema, 'minLength', 'maxLength', options.numberVariation ?? 25)
    return random.buffer({
      maxLength: max,
      minLength: min,
      multiplier: 8
    })
  }
})

base.define('string', 'byte', {
  constructors: [Buffer],
  random ({ options, schema }) {
    const { min, max } = determineMaxMin(schema, 'minLength', 'maxLength', options.numberVariation ?? 25)
    return random.buffer({
      maxLength: max,
      minLength: min,
      multiplier: 4
    })
  }
})

base.define('string', 'date', {
  constructors: [Date],
  deserialize ({ exception, value }) {
    if (value instanceof Date) {
      return value
    } else if (typeof value !== 'string' || !rx.date.test(value)) {
      exception.message(E.invalidValueFormat('', 'a date string', 'YYYY-MM-DD', value))
      return null
    } else if (isValidDateString('date', value)) {
      return new Date(value)
    } else {
      exception.message(E.invalidValue('', 'a valid date', value))
      return null
    }
  },
  isNumeric: true,
  random: randomDate,
  serialize () {
    // TODO: write the code for this function
  },
  validate () {
    // TODO: write the code for this function
  }
})

base.define('string', 'date-time', {
  constructors: [Date],
  deserialize ({ exception, value }) {
    if (value instanceof Date) {
      return value
    } else if (typeof value !== 'string' || !rx.dateTime.test(value)) {
      exception.message(E.invalidValueFormat('', 'a date string', 'YYYY-MM-DDThh:mm:ssZ', value))
      return null
    } else if (isValidDateString('date-time', value)) {
      return new Date(value)
    } else {
      exception.message(E.invalidValue('', 'a valid date', value))
      return null
    }
  },
  isNumeric: true,
  random: randomDate,
  serialize () {
    // TODO: this function body
  },
  validate () {
    // TODO: validate
  }
})

function determineMaxMin (schema: any, minProperty: string, maxProperty: string, numberVariation: number): { min: number, max: number } {
  return {
    max: maxProperty in schema
      ? schema[maxProperty]
      : minProperty in schema ? schema[minProperty] as number + numberVariation : Math.ceil(numberVariation * 0.75),
    min: minProperty in schema
      ? schema[minProperty]
      : maxProperty in schema ? schema[maxProperty] - numberVariation : -1 * Math.floor(numberVariation * 0.25)
  }
}

function randomDate ({ options, schema }: { options: RandomOptions, schema: Schema }): Date {
  const config: { exclusiveMaximum?: boolean, exclusiveMinimum?: boolean, max?: number, min?: number } = {}
  if (schema.maximum !== undefined) config.max = +schema.maximum
  if (schema.minimum !== undefined) config.min = +schema.minimum
  const { min, max } = determineMaxMin(config, 'min', 'max', options.numberVariation ?? 432000000)
  const value = random.number({
    exclusiveMax: 'exclusiveMaximum' in schema ? schema.exclusiveMaximum : false,
    exclusiveMin: 'exclusiveMinimum' in schema ? schema.exclusiveMinimum : false,
    max,
    min
  })
  return new Date(value)
}

function validateMaxMin (exception: Exception, schema: { [key: string]: any, exclusiveMaximum?: boolean, exclusiveMinimum?: boolean }, type: string, maxProperty: string, minProperty: string, exclusives: boolean, value: any, maximum: number, minimum: number): void {
  if (maxProperty in schema) {
    if (exclusives && schema.exclusiveMaximum === true && value >= maximum) {
      exception.message(E.exceedsNumberBounds('', 'maximum', true,
        schema.serialize(schema[maxProperty]).value,
        schema.serialize(value).value))
    } else if (value > maximum) {
      exception.message(E.exceedsNumberBounds('', 'maximum', false,
        schema.serialize(schema[maxProperty]).value,
        schema.serialize(value).value))
    }
  }

  if (minProperty in schema) {
    if (exclusives && schema.exclusiveMinimum === true && value <= minimum) {
      exception.message(E.exceedsNumberBounds('', 'minimum', true,
        schema.serialize(schema[minProperty]).value,
        schema.serialize(value).value))
    } else if (value < minimum) {
      exception.message(E.exceedsNumberBounds('', 'minimum', false,
        schema.serialize(schema[minProperty]).value,
        schema.serialize(value).value))
    }
  }
}
