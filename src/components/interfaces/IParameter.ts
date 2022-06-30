import { IExample } from './IExample'
import { ISchema2, ISchema3 } from './ISchema'

interface IParameterBase<Schema> {
  extensions: Record<string, any>
  name: string
  allowEmptyValue?: boolean
  description?: string
  required?: boolean
  schema?: Schema

  parseValue: (value: string[]) => Result<any>
}

export interface IParameter2 extends IParameterBase<ISchema2>{
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'

  getExample: (source: 'random' | 'schema' | Array<'random' | 'schema'>) => any
}

export interface IParameter3 extends IParameterBase<ISchema3> {
  in: 'cookie' | 'header' | 'path' | 'query'
  schema?: ISchema3
  allowReserved?: boolean
  deprecated?: boolean
  example?: any
  examples?: Record<string, IExample>
  explode: boolean
  style: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'

  getExample: (source: 'random' | 'schema' | 'example' | Array<'random' | 'schema' | 'example'>, name?: string) => any
}

export type ISerializedParameterMap = Record<string, string | string[] | undefined>
