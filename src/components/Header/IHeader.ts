import { IPartialSchema, IPartialSchemaDefinition, ISchema3, ISchema3Definition } from '../interfaces2/ISchema'
import { IExample3, IExample3Definition } from '../interfaces2/IExample'
import { IMediaType3, IMediaType3Definition } from '../interfaces2/IMediaType'
import { IReferenceDefinition } from '../interfaces2/IReference'
import { IEnforcerExtensionDefinition } from '../interfaces2/IIndex'

export interface IHeader2 extends IPartialSchema<IHeader2>{
  extensions: Record<string, any>
  collectionFormat: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export interface IHeader3 {
  extensions: Record<string, any>
  content?: Record<string, IMediaType3>
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, IExample3>
  explode?: boolean
  required?: boolean
  schema?: ISchema3
  style?: 'simple'
}

export interface IHeader2Definition extends IPartialSchemaDefinition<IHeader2Definition>{
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  description?: string
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export interface IHeader3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  content?: Record<string, IMediaType3Definition>
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, IExample3Definition | IReferenceDefinition>
  explode?: boolean
  required?: boolean
  schema?: ISchema3Definition | IReferenceDefinition
  style?: 'simple'
}
