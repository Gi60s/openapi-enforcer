import { IHeader3, IHeader3Definition } from '../Header/IHeader'
import { IReferenceDefinition } from './IReference'
import { IEnforcerExtensionDefinition } from './IIndex'

export interface IEncoding3 {
  extensions: Record<string, any>
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, IHeader3>
  style: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
}

export interface IEncoding3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, IHeader3Definition | IReferenceDefinition>
  style?: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
}
