import { DefinitionException } from '../../DefinitionException'
import { componentValidate } from '../index'
import { ComponentSchema, Data, Version } from '../helpers/builder-validator-types'
import * as PartialSchema from '../helpers/PartialSchema'
import { Items2 as Definition } from '../helpers/definition-types'

export class Items extends PartialSchema.PartialSchema<Items> {
  extensions!: Record<string, any>
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  constructor (definition: Definition, version?: Version) {
    super(Items, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#items-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    // copy schema from partial schema generator
    const schema = PartialSchema.schemaGenerator(Items, data)

    // add collectionFormat property
    const type = data.context.definition.type
    schema.properties?.push({
      name: 'collectionFormat',
      notAllowed: type !== 'array' ? 'The "collectionFormat" can only be applied with the type is "array"' : undefined,
      schema: {
        type: 'string',
        enum: ['csv', 'ssv', 'tsv', 'pipes'],
        default: 'csv'
      }
    })

    return schema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
