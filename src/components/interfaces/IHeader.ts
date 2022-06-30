import { Example } from '../v3/Example'
import { Schema } from '../v3/Schema'

export interface IHeader2 {
  extensions: Record<string, any>
  collectionFormat: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export interface IHeader3 {
  extensions: Record<string, any>
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Example>
  explode?: boolean
  required?: boolean
  schema?: Schema
  style?: 'simple'
}
