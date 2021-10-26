import { Data, SpecMap, Exception, Version, ComponentSchema } from '../index'
import * as PartialSchema from '../helpers/PartialSchema'
import { base as rootDataTypeStore, DataTypeStore } from '../helpers/DataTypes'

export interface Definition extends PartialSchema.Definition<Definition> {
  [key: `x-${string}`]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

const itemsDataType = new DataTypeStore(rootDataTypeStore)

export class Items extends PartialSchema.PartialSchema<Items> {
  readonly [key: `x-${string}`]: any
  readonly collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  readonly type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  constructor (definition: Definition, version?: Version) {
    super(Items, definition, version, arguments[2])
  }

  static dataType = itemsDataType

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

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
