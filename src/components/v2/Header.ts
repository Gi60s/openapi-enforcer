import { Version, Exception, Data, ComponentSchema } from '../'
import { headerDataTypes, schemaGenerator } from '../Header'
import * as PartialSchema from '../helpers/PartialSchema'

export interface Definition extends PartialSchema.Definition<Definition> {
  [key: `x-${string}`]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  description?: string
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export class Header extends PartialSchema.PartialSchema<Header> {
  readonly [key: `x-${string}`]: any
  readonly collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  readonly type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  constructor (definition: Definition, version?: Version) {
    super(Header, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#header-object'
  }

  // data types that apply to Header v2 and v3
  static dataType = headerDataTypes

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return schemaGenerator(Header, data)
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
