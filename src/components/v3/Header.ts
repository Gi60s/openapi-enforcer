import { OASComponent, componentValidate } from '../'
import { ComponentSchema, Data, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { schemaGenerator } from '../Header'
import { Example } from './Example'
import { Schema } from './Schema'
import { Header3 as Definition } from '../helpers/definition-types'

export class Header extends OASComponent<Definition, typeof Header> {
  extensions!: Record<string, any>
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Example>
  explode?: boolean
  required?: boolean
  schema?: Schema
  style?: 'simple'

  constructor (definition: Definition, version?: Version) {
    super(Header, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#header-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#header-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#header-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#header-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return schemaGenerator({
      Header,
      Schema: Schema
    }, data)
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
