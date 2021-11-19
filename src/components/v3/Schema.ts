import { ComponentSchema, Data, Dereferenced, Enforcer, Referencable, Version } from '../index'
import * as Core from '../Schema'
import * as Discriminator from '../v3/Discriminator'
import { Schema3 as Definition } from '../helpers/DefinitionTypes'
import { OpenAPI } from '../../v3'
import * as SchemaHelper from '../helpers/schema-functions'

export class Schema<HasReference=Dereferenced> extends Core.Schema<HasReference> {
  discriminator?: Discriminator.Discriminator
  anyOf?: Array<Referencable<HasReference, Schema<HasReference>>>
  deprecated?: boolean
  not?: Referencable<HasReference, Schema<HasReference>>
  nullable?: boolean
  oneOf?: Array<Referencable<HasReference, Schema<HasReference>>>
  writeOnly?: boolean

  constructor (definition: Definition, version?: Version) {
    super(Schema, definition, version, arguments[2])
  }

  discriminate<Schema> (value: any): SchemaHelper.DiscriminateResult<Schema> {
    if (this.discriminator === undefined) {
      throw Error('Unable to discriminate on an object with no discriminator.')
    } else {
      const key = this.discriminator?.propertyName
      const name = value?.[key] ?? ''
      if (name === '') return { key, name, schema: null }

      let schema = this.discriminator?.mapping?.[name]
      if (schema === undefined) {
        const openapi = this.enforcer.findAncestor<OpenAPI>(OpenAPI)
        schema = openapi?.components?.schemas?.[name]
      }
      return {
        key,
        name,
        schema: schema === undefined
          ? null
          : schema as unknown as Schema
      }
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
