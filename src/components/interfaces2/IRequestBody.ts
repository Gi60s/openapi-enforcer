import { IMediaType3, IMediaType3Definition } from './IMediaType'
import { IEnforcerExtensionDefinition } from './IIndex'

export interface IRequestBody3 {
  extensions: Record<string, any>
  description?: string
  content: Record<string, IMediaType3>
  required?: boolean
}

export interface IRequestBody3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  description?: string
  content: Record<string, IMediaType3Definition>
  required?: boolean
}
