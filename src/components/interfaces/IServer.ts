import { IServerVariable } from './IServerVariable'

export interface IServer {
  extensions: Record<string, any>
  description?: string
  url: string
  variables?: Record<string, IServerVariable>
}
