import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { addExceptionLocation, adjustExceptionLevel, no, yes } from '../util'
import * as E from '../Exception/methods'
import * as OAuthFlows from './OAuthFlows'
import { lookup } from '../loader'

const rxUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

export type Definition = Definition2 | Definition3

export interface Definition2 {
  [extension: string]: any
  authorizationUrl: string
  description?: string
  flow: string
  in: string
  name: string
  scopes: Record<string, string>
  tokenUrl: string
  type: string
}

export interface Definition3 {
  [extension: string]: any
  bearerFormat?: string
  description?: string
  flows: string
  in: string
  name: string
  openIdConnectUrl: string
  scheme: string
  type: string
}

export class SecurityScheme extends OASComponent {
  readonly [extension: string]: any
  readonly description?: string
  readonly in!: string
  readonly name!: string
  readonly type!: string

  // v2
  readonly authorizationUrl?: string
  readonly flow?: string
  readonly scopes?: Record<string, string>
  readonly tokenUrl?: string

  // v3
  readonly bearerFormat?: string
  readonly flows?: string
  readonly openIdConnectUrl?: string
  readonly scheme?: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing SecurityScheme object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#security-scheme-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#security-scheme-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#security-scheme-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#security-scheme-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#security-scheme-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'type',
          required: yes,
          schema: {
            type: 'string',
            enum: ({ major }) => major === 2
              ? ['basic', 'apiKey', 'oauth2']
              : ['apiKey', 'http', 'oauth2', 'openIdConnect']
          }
        },
        {
          name: 'authorizationUrl',
          versions: ['2.x'],
          required: yes,
          allowed: (data, def: Definition) => def.type === 'oauth2' ? true : 'Only allowed if type is "oauth2".',
          schema: { type: 'string' }
        },
        {
          name: 'bearerFormat',
          versions: ['3.x.x'],
          allowed: (data, def: Definition) => def.type === 'http' ? true : 'Only allowed if type is "http".',
          schema: { type: 'string' }
        },
        {
          name: 'description',
          schema: { type: 'string' }
        },
        {
          name: 'flow',
          versions: ['2.x'],
          required: yes,
          allowed: (data, def: Definition) => def.type === 'oauth2' ? true : 'Only allowed if type is "oauth2".',
          schema: { type: 'string' }
        },
        {
          name: 'flows',
          versions: ['3.x.x'],
          required: yes,
          allowed: (data, def: Definition) => def.type === 'oauth2' ? true : 'Only allowed if type is "oauth2".',
          schema: {
            type: 'component',
            allowsRef: false,
            component: OAuthFlows.OAuthFlows
          }
        },
        {
          name: 'in',
          required: yes,
          schema: {
            type: 'string',
            enum: ({ major }) => major === 2
              ? ['query', 'header']
              : ['query', 'header', 'cookie']
          }
        },
        {
          name: 'name',
          required: yes,
          allowed: (data, def: Definition) => def.type === 'apiKey' ? true : 'Only allowed if type is "apiKey".',
          schema: { type: 'string' }
        },
        {
          name: 'openIdConnectUrl',
          versions: ['3.x.x'],
          required: yes,
          allowed: (data, def: Definition) => def.type === 'openIdConnect' ? true : 'Only allowed if type is "openIdConnect".',
          schema: {
            type: 'string',
            after ({ exception, definition: url, reference }, def) {
              if (!rxUrl.test(url)) {
                const securitySchemeNotUrl = E.securitySchemeNotUrl(reference)
                addExceptionLocation(securitySchemeNotUrl, lookup(def, 'openIdConnectUrl', 'value'))
                exception.message(securitySchemeNotUrl)
              }
            }
          }
        },
        {
          name: 'scheme',
          versions: ['3.x.x'],
          required: yes,
          allowed: (data, def: Definition) => def.type === 'http' ? true : 'Only allowed if type is "http".',
          schema: { type: 'string' }
        },
        {
          name: 'scopes',
          versions: ['2.x'],
          required: yes,
          allowed: (data, def: Definition) => def.type === 'oauth2' ? true : 'Only allowed if type is "oauth2".',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: { type: 'string' }
          }
        },
        {
          name: 'tokenUrl',
          versions: ['2.x'],
          required: yes,
          allowed: (data, def: Definition) => def.type === 'oauth2' && ['password', 'application', 'accessCode'].includes(def.flow)
            ? true
            : 'Only allowed if type is "oauth2" and flow is one of "application", "accessCode", or "password".',
          schema: { type: 'string' }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
