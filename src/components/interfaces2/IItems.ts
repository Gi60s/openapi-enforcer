import { IPartialSchema, IPartialSchemaDefinition } from './ISchema'

export interface IItems2 extends IPartialSchema<IItems2> {
  extensions: Record<string, any>
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export interface IItems2Definition extends IPartialSchemaDefinition<IItems2Definition>{
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}
