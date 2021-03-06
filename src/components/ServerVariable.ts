import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  enum?: string[]
  default: string
  description: string
}

export interface Object {
  [extension: string]: any
  readonly enum?: string[]
  readonly default: string
  readonly description: string
}

export function Factory (): FactoryResult<Definition, Object> {
  class ServerVariable extends EnforcerComponent<Definition, Object> implements Object {
    readonly enum?: string[]
    readonly default: string
    readonly description: string

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    name: 'ServerVariable',
    alertCodes: {},
    component: ServerVariable,
    validator: function (): SchemaObject {
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        required: () => ['default'],
        properties: [
          {
            name: 'enum',
            schema: {
              type: 'array',
              items: {
                type: 'string'
              },
              after (data) {
                const { alert, built } = data
                if (built.length === 0) alert('warn', 'SVAR001', 'Enum should not be an empty array')
              }
            }
          },
          {
            name: 'default',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'description',
            schema: {
              type: 'string'
            }
          }
        ]
      }
    }
  }
}
