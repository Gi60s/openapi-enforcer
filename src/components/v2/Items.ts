import { Data, SpecMap, DefinitionException, Version, ComponentSchema } from '../index'
import * as PartialSchema from '../helpers/PartialSchema'
import { Items2 as Definition } from '../helpers/DefinitionTypes'

export class Items extends PartialSchema.PartialSchema<Items> {
  readonly [key: `x-${string}`]: any
  readonly collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  readonly type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  constructor (definition: Definition, version?: Version) {
    super(Items, definition, version, arguments[2])
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#items-object'
    }
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    // copy schema from partial schema generator
    const schema = PartialSchema.schemaGenerator(Items, data)

    // add collectionFormat property
    schema.properties?.push({
      name: 'collectionFormat',
      schema: {
        type: 'string',
        enum: ['csv', 'ssv', 'tsv', 'pipes']
      }
    })

    return schema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
