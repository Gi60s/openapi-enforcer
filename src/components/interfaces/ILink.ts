import { IServer } from './IServer'

export interface ILink {
  extensions: Record<string, any>
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: Record<string, string>
  requestBody?: any
  server?: IServer
}
