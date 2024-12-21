import { IEnforcerExtensionDefinition } from './IIndex'

export interface IServerVariable3 {
  extensions: Record<string, any>
  enum?: string[]
  default: string
  description?: string
}

export interface IServerVariable3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  enum?: string[]
  default: string
  description?: string
}
