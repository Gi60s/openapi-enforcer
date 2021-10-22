import * as DataType from './DataTypes'
import { Data, ExtendedComponent, OASComponent, ComponentSchema } from '../index'
import * as E from '../../Exception/methods'

/**
 * This file is for code reuse between the following OpenAPI specification objects:
 * - Parameter (v2)
 * - Item (v2)
 * - Header (v2)
 * - Schema (v2 and v3)
 */

const dataTypesMap: Map<any, DataType.DataTypeStore> = new Map()

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
  readonly maximum?: number | string
  readonly minimum?: number | string
  readonly multipleOf?: number | string
  readonly pattern?: string
  readonly type?: string
  readonly uniqueItems?: boolean
}

export function defineDataType (referenceComponentClass: any, type: DataType.Type, format: string, definition: DataType.Definition): void {
  const dataTypes = initializeDataTypes(referenceComponentClass)
  dataTypes.define(type, format, definition)
}

export function schemaGenerator<Definition> (referenceComponentClass: any, data: Data): ComponentSchema<Definition> {
  const { context, root } = data
  const dataTypes = initializeDataTypes(referenceComponentClass)
  const { reference } = data.component
  const { definition, exception } = context
  const type: string = definition.type
  const format: string | undefined = definition.format

  const isArray = type === 'array'
  const isNumeric = dataTypes.getDefinition(type as DataType.Type, format)?.isNumeric ?? false
  const isString = type === 'string'

  return {
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'type',
        schema: {
          type: 'string',
          enum: ['array', 'boolean', 'integer', 'number', 'string']
        }
      },
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
          component: referenceComponentClass
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
        const { built } = context
        if (built.type === 'array') {
          validateMaxMin(data, 'minItems', 'maxItems')
        } else if (isNumeric) {
          validateMaxMin(data, 'minimum', 'maximum')
        } else if (built.type === 'string') {
          validateMaxMin(data, 'minLength', 'maxLength')
        }

        // validate default value against the schema
        if ('default' in built) {
          root.lastly.push(() => {
            // TODO: validate default
            const defaultValueDoesNotMatchSchema = E.defaultValueDoesNotMatchSchema(reference, built.default)
          })
        }

        if ('enum' in built) {
          // TODO: validate enum
        }

        if (built.format !== undefined) {
          const format = built.format
          const def = dataTypes.getDefinition(type as DataType.Type, format)
          if (def === undefined) {
            const unknownTypeFormat = E.unknownTypeFormat(type, format, {
              definition: format,
              locations: [{ node: definition, key: 'format', type: 'value' }]
            })
            exception.at('format').message(unknownTypeFormat)
          }
        }

        if (isNumeric) {
          // TODO: make sure max >= min and that max is integer if type is integer
          // TODO: make multipleOf is valid
        } else if (isArray) {
          // TODO: make sure maxItems >= minItems
        } else if (type === 'string') {
          // TODO: make sure maxLength >= minLength
        }
      }
    }
  }
}

function initializeDataTypes (component: ExtendedComponent): DataType.DataTypeStore {
  if (!dataTypesMap.has(component)) dataTypesMap.set(component, new DataType.DataTypeStore(DataType.base))
  const store = dataTypesMap.get(component) as DataType.DataTypeStore

  // if the common data type gets new data then clear the schemaGenerator cache
  // DataType.on('common-define', () => {
  //   clearCache(component)
  // })

  return store
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
