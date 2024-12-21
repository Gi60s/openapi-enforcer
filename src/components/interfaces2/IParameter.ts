import { IExample3, IExample3Definition } from './IExample'
import { IItems2, IItems2Definition } from './IItems'
import { ISchema2, ISchema3, IPartialSchemaDefinition, ISchema2Definition, ISchema3Definition } from './ISchema'
import { IMediaType3Definition } from './IMediaType'
import { IReferenceDefinition } from './IReference'
import { IEnforcerExtensionDefinition } from './IIndex'

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
  examples?: Record<string, IExample3>
  explode: boolean
  style: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'

  getExample: (source: 'random' | 'schema' | 'example' | Array<'random' | 'schema' | 'example'>, name?: string) => any
}

export interface IParameter2Definition extends IPartialSchemaDefinition<IItems2Definition> {
  name: string
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  description?: string
  required?: boolean
  schema?: ISchema2Definition
  type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'
}

export interface IParameter3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  allowReserved?: boolean
  content?: Record<string, IMediaType3Definition>
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, IExample3Definition | IReferenceDefinition>
  explode?: boolean
  required?: boolean
  schema?: ISchema3Definition | IReferenceDefinition
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'
}

export type ISerializedParameterMap = Record<string, string | string[] | undefined>
