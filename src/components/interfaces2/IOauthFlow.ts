import { IEnforcerExtensionDefinition } from './IIndex'

export interface IOAuthFlow3 {
  extensions: Record<string, any>
  authorizationUrl?: string
  refreshUrl?: string
  scopes: string[]
  tokenUrl?: string
}

export interface IOAuthFlow3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  authorizationUrl?: string
  refreshUrl?: string
  scopes: Record<string, string>
  tokenUrl?: string
}
