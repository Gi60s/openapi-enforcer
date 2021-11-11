import { ComponentSchema, Data, Dereferenced, Enforcer, Referencable, Version } from '../index'
import * as Core from '../Schema'
import * as Discriminator from '../v3/Discriminator'
import { Schema3 as Definition } from '../helpers/DefinitionTypes'
import { OpenAPI } from '../../v3'

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

  discriminate (value: any): { key: string, name: string, schema: Schema | null } {
    if (this.discriminator === undefined) {
      throw Error('Unable to discriminate on an object with no discriminator.')
    } else {
      const key = this.discriminator?.propertyName
      const name = value?.[key] ?? ''
      if (name === '') return { key, name, schema: null }

      let schema = this.discriminator?.mapping?.[name]
      if (schema === undefined) {
        const openapi = this[Enforcer].findAncestor<OpenAPI>(OpenAPI)
        schema = openapi?.components?.schemas?.[name]
      }
      return { key, name, schema: schema ?? null }
    }
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
