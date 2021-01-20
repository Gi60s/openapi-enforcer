import * as Server from './Server'
import { Validator } from '../Validator'
import { EnforcerComponent, FactoryResult, Statics, v3 } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: { [key: string]: any } // TODO: update with Parameters.Definition
  requestBody?: any
  server?: Server.Definition
}

export interface Object {
  [extension: string]: any
  readonly description?: string
  readonly operationId?: string
  readonly operationRef?: string
  readonly parameters?: { [key: string]: any }
  readonly requestBody?: any
  readonly server?: Server.Object
}

export function Factory (): FactoryResult<Definition, Object> {
  class Link extends EnforcerComponent<Definition, Object> implements Object {
    readonly description?: string
    readonly operationId?: string
    readonly operationRef?: string
    readonly parameters?: { [key: string]: any }
    readonly requestBody?: any
    readonly server?: Server.Object

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Link,
    schema: function (data): Validator.SchemaObject {
      const components = data.components as v3
      return {
        type: 'object',
        after ({ alert, built }) {
          if ('operationRef' in built && 'operationId' in built) {
            alert('error', 'LNK001', 'Must not define both operationId and operationRef')
          }
        },
        properties: [
          {
            name: 'description',
            schema: { type: 'string' }
          },
          {
            name: 'operationRef',
            schema: { type: 'string' }
          },
          {
            name: 'operationId',
            schema: { type: 'string' }
          },
          {
            name: 'parameters',
            schema: {
              type: 'any'
            }
          },
          {
            name: 'requestBody',
            schema: {
              type: 'any'
            }
          },
          {
            name: 'server',
            schema: {
              type: 'component',
              component: components.Server
            }
          }
        ]
      }
    }
  }
}
