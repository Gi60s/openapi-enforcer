import { IHeader3 } from './IHeader'

export interface IEncoding {
  extensions: Record<string, any>
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, IHeader3>
  style: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
}
