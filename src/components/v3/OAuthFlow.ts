import { ComponentSchema, Data, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { OASComponent, componentValidate } from '../index'
import { OAuthFlow3 as Definition } from '../helpers/definition-types'

export class OAuthFlow extends OASComponent {
  extensions!: Record<string, any>
  authorizationUrl?: string
  refreshUrl?: string
  scopes!: string[]
  tokenUrl?: string

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
              schema: {
                type: 'string'
              }
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

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
