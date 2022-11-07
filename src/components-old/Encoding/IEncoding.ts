import { IHeader3, IHeader3Definition } from '../Header/IHeader'
import { IReferenceDefinition } from '../Reference/IReference'
import { IComponentClass } from '../IComponent'

export interface IEncoding3 extends IComponentClass<IEncoding3Definition, IEncoding3>{
  [key: `x${string}`]: any
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, IHeader3>
  style: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
}

export interface IEncoding3Definition {
  [key: `x-${string}`]: any
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, IHeader3Definition | IReferenceDefinition>
  style?: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
}
