import { ComponentSchema, Data, Dereferenced, Referencable, Version } from '../index'
import * as Core from '../Schema'
import * as Discriminator from '../v3/Discriminator'
import { Schema3 as Definition } from '../helpers/DefinitionTypes'

export class Schema<HasReference=Dereferenced> extends Core.Schema<HasReference> {
  readonly discriminator?: Discriminator.Discriminator
  readonly anyOf?: Array<Referencable<HasReference, Schema<HasReference>>>
  readonly deprecated?: boolean
  readonly not?: Referencable<HasReference, Schema<HasReference>>
  readonly nullable?: boolean
  readonly oneOf?: Array<Referencable<HasReference, Schema<HasReference>>>
  readonly writeOnly?: boolean

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
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#schema-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#schema-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#schema-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#schema-object'
  }
}
