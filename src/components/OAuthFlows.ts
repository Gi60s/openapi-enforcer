import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { yes } from '../util'
import * as OAuthFlow from './OAuthFlow'

export interface Definition {
  [key: `x-${string}`]: any
  authorizationCode?: OAuthFlow.Definition
  clientCredentials?: OAuthFlow.Definition
  implicit?: OAuthFlow.Definition
  password?: OAuthFlow.Definition
}

export class OAuthFlows extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly authorizationCode?: OAuthFlow.OAuthFlow
  readonly clientCredentials?: OAuthFlow.OAuthFlow
  readonly implicit?: OAuthFlow.OAuthFlow
  readonly password?: OAuthFlow.OAuthFlow

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', OAuthFlows, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flows-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flows-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flows-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flows-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
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
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
