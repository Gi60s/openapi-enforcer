import {
  Data,
  ComponentSchema, ExtendedComponent
} from './'
import { noop } from '../utils/util'
import * as V from './helpers/common-validators'
import * as PartialSchema from './helpers/PartialSchema'
import { base as dataTypeRoot, DataTypeStore } from './helpers/DataTypes'
import { Header2 as Definition2, Header3 as Definition3 } from './helpers/DefinitionTypes'

interface ComponentsMap {
  Header: ExtendedComponent
  Schema: ExtendedComponent
}

export const headerDataTypes = new DataTypeStore(dataTypeRoot)

export function schemaGenerator (components: ComponentsMap, data: Data): ComponentSchema<Definition2 | Definition3> {
  const { major } = data.root
  const { definition } = data.context

  // copy schema from partial schema generator
  const schema: ComponentSchema = major === 2
    ? PartialSchema.schemaGenerator(components.Header, data)
    : { allowsSchemaExtensions: true, properties: [] }

  const partialValidator = {
    after: schema.validator?.after ?? noop
  }
  if (schema.validator === undefined) schema.validator = {}
  schema.validator.after = () => {
    V.defaultRequiredConflict(data)
    V.exampleExamplesConflict(data)
    partialValidator.after(data)
  }

  // the "type" is required for headers v2
  const typePropertyDefinition = schema.properties?.find(v => v.name === 'type')
  if (typePropertyDefinition !== undefined) typePropertyDefinition.required = true

  // add additional property
  schema.properties?.push(
    {
      name: 'collectionFormat',
      versions: ['2.x'],
      notAllowed: definition.type === 'array' ? undefined : 'Data type must be an array.',
      schema: {
        type: 'string',
        enum: ['csv', 'ssv', 'tsv', 'pipes'],
        default: 'csv'
      }
    },
    {
      name: 'deprecated',
      versions: ['3.x.x'],
      schema: {
        type: 'boolean',
        default: false
      }
    },
    {
      name: 'description',
      schema: { type: 'string' }
    },
    {
      name: 'style',
      versions: ['3.x.x'],
      schema: {
        type: 'string',
        default: 'simple',
        enum: ['simple']
      }
    },
    {
      name: 'explode',
      versions: ['3.x.x'],
      schema: {
        type: 'boolean',
        default: false
      }
    },
    {
      name: 'required',
      schema: {
        type: 'boolean',
        default: false
      }
    },
    {
      name: 'schema',
      versions: ['3.x.x'],
      schema: {
        type: 'component',
        allowsRef: true,
        component: components.Schema
      }
    }
  )

  return schema
}
