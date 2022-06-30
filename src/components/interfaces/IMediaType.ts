import { IEncoding } from './IEncoding'
import { IExample } from './IExample'
import { ISchema3 } from './ISchema'

export interface IMediaType {
  extensions: Record<string, any>
  encoding?: Record<string, IEncoding>
  example?: any
  examples?: Record<string, IExample>
  schema?: ISchema3
}
