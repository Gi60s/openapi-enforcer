import { Validator } from '../Validator'
import { EnforcerComponent, FactoryResult, Statics, v3 } from './'
import * as ServerVariable from './ServerVariable'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  description?: string
  url: string
  variables?: {
    [name: string]: ServerVariable.Definition
  }
}

export interface Object {
  [extension: string]: any
  readonly description?: string
  readonly url: string
  readonly variables?: {
    [name: string]: ServerVariable.Object
  }
}

export function Factory (): FactoryResult<Definition, Object> {
  class Server extends EnforcerComponent<Definition, Object> implements Object {
    readonly description?: string
    readonly url: string
    readonly variables?: {
      [name: string]: ServerVariable.Object
    }

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Server,
    schema: function (data): Validator.SchemaObject {
      const components = data.components as v3
      return {
        type: 'object',
        required: () => ['url'],
        properties: [
          {
            name: 'url',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'description',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'variables',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.ServerVariable
              }
            }
          }
        ]
      }
    }
  }
}
