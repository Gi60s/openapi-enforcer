import { OASComponent, Version, DefinitionException, ComponentSchema } from '../index'
import { OAuthFlow } from './OAuthFlow'
import { OAuthFlows3 as Definition } from '../helpers/DefinitionTypes'

let oauthFlowsSchema: ComponentSchema<Definition>

export class OAuthFlows extends OASComponent {
  extensions!: Record<string, any>
  authorizationCode?: OAuthFlow
  clientCredentials?: OAuthFlow
  implicit?: OAuthFlow
  password?: OAuthFlow

  constructor (definition: Definition, version?: Version) {
    super(OAuthFlows, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flows-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flows-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flows-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flows-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    if (oauthFlowsSchema === undefined) {
      oauthFlowsSchema = {
        allowsSchemaExtensions: false,
        properties: [
          {
            name: 'authorizationCode',
            schema: {
              type: 'component',
              allowsRef: false,
              component: OAuthFlow
            }
          },
          {
            name: 'clientCredentials',
            schema: {
              type: 'component',
              allowsRef: false,
              component: OAuthFlow
            }
          },
          {
            name: 'implicit',
            schema: {
              type: 'component',
              allowsRef: false,
              component: OAuthFlow
            }
          },
          {
            name: 'password',
            schema: {
              type: 'component',
              allowsRef: false,
              component: OAuthFlow
            }
          }
        ]
      }
    }
    return oauthFlowsSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
