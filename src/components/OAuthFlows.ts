import { EnforcerComponent, FactoryResult, Statics, v3 } from './'
import { SchemaObject } from '../definition-validator'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  authorizationUrl?: string
  refreshUrl?: string
  scopes: string[]
  tokenUrl?: string
}

export interface Object {
  [extension: string]: any
  authorizationUrl?: string
  refreshUrl?: string
  scopes: string[]
  tokenUrl?: string
}

export function Factory (): FactoryResult<Definition, Object> {
  class OAuthFlows extends EnforcerComponent<Definition, Object> implements Object {
    readonly [extension: string]: any
    readonly authorizationUrl?: string
    readonly refreshUrl?: string
    readonly scopes: string[]
    readonly tokenUrl?: string

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: OAuthFlows,
    validator: function (data): SchemaObject {
      const components = data.components as v3
      return {
        type: 'object',
        properties: [
          {
            name: 'authorizationCode',
            schema: {
              type: 'component',
              component: components.OAuthFlow
            }
          },
          {
            name: 'clientCredentials',
            schema: {
              type: 'component',
              component: components.OAuthFlow
            }
          },
          {
            name: 'implicit',
            schema: {
              type: 'component',
              component: components.OAuthFlow
            }
          },
          {
            name: 'password',
            schema: {
              type: 'component',
              component: components.OAuthFlow
            }
          }
        ]
      }
    }
  }
}
