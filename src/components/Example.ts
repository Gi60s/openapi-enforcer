import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  description?: string
  externalValue?: string
  summary?: string
  value?: any
}

export interface Object {
  [extension: string]: any
  readonly description?: string
  readonly externalValue?: string
  readonly summary?: string
  readonly value?: any
}

export function Factory (): FactoryResult<Definition, Object> {
  class Example extends EnforcerComponent<Definition, Object> implements Object {
    readonly description?: string
    readonly externalValue?: string
    readonly summary?: string
    readonly value?: any

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Example,
    validator: function (data): SchemaObject {
      const { components } = data
      return {
        type: 'object',
        allowsSchemaExtensions: components.major === '3',
        after ({ alert, built }) {
          if ('value' in built && 'externalValue' in built) {
            alert('error', 'EXM001', 'Cannot have both "externalValue" and "value" properties')
          }
        },
        properties: [
          {
            name: 'summary',
            schema: { type: 'string' }
          },
          {
            name: 'description',
            schema: { type: 'string' }
          },
          {
            name: 'value',
            schema: {
              type: 'any'
            }
          },
          {
            name: 'externalValue',
            schema: { type: 'string' }
          }
        ]
      }
    }
  }
}
