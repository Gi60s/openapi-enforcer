import * as PartialSchema from '../helpers/PartialSchema'
import * as Items from './Items'
import * as Schema from '../Schema'
import { ComponentSchema, Data, Dereferenced, Exception, Referencable, SchemaProperty, Version } from '../index'
import * as Example from '../v3/Example'
import { noop } from '../../util'
import * as V from '../helpers/common-validators'
import * as E from '../../Exception/methods'
import { SchemaDefinition3 } from '../../index'
import { parameterDataType, schemaGenerator } from '../Parameter'

export interface Definition extends PartialSchema.Definition<Items.Definition> {
  [key: `x-${string}`]: any
  name: string
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  default?: any
  description?: string
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Items.Definition
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
  pattern?: string
  required?: boolean
  schema?: Schema.Definition2
  type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'
  uniqueItems?: boolean
}

export class Parameter<HasReference=Dereferenced> extends PartialSchema.PartialSchema<Items.Items> {
  readonly [key: `x-${string}`]: any
  readonly name!: string
  readonly in!: 'body' | 'cookie' | 'formData' | 'header' | 'path' | 'query'
  readonly allowEmptyValue?: boolean
  readonly description?: string
  readonly required?: boolean
  readonly schema?: Referencable<HasReference, Schema.Schema>

  // v2 properties (in addition to those added by PartialSchema
  readonly collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  readonly type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'

  // v3 properties
  readonly allowReserved?: boolean
  readonly deprecated?: boolean
  readonly example?: any
  readonly examples?: Record<string, Referencable<HasReference, Example.Example>>

  readonly explode?: boolean
  readonly style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'

  constructor (definition: Definition, version?: Version) {
    super(Parameter, definition, version, arguments[2])
  }

  static dataType = parameterDataType

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#parameter-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#parameter-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#parameter-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#parameter-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#parameter-object'
  }

  static schemaGenerator (data: Data<Definition>): ComponentSchema<Definition> {
    return schemaGenerator(Parameter, data)
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
