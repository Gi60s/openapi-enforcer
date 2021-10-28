import { OASComponent, Version, Exception, ComponentSchema } from '../index'
import { OAuthFlow } from './OAuthFlow'
import { OAuthFlows3 as Definition } from '../helpers/DefinitionTypes'

const oauthFlowsSchema: ComponentSchema<Definition> = {
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

export class OAuthFlows extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly authorizationCode?: OAuthFlow
  readonly clientCredentials?: OAuthFlow
  readonly implicit?: OAuthFlow
  readonly password?: OAuthFlow

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
    return oauthFlowsSchema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
