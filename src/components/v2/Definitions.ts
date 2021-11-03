import {
  OASComponent,
  Version,
  DefinitionException,
  Dereferenced,
  ComponentSchema
} from '../index'
import { Schema2 as Definition } from '../helpers/DefinitionTypes'
import { Schema } from './Schema'

const schemaDefinition: ComponentSchema<Definition> = {
  allowsSchemaExtensions: false,
  additionalProperties: {
    type: 'component',
    allowsRef: false,
    component: Schema
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Definitions<HasReference=Dereferenced> extends OASComponent {
  readonly [name: string]: Schema<HasReference>

  constructor (definition: Definition, version?: Version) {
    super(Definitions, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#definitions-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return schemaDefinition
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
