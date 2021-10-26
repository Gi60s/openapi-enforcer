import { OASComponent, Version, Exception, ComponentSchema } from '../index'
import * as OAuthFlow from './OAuthFlow'

export interface Definition {
  [key: `x-${string}`]: any
  authorizationCode?: OAuthFlow.Definition
  clientCredentials?: OAuthFlow.Definition
  implicit?: OAuthFlow.Definition
  password?: OAuthFlow.Definition
}

const oauthFlowsSchema: ComponentSchema<Definition> = {
  allowsSchemaExtensions: false,
  properties: [
    {
      name: 'authorizationCode',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow.OAuthFlow
      }
    },
    {
      name: 'clientCredentials',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow.OAuthFlow
      }
    },
    {
      name: 'implicit',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow.OAuthFlow
      }
    },
    {
      name: 'password',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow.OAuthFlow
      }
    }
  ]
}

export class OAuthFlows extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly authorizationCode?: OAuthFlow.OAuthFlow
  readonly clientCredentials?: OAuthFlow.OAuthFlow
  readonly implicit?: OAuthFlow.OAuthFlow
  readonly password?: OAuthFlow.OAuthFlow

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
