import { Version, Exception, Data, ComponentSchema } from '../'
import { Schema } from './Schema'
import { headerDataTypes, schemaGenerator } from '../Header'
import { PartialSchema } from '../helpers/PartialSchema'
import { Header2 as Definition } from '../helpers/DefinitionTypes'

export class Header extends PartialSchema<Header> {
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
    return schemaGenerator({
      Header,
      Schema
    }, data)
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
