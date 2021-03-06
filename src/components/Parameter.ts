import * as Item from './Item'
import * as Example from './Example'
import * as Reference from './Reference'
import * as Schema from './Schema'
import { SchemaObject } from '../definition-validator'
import { ComponentFactoryData, EnforcerComponent, FactoryResult, Statics, v2, v3 } from './'

export interface Class<Definition, Object> extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export type Definition = Definition2 | Definition3

export interface Definition2 {
  [extension: string]: any
  name: string
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  default?: any
  description?: string
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Item.Definition[]
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
  pattern?: string
  required?: boolean
  schema?: Schema.Definition2
  type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'
  uniqueItems?: boolean
}

export interface Definition3 {
  [extension: string]: any
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  allowReserved?: boolean
  description?: string
  example?: any
  examples?: {
    [key: string]: Example.Definition | Reference.Definition
  }
  explode?: boolean
  deprecated?: boolean // defaults to false
  required?: boolean
  schema?: Schema.Definition3 | Reference.Definition
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'
}

export type Object = Object2 | Object3

export interface Object2 {
  [extension: string]: any
  name: string
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  default?: any
  description?: string
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Item.Object[]
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
  pattern?: string
  required?: boolean
  schema?: Schema.Object2
  type: string
  uniqueItems?: boolean
}

interface Object3 {
  [extension: string]: any
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  allowReserved?: boolean
  description?: string
  example?: any
  examples?: {
    [key: string]: Example.Object | Reference.Object<Example.Object>
  }
  explode?: boolean
  deprecated?: boolean // defaults to false
  required?: boolean
  schema?: Schema.Object3 | Reference.Object<Schema.Object3>
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'
}

export function Factory({ components }: ComponentFactoryData): FactoryResult<Definition, Object> {
  const version = components.$version

  class Parameter extends EnforcerComponent<Definition, Object> {
    readonly name: string
    readonly in: 'body' | 'cookie' | 'formData' | 'header' | 'path' | 'query'
    readonly allowEmptyValue?: boolean
    readonly description?: string
    readonly required?: boolean
    readonly schema?: Schema.Object | Reference.Object<Schema.Object>

    // v2 properties
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
    readonly type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'
    readonly uniqueItems?: boolean

    // v3 properties
    readonly allowReserved?: boolean
    readonly deprecated?: boolean
    readonly example?: any
    readonly examples?: {
      readonly [key: string]: Example.Object | Reference.Object<Example.Object>
    }
    readonly explode?: boolean
    readonly style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'    


    // constructor (definition: Definition) {
    //   super(definition)
    // }

  }

  return {
    name: 'Parameter',
    alertCodes: {
      1: 'Required must be true for "path" parameters.',
      2: 'Cookies do not support exploded values for schemas of type array or object.',
      3: 'Style %s is incompatible with schema type: %s',
      4: 'Cannot define a "default" value and set "required" to true.'
    },

    // @ts-ignore
    component: Parameter,
    validator: function (data): SchemaObject<Definition, Object> {
      const { components, definition } = data
      const at = definition.in

      // if version === '2' then item and property validators share a lot in common so borrow form item
      const itemValidator = Item.validator(data, (components as v2).Item)
      const v2Props = version === '2'
        ? itemValidator.properties.filter(p => !['collectionFormat', 'type'].includes(p.name))
        : []

      // 
      const afterHooks: Function[] = []

      return {
        type: 'object',
        allowsSchemaExtensions: true,
        required: () => {
          const required = ['in', 'name']
          if (definition.in === 'path') required.push('required')
          if (version === '2') {
            if (definition.in !== 'body') required.push('type')
            if (definition.type === 'array') required.push('items')
          }
          return required
        },
        after: (data) => {
          const { alert, built } = data

          // if v2 then use item validator
          if (version === '2') itemValidator.after(data)
          
          if (built.required === true && 'default' in built) {
            alert.error(4)
          }

          // TODO: If type is "file", the consumes MUST be either "multipart/form-data", " application/x-www-form-urlencoded" or both and the parameter MUST be in "formData".

          afterHooks.forEach(hook => hook(built))
        },
        properties: [
          {
            name: 'name',
            schema: { type: 'string' }
          },
          {
            name: 'in',
            schema: {
              type: 'string',
              enum: () => {
                return version === '2'
                  ? [ 'body', 'formData', 'header', 'path', 'query']
                  : [ 'cookie', 'header', 'path', 'query' ]
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
                  alert.error(1)
                  return false
                }
                return true
              }
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
            name: 'schema',
            allowed: () => {
              if (version === '3' || at === 'body') return true
              return 'Property only allowed if "in" is set to "body".'
            },
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Schema
            }
          },

          // v2 properties
          {
            name: 'type',
            allowed: () => version === '2',
            schema: {
              type: 'string',
              enum: () => at === 'formData'
                ? ['array', 'boolean', 'file', 'integer', 'number', 'string']
                : ['array', 'boolean', 'integer', 'number', 'string']
            }
          },
          {
            name: 'collectionFormat',
            allowed: ({ chain }) => {
              if (version !== '2') return false
              if (chain[0].definition.type !== 'array') return 'Property only allowed when "type" is "array".'
              if (!['query', 'formData'].includes(at)) return 'Property only allowed when "in" is "formData" or "query".'
              return true
            },
            schema: {
              type: 'string',
              default: () => 'csv',
              enum: () => ['csv', 'ssv', 'tsv', 'pipes', 'multi']
            }
          },
          ...v2Props,

          // v3 properties
          {
            name: 'explode',
            allowed: () => version === '3',
            schema: {
              type: 'boolean',
              default: () => definition.style === 'form',
              after ({ alert, definition: explode }) {
                afterHooks.push(function (parameter: Object3) {
                  if (parameter.schema) {
                    const type = (parameter.schema as Schema.Object3).type
                    if (at === 'cookie' && explode && (type === 'array' || type === 'object')) {
                      alert.error(2)
                    }
                  }
                })
              }
            }
          },
          {
            name: 'style',
            allowed: () => version === '3',
            schema: {
              type: 'string',
              default () {
                switch (at) {
                  case 'cookie': return 'form'
                  case 'header': return 'simple'
                  case 'path': return 'simple'
                  case 'query': return 'simple'
                  default: return undefined
                }
              },
              enum () {
                switch (at) {
                  case 'cookie': return ['form']
                  case 'header': return ['simple']
                  case 'path': return ['simple', 'label', 'matrix']
                  case 'query': return ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject']
                  default: return undefined
                }
              },
              after ({ alert, definition: style }) {
                afterHooks.push(function (parameter: Object3) {
                  const schema = parameter.schema
                  if (schema) {
                    const type = schema.type
                    if (!type) return
                    if (at === 'query') {
                      if ((style !== 'form') &&
                          !(style === 'spaceDelimited' && type === 'array') &&
                          !(style === 'pipeDelimited' && type === 'array') &&
                          !(style === 'deepObject' && type === 'object')) alert.error(3, style, type)
                    }
                  }
                })
              }
            }
          },
          {
            name: 'allowReserved',
            allowed: () => {
              if (version !== '3') return false
              return at === 'query' || 'Property only allowed for "query" parameters.'
            },
            schema: {
              type: 'boolean',
              default: () => false
            }
          },
          {
            name: 'schema',
            allowed: () => version === '3',
            schema: {
              type: 'component',
              allowsRef: true,
              component: components.Schema
            }
          }
        ]
      }
    }
  }
}
