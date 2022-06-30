import { PartialSchema } from './ISchema'

export interface IItems extends PartialSchema<IItems> {
  extensions: Record<string, any>
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}
