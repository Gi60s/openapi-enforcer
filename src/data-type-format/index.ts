import { Controller as IController, DefinitionPlus, Factory as ControllerFactory, RandomOptions } from './controller'
import * as SchemaInterface from '../SchemaInterfaces'
import * as random from '../randomizer'
import rx from '../rx'
import { smart, isValidDateString, validateMaxMin } from '../util'
import * as Schema from '../components/Schema'

function noop<T> ({ value }: { value: T }): T {
  return value
}

export type Controller = IController

export type Definition<T> = DefinitionPlus<T>

export const commonDataTypes = Factory()

export function Factory (): Controller {
  const controller = ControllerFactory()
  controller.inheritsFrom(commonDataTypes)
  return controller
}

commonDataTypes.define<SchemaInterface.ObjectBoolean>('boolean', '', {
  constructors: [],
  deserialize: noop,
  isNumeric: false,
  random () {
    return random.oneOf([true, false])
  },
  serialize: noop,
  validate ({ error, value }) {
    if (value !== true && value !== false) {
      error.message('Expected a boolean. Received: ' + smart(value))
    }
  }
})

commonDataTypes.define<SchemaInterface.ObjectNumeric>('integer', '', {
  constructors: [],
  deserialize: noop,
  isNumeric: true,
  random ({ options, schema }) {
    const { min, max } = determineMaxMin(schema, 'minimum', 'maximum', options.numberVariation)
    return random.number({
      decimalPlaces: schema.type === 'integer' ? 0 : random.number({ min: 1, max: 4 }),
      exclusiveMax: 'exclusiveMaximum' in schema ? schema.exclusiveMaximum : false,
      exclusiveMin: 'exclusiveMinimum' in schema ? schema.exclusiveMinimum : false,
      max,
      min,
      multipleOf: 'multipleOf' in schema ? schema.multipleOf : 0
    })
  },
  serialize: noop,
  validate ({ error, schema, value }) {
    if (isNaN(value) || Math.round(value) !== value || typeof value !== 'number') {
      error.message('Expected an integer. Received: ' + smart(value))
    } else {
      validateMaxMin(error, schema as Schema.Object, 'integer', 'maximum', 'minimum', true, value, schema.maximum, schema.minimum)
      if ('multipleOf' in schema && value % schema.multipleOf !== 0) {
        error.message('Expected a multiple of ' + String(schema.multipleOf) + '. Received: ' + smart(value))
      }
    }
  }
})
  .copy('integer', '', 'integer', 'int32')
  .copy('integer', '', 'integer', 'int64')
  .copy('integer', '', 'number', '')
  .copy('number', '', 'number', 'float')
  .copy('number', '', 'number', 'double')
// TODO: validation logic slightly different between numbers and integers. Needs to figure out a better copy idea. Maybe copy w/ overwrite?

commonDataTypes.define<Schema.Object>('string', '', {
  constructors: [],
  deserialize: noop,
  isNumeric: false,
  random ({ options, schema, warning }) {
    if (schema.pattern !== undefined) {
      warning.message('Unable to generate random text that matches a pattern.')
      return undefined
    }
    if (schema.format === 'password') warning.message('Do not use this random value as a password. It is not secure random.')
    const { min, max } = determineMaxMin(schema, 'minLength', 'maxLength', options.numberVariation)
    return random.text({
      maxLength: max,
      minLength: min
    })
  },
  serialize: noop,
  validate () {
    // TODO: validate
  }
})
  .copy('string', '', 'string', 'password')

commonDataTypes.define<SchemaInterface.ObjectString>('string', 'binary', {
  constructors: [Buffer],
  deserialize: noop,
  isNumeric: false,
  random ({ options, schema, warning }) {
    const { min, max } = determineMaxMin(schema, 'minLength', 'maxLength', options.numberVariation)
    return random.buffer({
      maxLength: max,
      minLength: min,
      multiplier: 8
    })
  },
  serialize: noop,
  validate () {
    // TODO: validate
  }
})

commonDataTypes.define<SchemaInterface.ObjectString>('string', 'byte', {
  constructors: [Buffer],
  deserialize: noop,
  isNumeric: false,
  random ({ options, schema, warning }) {
    const { min, max } = determineMaxMin(schema, 'minLength', 'maxLength', options.numberVariation)
    return random.buffer({
      maxLength: max,
      minLength: min,
      multiplier: 4
    })
  },
  serialize: noop,
  validate () {
    // TODO: validate
  }
})

commonDataTypes.define<SchemaInterface.ObjectNumeric>('string', 'date', {
  constructors: [Date],
  deserialize ({ error, value }) {
    if (value instanceof Date) {
      return value
    } else if (typeof value !== 'string' || !rx.date.test(value)) {
      error.message('Expected a date string of the format YYYY-MM-DD')
      return null
    } else if (isValidDateString('date', value)) {
      return new Date(value)
    } else {
      error.message('Value is not a valid date')
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

commonDataTypes.define<SchemaInterface.ObjectNumeric>('string', 'date-time', {
  constructors: [Date],
  deserialize ({ error, value }) {
    if (value instanceof Date) {
      return value
    } else if (typeof value !== 'string' || !rx.date.test(value)) {
      error.message('Expected a date string of the format YYYY-MM-DD')
      return null
    } else if (isValidDateString('date-time', value)) {
      return new Date(value)
    } else {
      error.message('Value is not a valid date')
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

function randomDate ({ options, schema }: { options: RandomOptions, schema: SchemaInterface.ObjectNumeric }): Date {
  const config: { exclusiveMaximum?: boolean, exclusiveMinimum?: boolean, max?: number, min?: number } = {}
  if ('maximum' in schema) config.max = +schema.maximum
  if ('minimum' in schema) config.min = +schema.minimum
  const { min, max } = determineMaxMin(config, 'min', 'max', options.numberVariation)
  const value = random.number({
    exclusiveMax: 'exclusiveMaximum' in schema ? schema.exclusiveMaximum : false,
    exclusiveMin: 'exclusiveMinimum' in schema ? schema.exclusiveMinimum : false,
    max,
    min
  })
  return new Date(value)
}
