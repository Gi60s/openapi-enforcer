import * as DataType from './DataTypes'
import { clearCache, Data, SchemaObject, ExtendedComponent, OASComponent } from '../index'
import { addExceptionLocation, adjustExceptionLevel, yes } from '../../util'
import * as E from '../../Exception/methods'
import { lookupLocation } from '../../loader'

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
  clearCache(referenceComponentClass)
}

export function schemaGenerator (referenceComponentClass: any): SchemaObject {
  const dataTypes = initializeDataTypes(referenceComponentClass)
  let type: string

  function getType (data: Data): string {
    if (type === undefined) type = data.component.data.definition.type
    return type
  }

  function isNumeric (data: Data): boolean {
    const type = getType(data)
    const def = dataTypes.getDefinition(type as DataType.Type, data.component.data.definition.format)
    return def?.isNumeric ?? false
  }

  return {
    type: 'object',
    allowsSchemaExtensions: yes,
    after (data) {
      const { built } = data
      if (built.type === 'array') {
        validateMaxMin(data, 'minItems', 'maxItems')
      } else if (isNumeric(data)) {
        validateMaxMin(data, 'minimum', 'maximum')
      } else if (built.type === 'string') {
        validateMaxMin(data, 'minLength', 'maxLength')
      }

      if ('default' in built) {
        // TODO: validate default
      }

      if ('enum' in built) {
        // TODO: validate enum
      }
    },
    properties: [
      {
        name: 'type',
        schema: {
          type: 'string',
          enum: () => ['array', 'boolean', 'integer', 'number', 'string']
        }
      },
      {
        name: 'format',
        allowed (data) {
          const type = getType(data)
          return type === 'array' || type === 'object' ? 'Format cannot be specified for type ' + type + '.' : true
        },
        schema: {
          type: 'string',
          after (data, componentDef) {
            const { definition: format, exception } = data
            const type = getType(data)
            const def = dataTypes.getDefinition(type as DataType.Type, format)
            if (def === undefined) {
              const unknownTypeFormat = E.unknownTypeFormat(type, format)
              adjustExceptionLevel(def, unknownTypeFormat)
              addExceptionLocation(unknownTypeFormat, lookupLocation(componentDef, 'host', 'value'))
              exception.message(unknownTypeFormat)
            }
          }
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
        allowed: (data) => isNumeric(data) ? true : 'Data type must be numeric.',
        schema: {
          type: 'boolean',
          default: () => false
        }
      },
      {
        name: 'exclusiveMinimum',
        allowed: (data) => isNumeric(data) ? true : 'Data type must be numeric.',
        schema: {
          type: 'boolean',
          default: () => false
        }
      },
      {
        name: 'items',
        allowed: (data) => getType(data) === 'array' ? true : 'Data type must be an array.',
        required: (data) => getType(data) === 'array',
        schema: {
          type: 'boolean',
          default: () => false
        }
      },
      {
        name: 'maximum',
        allowed: (data) => isNumeric(data) ? true : 'Data type must be numeric.',
        schema: {
          type: 'any' // The type is "any" because a string can be numeric
        }
      },
      {
        name: 'maxItems',
        allowed: (data) => getType(data) === 'array' ? true : 'Data type must be an array.',
        schema: {
          type: 'number',
          after () {} // TODO: make sure max > min and that max is integer if type is integer
        }
      },
      {
        name: 'maxLength',
        allowed: (data) => getType(data) === 'string' ? true : 'Data type must be a string.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'minimum',
        allowed: (data) => isNumeric(data) ? true : 'Data type must be numeric.',
        schema: {
          type: 'any' // The type is "any" because a string can be numeric
        }
      },
      {
        name: 'minItems',
        allowed: (data) => getType(data) === 'array' ? true : 'Data type must be an array.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'minLength',
        allowed: (data) => getType(data) === 'string' ? true : 'Data type must be a string.',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'multipleOf',
        allowed: (data) => isNumeric(data) ? true : 'Data type must be numeric.',
        schema: {
          type: 'any', // The type is "any" because a string can be numeric
          after () {
            // TODO: make multipleOf is a numeric integer
          }
        }
      },
      {
        name: 'uniqueItems',
        allowed: (data) => getType(data) === 'array' ? true : 'Data type must be an array.',
        schema: {
          type: 'boolean'
        }
      }
    ]
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
  const { built, exception } = data
  if (minKey in built && maxKey in built && built[minKey] > built[maxKey]) {
    const invalidMaxMin = E.invalidMaxMin(built[minKey], built[maxKey], minKey, maxKey)
    adjustExceptionLevel(data.definition, invalidMaxMin)
    addExceptionLocation(invalidMaxMin, lookupLocation(data.definition, minKey, 'value'), lookupLocation(data.definition, maxKey, 'value'))
    exception.message(invalidMaxMin)
  }
}
