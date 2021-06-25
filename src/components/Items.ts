import { initializeData, SchemaObject, SpecMap, Exception, Version } from './'
import * as PartialSchema from './helpers/PartialSchema'
import * as DataType from './helpers/DataTypes'

export interface Definition extends PartialSchema.Definition<Definition> {
  [key: `x-${string}`]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export class Items extends PartialSchema.PartialSchema<Items> {
  readonly [key: `x-${string}`]: any
  readonly collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  readonly type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', Items, definition, version, arguments[2])
    super(data)
  }

  static defineDataType (type: DataType.Type, format: string, definition: DataType.Definition): void {
    PartialSchema.defineDataType(Items, type, format, definition)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#items-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    // copy schema from partial schema generator
    const schema = PartialSchema.schemaGenerator(Items)

    // add collectionFormat property
    schema.properties?.push({
      name: 'collectionFormat',
      schema: {
        type: 'string',
        enum: () => ['csv', 'ssv', 'tsv', 'pipes']
      }
    })

    return schema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
