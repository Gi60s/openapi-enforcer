import { OASComponent, ValidatorData, ComponentSchema } from './'
import * as E from '../DefinitionException/methods'
import * as OAuthFlows from './v3/OAuthFlows'
import { SecurityScheme2 as Definition2, SecurityScheme3 as Definition3 } from './helpers/definition-types'

const rxUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

type Definition = Definition2 | Definition3

export class SecurityScheme extends OASComponent {
  extensions!: Record<string, any>
  description?: string
  in!: string
  name!: string
  type!: string

  static schemaGenerator (data: ValidatorData): ComponentSchema<Definition> {
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
            additionalProperties: {
              schema: { type: 'string' }
            }
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
}
