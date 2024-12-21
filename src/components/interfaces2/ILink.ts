import { IServer3, IServer3Definition } from './IServer'
import { IEnforcerExtensionDefinition } from './IIndex'

export interface ILink3 {
  extensions: Record<string, any>
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: Record<string, string>
  requestBody?: any
  server?: IServer3
}

export interface ILink3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: Record<string, any>
  requestBody?: any
  server?: IServer3Definition
}
