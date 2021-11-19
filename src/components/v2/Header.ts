import { Version, DefinitionException, Data, ComponentSchema } from '../'
import { Schema } from './Schema'
import { schemaGenerator } from '../Header'
import { PartialSchema } from '../helpers/PartialSchema'
import { Header2 as Definition } from '../helpers/DefinitionTypes'

export class Header extends PartialSchema<Header> {
  extensions!: Record<string, any>
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  constructor (definition: Definition, version?: Version) {
    super(Header, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#header-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return schemaGenerator({
      Header,
      Schema
    }, data)
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
