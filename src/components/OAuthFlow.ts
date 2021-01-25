import { EnforcerComponent, FactoryResult, Statics } from './'
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
  class OAuthFlow extends EnforcerComponent<Definition, Object> implements Object {
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
    component: OAuthFlow,
    validator: function (data): SchemaObject {
      const { key } = data
      const useAuthorizationUrl = key === 'implicit' || key === 'authorizationCode'
      const useTokenUrl = key === 'password' || key === 'clientCredentials' || key === 'authorizationCode'

      // determine required fields
      const required: string[] = ['scopes']
      if (useAuthorizationUrl) required.push('authorizationUrl')
      if (useTokenUrl) required.push('tokenUrl')

      return {
        type: 'object',
        required: () => required,
        properties: [
          {
            name: 'authorizationUrl',
            allowed: () => useAuthorizationUrl,
            schema: { type: 'string' }
          },
          {
            name: 'refreshUrl',
            schema: { type: 'string' }
          },
          {
            name: 'scopes',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'string'
              }
            }
          },
          {
            name: 'tokenUrl',
            allowed: () => useTokenUrl,
            schema: { type: 'string' }
          }
        ]
      }
    }
  }
}
