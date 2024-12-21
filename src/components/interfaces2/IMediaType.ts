import { IEncoding3, IEncoding3Definition } from './IEncoding'
import { IExample3, IExample3Definition } from './IExample'
import { IReferenceDefinition } from './IReference'
import { ISchema3, ISchema3Definition } from './ISchema'
import { IEnforcerExtensionDefinition } from './IIndex'

export interface IMediaType3 {
  extensions: Record<string, any>
  encoding?: Record<string, IEncoding3>
  example?: any
  examples?: Record<string, IExample3>
  schema?: ISchema3
}

export interface IMediaType3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  encoding?: Record<string, IEncoding3Definition | IReferenceDefinition>
  example?: any
  examples?: Record<string, IExample3Definition | IReferenceDefinition>
  schema?: ISchema3Definition | IReferenceDefinition
}
