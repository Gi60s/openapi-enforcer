import { IPartialSchema, IPartialSchemaDefinition } from '../Schema/ISchema'

export interface IItems2 extends IPartialSchema<IItems2Definition, IItems2> {
  [key: `x${string}`]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export interface IItems2Definition extends IPartialSchemaDefinition<IItems2Definition>{
  [key: `x-${string}`]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}
