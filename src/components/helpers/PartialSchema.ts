import { getDataTypeDefinition, getNoopTypeDefinition } from './DataTypes'
import { Data, OASComponent, ComponentSchema, SchemaProperty } from '../index'
import * as E from '../../DefinitionException/methods'
import { determineTypes } from './schema-functions'

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

export abstract class PartialSchema<Items> extends OASComponent {
  readonly default?: any
  readonly enum?: any[]
  readonly exclusiveMaximum?: boolean
  readonly exclusiveMinimum?: boolean
  readonly format?: string
  readonly items?: Items
  readonly maxItems?: number
  readonly minItems?: number
  readonly maxLength?: number
  readonly minLength?: number
  readonly maximum?: number
  readonly minimum?: number
  readonly multipleOf?: number
  readonly pattern?: RegExp
  readonly type?: string
  readonly uniqueItems?: boolean
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
        notAllowed: isNumeric ? undefined : 'Data type must be numeric.',
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'exclusiveMinimum',
        notAllowed: isNumeric ? undefined : 'Data type must be numeric.',
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'items',
        notAllowed: isArray ? undefined : 'Data type must be an array.',
        required: isArray,
        schema: {
          type: 'component',
          allowsRef: true,
          component: ReferenceComponentClass
        }
      },
      {
        name: 'maximum',
        notAllowed: isNumeric ? undefined : 'Data type must be numeric.',
        schema: {
          type: 'any' // The type is "any" because a string can be numeric given the proper format (ex: date, date-time)
        }
      },
      {
        name: 'maxItems',
        notAllowed: isArray ? undefined : 'Data type must be an array.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'maxLength',
        notAllowed: isString ? undefined : 'Data type must be a string.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'minimum',
        notAllowed: isNumeric ? undefined : 'Data type must be numeric.',
        schema: {
          type: 'any' // The type is "any" because a string can be numeric given the proper format (ex: date, date-time)
        }
      },
      {
        name: 'minItems',
        notAllowed: isArray ? undefined : 'Data type must be an array.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'minLength',
        notAllowed: isString ? undefined : 'Data type must be a string.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'multipleOf',
        notAllowed: isNumeric ? undefined : 'Data type must be numeric.',
        schema: {
          type: 'any' // The type is "any" because a string can be numeric for specific type format combinations
        }
      },
      {
        name: 'uniqueItems',
        notAllowed: isArray ? undefined : 'Data type must be an array.',
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
    validator: {
      after () {
        const { built, exception } = context
        if (built.type === 'array') {
          validateMaxMin(data, 'minItems', 'maxItems')
        } else if (isNumeric) {
          validateMaxMin(data, 'minimum', 'maximum')
        } else if (built.type === 'string') {
          validateMaxMin(data, 'minLength', 'maxLength')
        }

        if ('default' in built || 'enum' in built) {
          root.lastly.push(() => {
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

export function validateMaxMin (data: Data, minKey: string, maxKey: string): void {
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
