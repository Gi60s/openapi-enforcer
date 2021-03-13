import { ComponentDefinition } from '../component-registry'
import * as DataTypeFormat from '../data-type-format'
import { Data, SchemaObject, SchemaProperty } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
  dataTypes: DataTypeFormat.Controller
}

export interface Definition {
  [extension: string]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Definition
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  maxItems?: string
  minItems?: string
  multipleOf?: number
  pattern?: string
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
  uniqueItems?: boolean
}

export interface Object {
  [extension: string]: any
  readonly collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  readonly default?: any
  readonly enum?: any[]
  readonly exclusiveMaximum?: boolean
  readonly exclusiveMinimum?: boolean
  readonly format?: string
  readonly items?: Definition
  readonly maxLength?: number
  readonly minLength?: number
  readonly maximum?: number
  readonly minimum?: number
  readonly maxItems?: string
  readonly minItems?: string
  readonly multipleOf?: number
  readonly pattern?: string
  readonly type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
  readonly uniqueItems?: boolean
}

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v2.0#items-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#items-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#items-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#items-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#items-object'
})

export const Component = class Item extends EnforcerComponent<Definition, Object> implements Object {
  readonly collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  readonly default?: any
  readonly enum?: any[]
  readonly exclusiveMaximum?: boolean
  readonly exclusiveMinimum?: boolean
  readonly format?: string
  readonly items?: Definition
  readonly maxLength?: number
  readonly minLength?: number
  readonly maximum?: number
  readonly minimum?: number
  readonly maxItems?: string
  readonly minItems?: string
  readonly multipleOf?: number
  readonly pattern?: string
  readonly type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
  readonly uniqueItems?: boolean

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<any, any>, ItemClass: Class): { after: (data: Data<any, any>) => void, properties: SchemaProperty[] } {
  const { definition } = data
  const dataTypes = ItemClass.dataTypes
  
  const type = definition.type
  const format = 'format' in definition ? definition.format : ''
  const dataTypeDefinition = dataTypes.getDefinition(type, format)
  const isNumeric = dataTypeDefinition !== undefined ? !!dataTypeDefinition.isNumeric : false
  const allowedIfNumeric = () => isNumeric || 'Type ' + type + (format !== '' ? ' ' + format : '') + ' is not numeric.'

  return {
    after (data: Data<any, any>) {
      const { alert, built } = data

      const dataTypeDef = dataTypes.getDefinition(built.type, built.format)
      if (built.type === 'array') {
        validateMaxMin(data, 'minItems', 'maxItems')
      } else if (dataTypeDef && dataTypeDef.isNumeric) {
        validateMaxMin(data, 'minimum', 'maximum')
      } else if (built.type === 'object') {
        validateMaxMin(data, 'minProperties', 'maxProperties')
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
        schema: {
          type: 'string',
          after ({ alert, definition: format }) {
            const formats = dataTypes.getFormats(type)
            if (!formats.includes(format)) {
              const msg = formats.length > 0 ? 'Expected one of: ' + formats.join(', ') : ''
              alert('warn', 'TYPFRM', format, msg)
            }
          }
        }
      },
      {
        name: 'default',
        schema: {
          type: 'any'
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
        name: 'collectionFormat',
        allowed: () => type === 'array',
        schema: {
          type: 'string',
          enum: () => ['csv', 'ssv', 'tsv', 'pipes']
        }
      },
      {
        name: 'exclusiveMaximum',
        allowed: allowedIfNumeric,
        schema: {
          type: 'boolean',
          default: () => false
        }
      },
      {
        name: 'exclusiveMinimum',
        allowed: allowedIfNumeric,
        schema: {
          type: 'boolean',
          default: () => false
        }
      },
      {
        name: 'items',
        allowed: () => type === 'array' || 'Allowed only if type is "array".',
        schema: {
          type: 'component',
          allowsRef: false,
          component: ItemClass
        }
      },
      {
        name: 'maxLength',
        allowed: () => type === 'string' || 'Allowed only if type is "string".',
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'minLength',
        allowed: () => type === 'string' || 'Allowed only if type is "string".',
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'maximum',
        allowed: allowedIfNumeric,
        schema: {
          type: 'number',
          minimum: 0
        }
      },
      {
        name: 'minimum',
        allowed: allowedIfNumeric,
        schema: {
          type: 'number',
          minimum: 0
        }
      },
      {
        name: 'maxItems',
        allowed: () => type === 'array' || 'Allowed only if type is "array".',
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'minItems',
        allowed: () => type === 'array' || 'Allowed only if type is "array".',
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'multipleOf',
        allowed: allowedIfNumeric,
        schema: {
          type: 'number',
          minimum: 0
        }
      },
      {
        name: 'pattern',
        allowed: () => type === 'string' || 'Allowed only if type is "string".',
        schema: {
          type: 'string',
          minLength: 1,
          build: (data) => new RegExp(data.definition as string)
        }
      },
      {
        name: 'uniqueItems',
        allowed: () => type === 'array' || 'Allowed only if type is "array".',
        schema: {
          type: 'boolean',
          default: () => false
        }
      }
    ]
  }
}

export const register: ComponentDefinition = {
  component: Component,
  dataTypes: DataTypeFormat.Factory(),
  validator: function (data: Data<Definition, Object>): SchemaObject {
    const type = data.definition.type
    const common = validator(data, Component)
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      required: () => {
        const required = ['type']
        if (type === 'array') required.push('items')
        return required
      },
      after: common.after,
      properties: [...common.properties]
    }
  },
  versions
}

function validateMaxMin(data: Data<any, any>, minKey: string, maxKey: string) {
  const { alert, built } = data
  if (minKey in built && maxKey in built && built[minKey] > built[maxKey]) {
    alert('error', 'MAXMIN', minKey, maxKey)
  }
}