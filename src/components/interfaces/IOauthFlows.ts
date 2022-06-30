import { IOAuthFlow } from './IOAuthFlow'

export interface IOAuthFlows {
  extensions: Record<string, any>
  authorizationCode?: IOAuthFlow
  clientCredentials?: IOAuthFlow
  implicit?: IOAuthFlow
  password?: IOAuthFlow
}
