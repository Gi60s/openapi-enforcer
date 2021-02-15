import * as Contact from './Contact'
import * as License from './License'
import * as Example from './Example'
import * as Reference from './Reference'
import * as Schema from './Schema'
import { SchemaObject, SchemaProperty } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export type Definition = Definition2 | Definition3

interface DefinitionBase {
  [extension: string]: any
  name: string
  in: string
  description?: string
  required?: boolean
}

interface Definition2 extends DefinitionBase {
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items: any[] // TODO: update this
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
  pattern?: string
  schema?: Schema.Definition2
  type: string
  uniqueItems?: boolean
}

interface Definition3 extends DefinitionBase {
  in: 'cookie' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  allowReserved?: boolean
  example?: any
  examples?: {
    [key: string]: Example.Definition | Reference.Definition
  }
  explode?: boolean
  deprecated?: boolean // defaults to false
  schema?: Schema.Definition3 | Reference.Definition
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'
}

export type Object = Object2 | Object3

interface ObjectBase {
  [extension: string]: any
  name: string
  in: string
  description?: string
  required?: boolean
}

export interface Object2 extends ObjectBase {
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items: any[] // TODO: update this
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
  pattern?: string
  schema?: Schema.Object2
  type: string
  uniqueItems?: boolean
}

interface Object3 extends ObjectBase {
  in: 'cookie' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  allowReserved?: boolean
  example?: any
  examples?: {
    [key: string]: Example.Object | Reference.Object
  }
  explode?: boolean
  deprecated?: boolean // defaults to false
  schema?: Schema.Object3 | Reference.Object
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'
}

class ParameterBase<Definition, Object> extends EnforcerComponent<Definition, Object> {
  readonly name: string
  readonly in: string
  readonly description?: string
  readonly required?: boolean
}

export function Factory (): FactoryResult<Definition, Object> {
  class Parameter extends ParameterBase<Definition2, Object2> implements Object2 {
    readonly in: 'body' | 'formData' | 'header' | 'path' | 'query'
    readonly allowEmptyValue?: boolean
    readonly collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
    readonly default?: any
    readonly enum?: any[]
    readonly exclusiveMaximum?: boolean
    readonly exclusiveMinimum?: boolean
    readonly format?: string
    readonly items: any[] // TODO: update this
    readonly maxItems?: number
    readonly minItems?: number
    readonly maxLength?: number
    readonly minLength?: number
    readonly maximum?: number
    readonly minimum?: number
    readonly multipleOf?: number
    readonly pattern?: string
    readonly schema?: Schema.Object2
    readonly type: string
    readonly uniqueItems?: boolean

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Parameter,
    validator: function (data): SchemaObject<Definition2, Object2> {
      const { components, definition } = data
      const at = definition.in
      const type = definition.type
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        required: () => {
          const result = ['in', 'path']
          if (definition.in === 'body') result.push('schema')
          if (definition.in === 'path') result.push('required')
          return result
        },
        properties: [
          ...getCommonValidatorProperties('2', definition),
          {
            name: 'format',
            allowed: () => ['file', 'integer', 'number', 'string'].includes(at),
            schema: {
              type: 'string',
              enum: () => components.Schema.getDataTypeFormats(type)
            }
          },
          {
            name: 'allowEmptyValue',
            allowed: () => ['query', 'formData'].includes(at),
            schema: {
              type: 'boolean',
              default: () => false
            }
          },
          {
            name: 'collectionFormat',
            allowed: () => type === 'array',
            schema: {
              type: 'string',
              default: () => 'csv',
              enum: () => {
                return ['query', 'formData'].includes(at)
                  ? ['csv', 'ssv', 'tsv', 'pipes', 'multi']
                  : ['csv', 'ssv', 'tsv', 'pipes']
              }
            }
          },
          {
            name: 'version',
            schema: { type: 'string' }
          }
        ]
      }
    }
  }
}

function getCommonValidatorProperties (major: '2' | '3', definition: DefinitionBase): SchemaProperty[] {
  return [
    {
      name: 'name',
      schema: { type: 'string' }
    },
    {
      name: 'in',
      schema: {
        type: 'string',
        enum: () => {
          return major === '2'
            ? ['body', 'formData', 'header', 'path', 'query']
            : ['cookie', 'header', 'path', 'query']
        }
      }
    },
    {
      name: 'description',
      schema: { type: 'string' }
    },
    {
      name: 'required',
      schema: {
        type: 'boolean',
        default: () => false,
        before (data: any) {
          const { alert, definition: value } = data
          if (definition.in === 'path' && value !== true) {
            alert('error', 'PRM001', 'Required must be true for "path" parameters.')
            return false
          }
          return true
        }
      }
    }
  ]
}
