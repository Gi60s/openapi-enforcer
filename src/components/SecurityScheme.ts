import { ComputeFunction, OASComponent } from './'
import { ComponentSchema } from './helpers/builder-validator-types'
import * as E from '../DefinitionException/methods'
import * as OAuthFlows from './v3/OAuthFlows'
import { SecurityScheme2 as Definition2, SecurityScheme3 as Definition3 } from './helpers/definition-types'

const rxUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
const isOauth2: ComputeFunction<string | undefined> = ({ built }) => built.type === 'oauth2' ? undefined : 'Only allowed if type is "oauth2".'
const isHttp: ComputeFunction<string | undefined> = ({ built }) => built.type === 'http' ? undefined : 'Only allowed if type is "http".'
const isApiKey: ComputeFunction<string | undefined> = (data) => {
  return data.built.type === 'apiKey' ? undefined : 'Only allowed if type is "apiKey".'
}
let securitySchemeSchema: ComponentSchema<Definition>

type Definition = Definition2 | Definition3

export class SecurityScheme extends OASComponent {
  extensions!: Record<string, any>
  description?: string
  in!: string
  name!: string
  type!: string

  static get schema (): ComponentSchema<Definition> {
    if (securitySchemeSchema === undefined) {
      securitySchemeSchema = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'type',
            required: true,
            schema: {
              type: 'string',
              enum (data) {
                return data.data.root.major === 2
                  ? ['basic', 'apiKey', 'oauth2']
                  : ['apiKey', 'http', 'oauth2', 'openIdConnect']
              }
            }
          },
          {
            name: 'authorizationUrl',
            versions: ['2.x'],
            required: true,
            notAllowed: isOauth2,
            schema: { type: 'string' }
          },
          {
            name: 'bearerFormat',
            versions: ['3.x.x'],
            notAllowed: isHttp,
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
            notAllowed: isOauth2,
            schema: { type: 'string' }
          },
          {
            name: 'flows',
            versions: ['3.x.x'],
            required: true,
            notAllowed: isOauth2,
            schema: {
              type: 'component',
              allowsRef: false,
              component: OAuthFlows.OAuthFlows
            }
          },
          {
            name: 'in',
            required: true,
            notAllowed: isApiKey,
            schema: {
              type: 'string',
              enum (data) {
                return data.data.root.major === 2
                  ? ['query', 'header']
                  : ['query', 'header', 'cookie']
              }
            }
          },
          {
            name: 'name',
            required: true,
            notAllowed: isApiKey,
            schema: { type: 'string' }
          },
          {
            name: 'openIdConnectUrl',
            versions: ['3.x.x'],
            required: true,
            notAllowed ({ built }) {
              return built.type === 'openIdConnect' ? undefined : 'Only allowed if type is "openIdConnect".'
            },
            schema: {
              type: 'string'
            }
          },
          {
            name: 'scheme',
            versions: ['3.x.x'],
            required: true,
            notAllowed: isHttp,
            schema: { type: 'string' }
          },
          {
            name: 'scopes',
            versions: ['2.x'],
            required: true,
            notAllowed: isOauth2,
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
            notAllowed ({ built }) {
              return built.type === 'oauth2' && ['password', 'application', 'accessCode'].includes(built.flow) ? undefined : 'Only allowed if type is "oauth2" and flow is one of "application", "accessCode", or "password".'
            },
            schema: { type: 'string' }
          }
        ],
        validator: {
          after (data) {
            const { built, exception } = data.context

            if ('openIdConnectUrl' in built) {
              if (!rxUrl.test(built.openIdConnectUrl)) {
                const securitySchemeNotUrl = E.securitySchemeNotUrl(data, { key: 'openIdConnectUrl', type: 'value' })
                exception.at('openIdConnectUrl').message(securitySchemeNotUrl)
              }
            }
          }
        }
      })
    }
    return securitySchemeSchema
  }
}
