import { OASComponent, Data, Version, Exception, ComponentSchema } from './'
import * as E from '../Exception/methods'
import * as OAuthFlows from './v3/OAuthFlows'

const rxUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

export type Definition = Definition2 | Definition3

export interface Definition2 {
  [key: `x-${string}`]: any
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
  [key: `x-${string}`]: any
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
  readonly [key: `x-${string}`]: any
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
    super(SecurityScheme, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#security-scheme-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-scheme-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-scheme-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-scheme-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-scheme-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    const { definition, exception } = data.context
    const { major } = data.root
    const type = definition.type ?? ''

    return {
      allowsSchemaExtensions: true,
      properties: [
        {
          name: 'type',
          required: true,
          schema: {
            type: 'string',
            enum: major === 2
              ? ['basic', 'apiKey', 'oauth2']
              : ['apiKey', 'http', 'oauth2', 'openIdConnect']
          }
        },
        {
          name: 'authorizationUrl',
          versions: ['2.x'],
          required: true,
          notAllowed: type === 'oauth2' ? undefined : 'Only allowed if type is "oauth2".',
          schema: { type: 'string' }
        },
        {
          name: 'bearerFormat',
          versions: ['3.x.x'],
          notAllowed: type === 'http' ? undefined : 'Only allowed if type is "http".',
          schema: { type: 'string' }
        },
        {
          name: 'description',
          schema: { type: 'string' }
        },
        {
          name: 'flow',
          versions: ['2.x'],
          required: true,
          notAllowed: type === 'oauth2' ? undefined : 'Only allowed if type is "oauth2".',
          schema: { type: 'string' }
        },
        {
          name: 'flows',
          versions: ['3.x.x'],
          required: true,
          notAllowed: type === 'oauth2' ? undefined : 'Only allowed if type is "oauth2".',
          schema: {
            type: 'component',
            allowsRef: false,
            component: OAuthFlows.OAuthFlows
          }
        },
        {
          name: 'in',
          required: true,
          notAllowed: type === 'apiKey' ? undefined : 'Only allowed if type is "apiKey".',
          schema: {
            type: 'string',
            enum: major === 2
              ? ['query', 'header']
              : ['query', 'header', 'cookie']
          }
        },
        {
          name: 'name',
          required: true,
          notAllowed: type === 'apiKey' ? undefined : 'Only allowed if type is "apiKey".',
          schema: { type: 'string' }
        },
        {
          name: 'openIdConnectUrl',
          versions: ['3.x.x'],
          required: true,
          notAllowed: type === 'openIdConnect' ? undefined : 'Only allowed if type is "openIdConnect".',
          schema: {
            type: 'string'
          }
        },
        {
          name: 'scheme',
          versions: ['3.x.x'],
          required: true,
          notAllowed: type === 'http' ? undefined : 'Only allowed if type is "http".',
          schema: { type: 'string' }
        },
        {
          name: 'scopes',
          versions: ['2.x'],
          required: true,
          notAllowed: type === 'oauth2' ? undefined : 'Only allowed if type is "oauth2".',
          schema: {
            type: 'object',
            allowsSchemaExtensions: false,
            additionalProperties: { type: 'string' }
          }
        },
        {
          name: 'tokenUrl',
          versions: ['2.x'],
          required: true,
          notAllowed: type === 'oauth2' && ['password', 'application', 'accessCode'].includes(definition.flow) ? undefined : 'Only allowed if type is "oauth2" and flow is one of "application", "accessCode", or "password".',
          schema: { type: 'string' }
        }
      ],
      validator: {
        after (data) {
          const { built } = data.context
          const { reference } = data.component

          if ('openIdConnectUrl' in built) {
            if (!rxUrl.test(built.openIdConnectUrl)) {
              const securitySchemeNotUrl = E.securitySchemeNotUrl({
                definition,
                locations: [{ node: definition, key: 'openIdConnectUrl', type: 'value' }],
                reference
              })
              exception.at('openIdConnectUrl').message(securitySchemeNotUrl)
            }
          }
        }
      }
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
