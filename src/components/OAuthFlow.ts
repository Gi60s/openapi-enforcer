import { OASComponent, initializeData, Data, SchemaObject, SpecMap, Version, Exception } from './index'
import { no, yes } from '../util'

export interface Definition {
  [extension: string]: any
  authorizationUrl?: string
  refreshUrl?: string
  scopes: string[]
  tokenUrl?: string
}

export class OAuthFlow extends OASComponent {
  readonly [extension: string]: any
  authorizationUrl?: string
  refreshUrl?: string
  scopes!: string[]
  tokenUrl?: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing OAuthFlow object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flow-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flow-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flow-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flow-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'authorizationUrl',
          allowed: (data: Data) => useAuthorizationUrl(data) ? true : 'Only allowed for implicit and authorizationCode grant types.',
          required: useAuthorizationUrl,
          schema: { type: 'string' }
        },
        {
          name: 'refreshUrl',
          schema: { type: 'string' }
        },
        {
          name: 'scopes',
          required: yes,
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'string'
            }
          }
        },
        {
          name: 'tokenUrl',
          allowed: (data: Data) => useTokenUrl(data) ? true : 'Only allowed for password, clientCredentials, and authorizationCode grant types.',
          required: useTokenUrl,
          schema: { type: 'string' }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}

function useAuthorizationUrl (data: Data): boolean {
  const { key } = data
  return key === 'implicit' || key === 'authorizationCode'
}

function useTokenUrl (data: Data): boolean {
  const { key } = data
  return key === 'password' || key === 'clientCredentials' || key === 'authorizationCode'
}
