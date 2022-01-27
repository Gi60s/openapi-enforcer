import { ComponentSchema, Data, Version } from '../helpers/builder-validator-types'
import * as Core from '../Schema'
import * as Discriminator from '../v3/Discriminator'
import { Schema3 as Definition } from '../helpers/definition-types'
import { OpenAPI } from '../../v3'
import * as SchemaHelper from '../helpers/schema-functions'

let schemaSchema: ComponentSchema<Definition>

export class Schema extends Core.Schema {
  discriminator?: Discriminator.Discriminator
  anyOf?: Schema[]
  deprecated?: boolean
  not?: Schema
  nullable?: boolean
  oneOf?: Schema[]
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

  static get schema (): ComponentSchema<Definition> {
    if (schemaSchema === undefined) {
      schemaSchema = Core.schemaGenerator({
        Discriminator: Discriminator.Discriminator,
        Schema
      }) as ComponentSchema<Definition>
    }
    return schemaSchema
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#schema-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#schema-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#schema-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#schema-object'
  }
}
