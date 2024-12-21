import { IServerVariable3, IServerVariable3Definition } from './IServerVariable'
import { IEnforcerExtensionDefinition } from './IIndex'

export interface IServer3 {
  extensions: Record<string, any>
  description?: string
  url: string
  variables?: Record<string, IServerVariable3>
}

export interface IServer3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  description?: string
  url: string
  variables?: Record<string, IServerVariable3Definition>
}
