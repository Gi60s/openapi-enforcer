import { IHeader2, IHeader3, IHeader2Definition, IHeader3Definition } from '../Header/IHeader'
import { ILink3, ILink3Definition } from './ILink'
import { IMediaType3, IMediaType3Definition } from './IMediaType'
import { IReferenceDefinition } from './IReference'
import { ISchema2, ISchema2Definition } from './ISchema'
import { IEnforcerExtensionDefinition } from './IIndex'

export interface IResponse2 {
  examples?: Record<string, any>
  headers?: Record<string, IHeader2>
  schema?: ISchema2
}

export interface IResponse3 {
  content?: Record<string, IMediaType3>
  headers?: Record<string, IHeader3>
  links?: Record<string, ILink3>
}

interface IResponseBaseDefinition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  description: string
}

export interface IResponse2Definition extends IResponseBaseDefinition {
  examples?: Record<string, any>
  headers?: Record<string, IHeader2Definition>
  schema?: ISchema2Definition | IReferenceDefinition
}

export interface IResponse3Definition extends IResponseBaseDefinition {
  content?: Record<string, IMediaType3Definition>
  headers?: Record<string, IHeader3Definition | IReferenceDefinition>
  links?: Record<string, ILink3Definition | IReferenceDefinition>
}
