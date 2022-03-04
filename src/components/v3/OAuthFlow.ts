import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import { OASComponent, componentValidate } from '../index'
import { OAuthFlow3 as Definition } from '../helpers/definition-types'
import rx from '../../utils/rx'

let oauthFlowSchema: ComponentSchema<Definition>

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

  static get schema (): ComponentSchema<Definition> {
    if (oauthFlowSchema === undefined) {
      oauthFlowSchema = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        properties: [
          {
            before (cache, data) {
              const key = data.context.key
              cache.useAuthorizationUrl = key === 'implicit' || key === 'authorizationCode'
              cache.useTokenUrl = key === 'password' || key === 'clientCredentials' || key === 'authorizationCode'
            },
            name: 'authorizationUrl',
            notAllowed ({ cache }) {
              return cache.useAuthorizationUrl as boolean ? undefined : 'Only allowed for implicit and authorizationCode grant types.'
            },
            required ({ cache }) {
              return cache.useAuthorizationUrl as boolean
            },
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
            notAllowed ({ cache }) {
              return cache.useTokenUrl as boolean ? undefined : 'Only allowed for password, clientCredentials, and authorizationCode grant types.'
            },
            required ({ cache }) {
              return cache.useTokenUrl as boolean
            },
            schema: { type: 'string' }
          }
        ],
        validator: {
          after (data) {
            const { context } = data
            const { definition, exception } = context

            if (definition.authorizationUrl !== undefined && !rx.url.test(definition.authorizationUrl)) {
              exception.add.invalidUrl(data, { key: 'authorizationUrl', type: 'value' }, definition.authorizationUrl)
            }
            if (definition.refreshUrl !== undefined && !rx.url.test(definition.refreshUrl)) {
              exception.add.invalidUrl(data, { key: 'refreshUrl', type: 'value' }, definition.refreshUrl)
            }
            if (definition.tokenUrl !== undefined && !rx.url.test(definition.tokenUrl)) {
              exception.add.invalidUrl(data, { key: 'tokenUrl', type: 'value' }, definition.tokenUrl)
            }
          }
        }
      })
    }
    return oauthFlowSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
