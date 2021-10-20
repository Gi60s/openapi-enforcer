import {
  OASComponent,
  Version,
  Exception,
  Dereferenced,
  ComponentSchema
} from './'
import * as Schema from './Schema'

export interface Definition {
  [name: string]: Schema.Definition2
}

const schemaDefinition: ComponentSchema<Definition> = {
  allowsSchemaExtensions: false,
  additionalProperties: {
    type: 'component',
    allowsRef: false,
    component: Schema.Schema
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Definitions<HasReference=Dereferenced> extends OASComponent {
  readonly [name: string]: Schema.Schema<HasReference>

  constructor (definition: Definition, version?: Version) {
    super(Definitions, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#definitions-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return schemaDefinition
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
