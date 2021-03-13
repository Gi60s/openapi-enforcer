import { ComponentDefinition } from '../component-registry'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

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

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#server-variable-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#server-variable-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#server-variable-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#server-variable-object'
})

export const Component = class ServerVariable extends EnforcerComponent<Definition, Object> implements Object {
  readonly enum?: string[]
  readonly default: string
  readonly description: string

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
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

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}