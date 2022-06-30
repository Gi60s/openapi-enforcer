import { IMediaType } from './IMediaType'

export interface IRequestBody {
  extensions: Record<string, any>
  description?: string
  content: Record<string, IMediaType>
  required?: boolean
}
