import { DefinitionException } from '../../Exception'
import { componentValidate } from '../'
import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { schemaGenerator } from '../Header'
import { PartialSchema } from '../helpers/PartialSchema'
import { Header2 as Definition } from '../helpers/definition-types'

let headerSchema: ComponentSchema<Definition>

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

  static get schema (): ComponentSchema<Definition> {
    if (headerSchema === undefined) {
      headerSchema = schemaGenerator(2, {
        Header
      }) as ComponentSchema<Definition>
    }
    return headerSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
