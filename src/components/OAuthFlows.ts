import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { yes } from '../util'
import * as OAuthFlow from './OAuthFlow'

export interface Definition {
  [extension: string]: any
  authorizationUrl?: string
  refreshUrl?: string
  scopes: string[]
  tokenUrl?: string
}

export class OAuthFlows extends OASComponent {
  readonly [extension: string]: any
  readonly authorizationUrl?: string
  readonly refreshUrl?: string
  readonly scopes!: string[]
  readonly tokenUrl?: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing OAuthFlows object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#oauth-flows-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#oauth-flows-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#oauth-flows-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#oauth-flows-object'
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

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
