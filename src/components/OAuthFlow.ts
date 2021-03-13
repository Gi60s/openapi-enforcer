import { ComponentDefinition } from '../component-registry'
import { EnforcerComponent, Statics } from './'
import { Data, SchemaObject } from '../definition-validator'

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

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#oauth-flow-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#oauth-flow-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#oauth-flow-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#oauth-flow-object'
})

export const Component = class OAuthFlow extends EnforcerComponent<Definition, Object> implements Object {
  readonly [extension: string]: any
  readonly authorizationUrl?: string
  readonly refreshUrl?: string
  readonly scopes: string[]
  readonly tokenUrl?: string

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}



export function validator (data: Data<Definition, Object>): SchemaObject {
  const { key } = data
  const useAuthorizationUrl = key === 'implicit' || key === 'authorizationCode'
  const useTokenUrl = key === 'password' || key === 'clientCredentials' || key === 'authorizationCode'

  // determine required fields
  const required: string[] = ['scopes']
  if (useAuthorizationUrl) required.push('authorizationUrl')
  if (useTokenUrl) required.push('tokenUrl')

  return {
    type: 'object',
    allowsSchemaExtensions: true,
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
          allowsSchemaExtensions: false,
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

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}