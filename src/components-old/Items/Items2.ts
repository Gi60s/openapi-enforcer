import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { IItems2, IItems2Definition } from './IItems'
import { ISchemaProcessorData } from '../ISchemaProcessor'
import { IComponentSchemaObject } from '../IComponentSchema'
import { getBaseSchema } from '../Schema/SchemaBase'

let itemsSchema: IComponentSchemaObject

export class Items extends EnforcerComponent<IItems2Definition, Items> implements IItems2 {
  [key: `x${string}`]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  constructor (definition: IItems2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#items-object'
  }

  static validate (definition: IItems2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static getSchema (data: ISchemaProcessorData): IComponentSchemaObject {
    if (itemsSchema === undefined) {
      itemsSchema = getBaseSchema(data, Items)

      // type property is required
      const typeProperty = itemsSchema.properties?.find(property => property.name === 'type')
      if (typeProperty !== undefined) typeProperty.required = true

      // add collectionFormat property
      itemsSchema.properties?.push({
        name: 'collectionFormat',
        notAllowed ({ built }) {
          return built.type !== 'array' ? 'The "collectionFormat" can only be applied with the type is "array"' : undefined
        },
        schema: {
          type: 'string',
          enum: ['csv', 'ssv', 'tsv', 'pipes'],
          default: 'csv'
        }
      })
    }
    return itemsSchema
  }
}
