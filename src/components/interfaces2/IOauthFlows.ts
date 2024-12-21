import { IOAuthFlow3, IOAuthFlow3Definition } from './IOauthFlow'
import { IEnforcerExtensionDefinition } from './IIndex'

export interface IOAuthFlows3 {
  extensions: Record<string, any>
  authorizationCode?: IOAuthFlow3
  clientCredentials?: IOAuthFlow3
  implicit?: IOAuthFlow3
  password?: IOAuthFlow3
}

export interface IOAuthFlows3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  authorizationCode?: IOAuthFlow3Definition
  clientCredentials?: IOAuthFlow3Definition
  implicit?: IOAuthFlow3Definition
  password?: IOAuthFlow3Definition
}
