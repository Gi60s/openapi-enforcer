import { ComponentDefinition } from '../component-registry'
import { EnforcerComponent, Statics } from './'
import { Data, SchemaObject } from '../definition-validator'
import * as OAuthFlow from './OAuthFlow'

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
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#oauth-flows-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#oauth-flows-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#oauth-flows-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#oauth-flows-object'
})

export const Component = class OAuthFlows extends EnforcerComponent<Definition, Object> implements Object {
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
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'authorizationCode',
        schema: {
          type: 'component',
          allowsRef: false,
          component: OAuthFlow.Component
        }
      },
      {
        name: 'clientCredentials',
        schema: {
          type: 'component',
          allowsRef: false,
          component: OAuthFlow.Component
        }
      },
      {
        name: 'implicit',
        schema: {
          type: 'component',
          allowsRef: false,
          component: OAuthFlow.Component
        }
      },
      {
        name: 'password',
        schema: {
          type: 'component',
          allowsRef: false,
          component: OAuthFlow.Component
        }
      }
    ]
  }
}

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}