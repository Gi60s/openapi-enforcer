import {
  Data,
  OASComponent,
  Dereferenced,
  Version,
  Exception,
  Referencable, ComponentSchema
} from '../'
import { headerDataTypes, schemaGenerator } from '../Header'
import { Example } from './Example'
import { Schema } from './Schema'
import { Header3 as Definition } from '../helpers/DefinitionTypes'

export class Header<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Referencable<HasReference, Example>>
  explode?: boolean
  required?: boolean
  schema?: Referencable<HasReference, Schema>
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

  // data types that apply to Header v2 and v3
  static dataType = headerDataTypes

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return schemaGenerator({
      Header,
      Schema: Schema
    }, data)
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
