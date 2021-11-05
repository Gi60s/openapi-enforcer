import * as PartialSchema from '../helpers/PartialSchema'
import { Items } from './Items'
import { Schema } from './Schema'
import { ComponentSchema, Data, Dereferenced, DefinitionException, Referencable, Version } from '../index'
import * as Core from '../Parameter'
import { Parameter2 as Definition } from '../helpers/DefinitionTypes'

export class Parameter<HasReference=Dereferenced> extends PartialSchema.PartialSchema<Items> {
  readonly [key: `x-${string}`]: any
  readonly name!: string
  readonly in!: 'body' | 'cookie' | 'formData' | 'header' | 'path' | 'query'
  readonly allowEmptyValue?: boolean
  readonly description?: string
  readonly required?: boolean
  readonly schema?: Referencable<HasReference, Schema>
  readonly collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  readonly type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'

  constructor (definition: Definition, version?: Version) {
    super(Parameter, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#parameter-object'
  }

  static schemaGenerator (data: Data<Definition>): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Parameter,
      Schema: Schema
    }, data)
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
