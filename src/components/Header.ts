import {
  Data,
  ComponentSchema, ExtendedComponent
} from './'
import { noop } from '../util'
import * as V from './helpers/common-validators'
import * as PartialSchema from './helpers/PartialSchema'
import * as Schema from './Schema'
import { base as dataTypeRoot, DataTypeStore } from './helpers/DataTypes'
import { Definition as Definition2 } from './v2/Header'
import { Definition as Definition3 } from './v3/Header'

export type Definition = Definition2 | Definition3

export const headerDataTypes = new DataTypeStore(dataTypeRoot)

export function schemaGenerator (Component: ExtendedComponent, data: Data): ComponentSchema<Definition> {
  const { definition } = data.context

  // copy schema from partial schema generator
  const schema = PartialSchema.schemaGenerator(Component, data)

  const partialValidator = {
    after: schema.validator?.after ?? noop
  }
  if (schema.validator === undefined) schema.validator = {}
  schema.validator.after = () => {
    V.defaultRequiredConflict(data)
    V.exampleExamplesConflict(data)
    partialValidator.after(data)
  }

  // the "type" is required for headers
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
        component: Schema.Schema
      }
    }
  )

  return schema
}
