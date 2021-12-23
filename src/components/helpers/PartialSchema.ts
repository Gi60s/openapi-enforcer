import { getDataTypeDefinition, getNoopTypeDefinition } from './schema-data-types'
import { OASComponent, SchemaProperty, EnforcerData } from '../index'
import { BuilderData, ComponentSchema, Data, ValidatorData } from './builder-validator-types'
import * as E from '../../DefinitionException/methods'
import { determineTypes, MapStore, PopulateOptions, Schema } from './schema-functions'
import { Result } from '../../utils/Result'
import * as SchemaHelper from './schema-functions'
import { Exception } from '../../utils/Exception'
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

  validate (value: any, options?: SchemaHelper.ValidateOptions): Exception | undefined {
    const exception = new Exception('One or more exceptions occurred while validating value:')
    if (options === undefined) options = {}
    const { result } = SchemaHelper.validate(this as unknown as Schema, value, new MapStore(), exception, options)
    return result === true ? undefined : exception
  }
}

export function schemaGenerator<Definition> (ReferenceComponentClass: any, data: Data): ComponentSchema<Definition> {
  const { context, root } = data
  const { definition } = context
  const type: string = definition.type
  const format: string | undefined = definition.format
  const def = definition
  const dataType = getDataTypeDefinition(type, format) ?? getNoopTypeDefinition()

  const isArray = type === 'array'
  const isNumeric = dataType.toNumber !== null
  const isString = type === 'string'

  const typeProperty: SchemaProperty = {
    name: 'type',
    schema: {
      type: 'string',
      enum: ['array', 'boolean', 'integer', 'number', 'string']
    }
  }

  // attempt to determine default type based on other properties in the definition
  // if schema has allOf, anyOf, not, or oneOf then there is no default type
  if (!('allOf' in def || 'anyOf' in def || 'not' in def || 'oneOf' in def)) {
    const { type: defaultType } = determineTypes(def, new Map()).get(false)
    if (defaultType !== '') typeProperty.schema.default = defaultType
  }

  return {
    allowsSchemaExtensions: true,
    properties: [
      typeProperty,
      {
        name: 'format',
        notAllowed: type === 'array' || type === 'object' ? 'Format cannot be specified for type ' + type + '.' : undefined,
        schema: {
          type: 'string'
        }
      },
      {
        name: 'enum',
        schema: {
          type: 'array',
          items: {
            type: 'any'
          }
        }
      },
      {
        name: 'exclusiveMaximum',
        notAllowed: isNumeric ? undefined : 'ValidatorData type must be numeric.',
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'exclusiveMinimum',
        notAllowed: isNumeric ? undefined : 'ValidatorData type must be numeric.',
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'items',
        notAllowed: isArray ? undefined : 'ValidatorData type must be an array.',
        required: isArray,
        schema: {
          type: 'component',
          allowsRef: true,
          component: ReferenceComponentClass
        }
      },
      {
        name: 'maximum',
        notAllowed: isNumeric ? undefined : 'ValidatorData type must be numeric.',
        schema: {
          type: 'any' // The type is "any" because a string can be numeric given the proper format (ex: date, date-time)
        }
      },
      {
        name: 'maxItems',
        notAllowed: isArray ? undefined : 'ValidatorData type must be an array.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'maxLength',
        notAllowed: isString ? undefined : 'ValidatorData type must be a string.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'minimum',
        notAllowed: isNumeric ? undefined : 'ValidatorData type must be numeric.',
        schema: {
          type: 'any' // The type is "any" because a string can be numeric given the proper format (ex: date, date-time)
        }
      },
      {
        name: 'minItems',
        notAllowed: isArray ? undefined : 'ValidatorData type must be an array.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'minLength',
        notAllowed: isString ? undefined : 'ValidatorData type must be a string.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'multipleOf',
        notAllowed: isNumeric ? undefined : 'ValidatorData type must be numeric.',
        schema: {
          type: 'any' // The type is "any" because a string can be numeric for specific type format combinations
        }
      },
      {
        name: 'uniqueItems',
        notAllowed: isArray ? undefined : 'ValidatorData type must be an array.',
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
        root.lastly.push(() => {
          const { built } = data.context

          if (built.default !== undefined) {
            const [value, error] = built.deserialize(built.default)
            if (error !== undefined) throw Error(error.toString())
            built.default = value
          }

          if (built.enum !== undefined) {
            built.enum = built.enum.map((item: any) => {
              const [value, error] = built.deserialize(item)
              if (error !== undefined) throw Error(error.toString())
              return value
            })
          }
        })
      }
    },
    validator: {
      after (data: ValidatorData) {
        const { root, context } = data
        const { built, exception } = context
        if (built.type === 'array') {
          validateMaxMin(data, 'minItems', 'maxItems')
        } else if (isNumeric) {
          validateMaxMin(data, 'minimum', 'maximum')
        } else if (built.type === 'string') {
          validateMaxMin(data, 'minLength', 'maxLength')
        }

        if ('default' in built || 'enum' in built) {
          root.lastly.push((data: ValidatorData) => {
            const schema = new ReferenceComponentClass(built, root.version)

            if ('default' in built) {
              const error = schema.validate(built.default)
              if (error !== undefined) {
                const defaultValueDoesNotMatchSchema = E.defaultValueDoesNotMatchSchema(built.default, {
                  definition,
                  locations: [{ node: definition, key: 'default', type: 'value' }]
                })
                exception.at('default').message(defaultValueDoesNotMatchSchema)
              }
            }

            if ('enum' in built) {
              built.enum.forEach((item: any, i: number) => {
                const error = schema.validate(item)
                if (error !== undefined) {
                  const enumNotMet = E.enumNotMet(built.enum, item, {
                    definition,
                    locations: [{ node: definition, key: 'default', type: 'value' }]
                  })
                  exception.at('enum').at(i).message(enumNotMet)
                }
              })
            }
          })
        }

        if (built.format !== undefined) {
          const format = built.format
          const dataType = getDataTypeDefinition(type, format)
          if (dataType === undefined || dataType.format !== format) {
            const unknownTypeFormat = E.unknownTypeFormat(type, format, {
              definition: format,
              locations: [{ node: definition, key: 'format', type: 'value' }]
            })
            exception.at('format').message(unknownTypeFormat)
          }
        }
      }
    }
  }
}

export function validateMaxMin (data: ValidatorData, minKey: string, maxKey: string): void {
  const { built, definition, exception } = data.context
  if (minKey in built && maxKey in built && built[minKey] > built[maxKey]) {
    const invalidMaxMin = E.invalidMaxMin(built[minKey], built[maxKey], minKey, maxKey, {
      definition,
      locations: [
        { node: definition, key: minKey, type: 'value' },
        { node: definition, key: maxKey, type: 'value' }
      ]
    })
    exception.message(invalidMaxMin)
  }
}
