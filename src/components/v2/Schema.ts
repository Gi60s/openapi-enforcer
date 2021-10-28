import { ComponentSchema, Data, Dereferenced, Version } from '../index'
import * as Core from '../Schema'
import * as Discriminator from '../v3/Discriminator'
import { Schema2 as Definition } from '../helpers/DefinitionTypes'

export class Schema<HasReference=Dereferenced> extends Core.Schema<HasReference> {
  readonly discriminator?: string

  constructor (definition: Definition, version?: Version) {
    super(Schema, definition, version, arguments[2])
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Discriminator: Discriminator.Discriminator,
      Schema
    }, data)
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#schema-object'
  }
}
