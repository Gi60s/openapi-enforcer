import { IHeader2, IHeader3 } from './IHeader'
import { ILink } from './ILink'
import { IMediaType } from './IMediaType'
import { ISchema2 } from './ISchema'

export interface IResponse2 {
  examples?: Record<string, any>
  headers?: Record<string, IHeader2>
  schema?: ISchema2
}

export interface IResponse3 {
  content?: Record<string, IMediaType>
  headers?: Record<string, IHeader3>
  links?: Record<string, ILink>
}
