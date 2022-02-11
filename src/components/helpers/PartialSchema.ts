import { getDataTypeDefinition, getNoopTypeDefinition } from './schema-data-types'
import { OASComponent, ComputeFunction, EnforcerData } from '../index'
import { BuilderData, ComponentSchema, Component, ValidatorData } from './builder-validator-types'
import { determineTypes, MapStore, PopulateOptions, Schema } from './schema-functions'
import { Result } from '../../utils/Result'
import * as SchemaHelper from './schema-functions'
import { Exception } from '../../Exception'
import { copy, isObject, smart } from '../../utils/util'

/**
 * This file is for code reuse between the following OpenAPI specification objects:
 * - Parameter (v2)
 * - Items (v2)
 * - Header (v2)
 * - Schema (v2 and v3)
 */

export interface Definition<Items> {
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Items
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number | string
  minimum?: number | string
  multipleOf?: number
  pattern?: string
  type?: string
  uniqueItems?: boolean
}

export interface EnforcerExtensionSchema {
  populate?: {
    condition?: string // The name of the parameter to check for truthy value before populating the value
    default?: any // When populating, overwrite the schema default with this value. If the type is a string then replacement may occur.
    id?: string // The parameter name to use to find the replacement value. String replacement will not occur.
    replacement?: 'colon' | 'doubleHandlebar' | 'handlebar' | 'none' // Set to none to skip parameter replacement.
    useDefault?: boolean // Set to false to prevent the default value from being used during populate.
  }
}

export abstract class PartialSchema<Items> extends OASComponent {
  enforcer!: EnforcerData<Items, EnforcerExtensionSchema>
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Items
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
  pattern?: RegExp
  type?: string
  uniqueItems?: boolean

  deserialize<T> (value: any): Result<T> {
    return SchemaHelper.deserialize(this, value)
  }

  discriminate<T> (value: any): SchemaHelper.DiscriminateResult<T> {
    return { key: '', name: '', schema: null }
  }

  populate<T> (value?: any, parameters?: Record<string, any>, options: SchemaHelper.PopulateOptions = {}): Result<T> {
    if (parameters === undefined || parameters === null) parameters = {}
    if (!isObject(parameters)) throw Error('Invalid parameters specified. The value must be a plain object. Received: ' + smart(parameters))
    if (!isObject(options)) throw Error('Invalid options specified. The value must be a plain object. Received: ' + smart(options))

    if (!('copy' in options)) options.copy = false
    if (!('depth' in options)) options.depth = 100
    if (!('replacement' in options)) options.replacement = 'handlebar'
    if (!('useDefaults' in options)) options.useDefaults = true
    if ((options.depth as number) < 0) options.depth = 0

    const injectors = SchemaHelper.populateInjectors
    const injector = injectors[options.replacement as 'handlebar']
    if (injector === undefined && options.replacement !== 'none') throw Error('Invalid replacement type specified. Expected one of: ' + Object.keys(injectors).join(', '))

    if (value === null) value = undefined
    if (options.copy === true) value = copy(value, new Map())
    const root = { value }
    const exception = new Exception('Unable to populate value')
    SchemaHelper.populate(this as unknown as SchemaHelper.Schema, parameters, root, 'value', injector, exception, (options.depth as number) - 1, options as Required<PopulateOptions>)

    return new Result(root.value, exception)
  }

  random<T> (value?: any, options: SchemaHelper.RandomOptions = {}): Result<T> {
    if (!('additionalPropertiesPossibility' in options)) options.additionalPropertiesPossibility = 0
    if (!('arrayVariation' in options)) options.arrayVariation = 4
    if (!('copy' in options)) options.copy = false
    if (!('defaultPossibility' in options)) options.defaultPossibility = 0.25
    if (!('definedPropertyPossibility' in options)) options.definedPropertyPossibility = 0.80
    if (!('maxDepth' in options)) options.maxDepth = 10
    if (!('numberVariation' in options)) options.numberVariation = 1000
    if (!('uniqueItemRetry' in options)) options.uniqueItemRetry = 5

    if (options.additionalPropertiesPossibility !== undefined && (options.additionalPropertiesPossibility < 0 || options.additionalPropertiesPossibility > 1)) {
      throw Error('The option "additionalPropertiesPossibility" must be between 0 and 1 inclusive')
    }
    if (options.defaultPossibility !== undefined && (options.defaultPossibility < 0 || options.defaultPossibility > 1)) {
      throw Error('The option "defaultPossibility" must be between 0 and 1 inclusive')
    }
    if (options.definedPropertyPossibility !== undefined && (options.definedPropertyPossibility < 0 || options.definedPropertyPossibility > 1)) {
      throw Error('The option "definedPropertyPossibility" must be between 0 and 1 inclusive')
    }

    const exception = new Exception('Unable to generate random value')
    if (value === null) value = undefined
    const root = { root: options.copy === true ? copy(value) : value }
    SchemaHelper.random(this as unknown as Schema, root, 'root', exception, new Map(), options as Required<SchemaHelper.RandomOptions>, 0)
    return new Result(root.root, exception)
  }

  serialize<T> (value: any): Result<T> {
    return SchemaHelper.serialize(this, value)
  }

  validate (value: any, options?: SchemaHelper.ValidateOptions): Exception {
    const exception = new Exception('One or more exceptions occurred while validating value:', options?.exceptionLevels ?? {})
    if (options === undefined) options = {}
    SchemaHelper.validate(this as unknown as Schema, value, new MapStore(), exception, options)
    return exception
  }
}

export function schemaGenerator<Definition, Built extends Component> (ReferenceComponentClass: any): ComponentSchema<Definition, Built> {
  const notAllowedUnlessArray: ComputeFunction<string | undefined> = function (this: { name: string }, { cache }): string | undefined {
    return cache.isArray === true ? undefined : 'Property "type" must equal "array" to use property "' + this.name + '".'
  }

  const notAllowedUnlessNumeric: ComputeFunction<string | undefined> = function (this: { name: string }, { cache }): string | undefined {
    return cache.isNumeric === true ? undefined : 'Property "type" must be numeric to use property "' + this.name + '".'
  }

  const notAllowedUnlessString: ComputeFunction<string | undefined> = function (this: { name: string }, { cache }): string | undefined {
    return cache.isString === true ? undefined : 'Property "type" must equal "string" to use property "' + this.name + '".'
  }

  return new ComponentSchema<Definition, Built>({
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'type',
        schema: {
          // @ts-expect-error - not sure why this is producing an error
          type: 'string',
          // @ts-expect-error - not sure why this is producing an error
          enum: ['array', 'boolean', 'integer', 'number', 'string'],
          default ({ definition }) {
            if (!('allOf' in definition || 'anyOf' in definition || 'not' in definition || 'oneOf' in definition)) {
              const { type: defaultType } = determineTypes(definition, new Map()).get(false)
              return defaultType !== '' ? defaultType : undefined
            }
          }
        },
        after (cache, type) {
          cache.type = type
          cache.isArray = type === 'array'
          cache.isString = type === 'string'
          cache.isNumeric = type === 'number' || type === 'integer'
        }
      },
      {
        name: 'format',
        notAllowed ({ cache }) {
          const type = cache.type
          if (type === undefined) return 'Format cannot be specified unless a type is specified.'
          return type === 'array' || type === 'object' ? 'Format cannot be specified for type ' + (type as string) + '.' : undefined
        },
        schema: {
          type: 'string'
        },
        after (cache, format) {
          const type = cache.type
          const dataType = type !== undefined
            ? getDataTypeDefinition(type, format) ?? getNoopTypeDefinition()
            : { toNumber: null }
          cache.format = format
          cache.isNumeric = dataType.toNumber !== null
        }
      },

      {
        name: 'enum',
        schema: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'any'
          }
        }
      },
      {
        name: 'exclusiveMaximum',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'exclusiveMinimum',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'items',
        notAllowed: notAllowedUnlessArray,
        required ({ cache }) {
          return cache.isArray as boolean
        },
        schema: {
          type: 'component',
          allowsRef: true,
          component: ReferenceComponentClass
        }
      },
      {
        name: 'maximum',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'any' // The type is "any" because a string can be numeric given the proper format (ex: date, date-time)
        }
      },
      {
        name: 'maxItems',
        notAllowed: notAllowedUnlessArray,
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'maxLength',
        notAllowed: notAllowedUnlessString,
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'minimum',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'any' // The type is "any" because a string can be numeric given the proper format (ex: date, date-time)
        }
      },
      {
        name: 'minItems',
        notAllowed: notAllowedUnlessArray,
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'minLength',
        notAllowed: notAllowedUnlessString,
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'multipleOf',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'any' // The type is "any" because a string can be numeric for specific type format combinations
        }
      },
      {
        name: 'pattern',
        notAllowed: notAllowedUnlessString,
        schema: {
          type: 'string'
        }
      },
      {
        name: 'uniqueItems',
        notAllowed: notAllowedUnlessArray,
        schema: {
          type: 'boolean'
        }
      },
      {
        name: 'default',
        schema: {
          type: 'any'
        }
      }
    ],
    builder: {
      after (data: BuilderData) {
        data.root.lastly.push(() => {
          const { built } = data.context

          if (built.default !== undefined) built.default = deserialize(built, built.default)

          if (built.enum !== undefined) {
            built.enum = built.enum.map((item: any) => deserialize(built, item))
          }

          if (built.maximum !== undefined) built.maximum = deserialize(built, built.maximum)
          if (built.minimum !== undefined) built.minimum = deserialize(built, built.minimum)
          if (built.multipleOf !== undefined) built.multipleOf = deserialize(built, built.multipleOf)

          if (built.pattern !== undefined) built.pattern = new RegExp(built.pattern)
        })
      }
    },
    validator: {
      after (data: ValidatorData) {
        const { root, context } = data
        const { built, exception } = context
        const { cache, definition } = data.component

        if (built.type === 'array') {
          validateMaxMin(data, 'minItems', 'maxItems')
        } else if (cache.isNumeric as boolean) {
          root.lastly.push(() => {
            if (!exception.hasError) {
              const schema = new ReferenceComponentClass(definition)

              // validate that maximum and minimum don't conflict
              if (schema.minimum !== undefined && schema.maximum !== undefined) {
                const exclusive = schema.exclusiveMinimum === true || schema.exclusiveMaximum === true
                if (schema.minimum > schema.maximum || (exclusive && schema.minimum === schema.maximum)) {
                  exception.add.invalidMaxMin(data,
                    [
                      { node: definition, key: 'minimum', type: 'value' },
                      { node: definition, key: 'maximum', type: 'value' }
                    ],
                    definition.minimum, definition.maximum, 'minimum', 'maximum', exclusive)
                }
              }

              // validate multiple of is greater than zero
              if (schema.multipleOf === 0) {
                exception.at('multipleOf').add.exceedsNumberBounds(data, { key: 'multipleOf', type: 'value' }, 'minimum', false, 0, definition.multipleOf)
              }

              // warn if minimum or maximum are not multiples of multipleOf
              if (schema.multipleOf !== undefined) {
                if (schema.minimum !== undefined && schema.minimum % schema.multipleOf !== 0) {
                  exception.at('minimum').add.constraintIsNotAMultiple(data, { key: 'minimum', type: 'value' }, 'minimum', definition.minimum, definition.multipleOf)
                }
                if (schema.maximum !== undefined && schema.maximum % schema.multipleOf !== 0) {
                  exception.at('maximum').add.constraintIsNotAMultiple(data, { key: 'maximum', type: 'value' }, 'maximum', definition.maximum, definition.multipleOf)
                }
              }
            }
          })
        } else if (built.type === 'string') {
          validateMaxMin(data, 'minLength', 'maxLength')
        }

        if ('default' in built || 'enum' in built) {
          root.lastly.push((data: ValidatorData) => {
            if (!exception.hasError) {
              const schema = new ReferenceComponentClass(built, root.version) as Schema

              if ('default' in built) {
                const subException = schema.validate(built.default)
                if (subException.hasError) {
                  exception.at('default').add.defaultValueDoesNotMatchSchema(data, { node: definition, key: 'default', type: 'value' }, built.default, subException)
                }
              }

              if ('enum' in built) {
                built.enum.forEach((item: any, i: number) => {
                  const subException = schema.validate(item)
                  if (subException.hasError) {
                    exception.at('enum').at(i).add.enumValueDoesNotMatchSchema(data, { node: definition.enum, key: i, type: 'value' }, item, subException)
                  }
                })
              }
            }
          })
        }

        if (built.format !== undefined) {
          const type = built.type
          const format = built.format
          const dataType = getDataTypeDefinition(type, format)
          if (dataType === undefined || dataType.format !== format) {
            exception.at('format').add.unknownTypeFormat(data, { node: definition, key: 'format', type: 'value' }, type, format)
          }
        }
      }
    }
  })
}

export function validateMaxMin (data: ValidatorData, minKey: string, maxKey: string, exclusive = false): void {
  const { definition, exception } = data.context
  if (minKey in definition && maxKey in definition) {
    const min = definition[minKey]
    const max = definition[maxKey]
    if (min > max || (exclusive && min === max)) {
      exception.add.invalidMaxMin(data,
        [
          { node: definition, key: minKey, type: 'value' },
          { node: definition, key: maxKey, type: 'value' }
        ],
        definition[minKey], definition[maxKey], minKey, maxKey, exclusive)
    }
  }
}

function deserialize (built: PartialSchema<any>, input: any): any {
  const [value, error] = built.deserialize(input)
  if (error !== undefined) throw Error(error.toString())
  return value
}
