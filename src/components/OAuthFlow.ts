import { OASComponent, Data, Version, Exception, ComponentSchema } from './index'

export interface Definition {
  [key: `x-${string}`]: any
  authorizationUrl?: string
  refreshUrl?: string
  scopes: string[]
  tokenUrl?: string
}

export class OAuthFlow extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly authorizationUrl?: string
  readonly refreshUrl?: string
  readonly scopes!: string[]
  readonly tokenUrl?: string

  constructor (definition: Definition, version?: Version) {
    super(OAuthFlow, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flow-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flow-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flow-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flow-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    const { key } = data.context
    const useAuthorizationUrl = key === 'implicit' || key === 'authorizationCode'
    const useTokenUrl = key === 'password' || key === 'clientCredentials' || key === 'authorizationCode'

    return {
      allowsSchemaExtensions: true,
      properties: [
        {
          name: 'authorizationUrl',
          notAllowed: useAuthorizationUrl ? undefined : 'Only allowed for implicit and authorizationCode grant types.',
          required: useAuthorizationUrl,
          schema: { type: 'string' }
        },
        {
          name: 'refreshUrl',
          schema: { type: 'string' }
        },
        {
          name: 'scopes',
          required: true,
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
          notAllowed: useTokenUrl ? undefined : 'Only allowed for password, clientCredentials, and authorizationCode grant types.',
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
