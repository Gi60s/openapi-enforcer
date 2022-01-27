import { Component, ComponentSchema } from './helpers/builder-validator-types'
import * as V from './helpers/common-validators'
import * as PartialSchema from './helpers/PartialSchema'
import { Header2 as Definition2, Header3 as Definition3 } from './helpers/definition-types'

interface ComponentsMap {
  Header: Component
  Schema: Component
}

export function schemaGenerator (major: number, components: ComponentsMap): ComponentSchema<Definition2 | Definition3> {
  // copy schema from partial schema generator
  const schema: ComponentSchema = major === 2
    ? PartialSchema.schemaGenerator(components.Header)
    : new ComponentSchema({ allowsSchemaExtensions: true, properties: [] })

  schema.hook('after-validate', (data) => {
    V.defaultRequiredConflict(data)
    V.exampleExamplesConflict(data)
  })

  // the "type" is required for headers v2
  const typePropertyDefinition = schema.properties?.find(v => v.name === 'type')
  if (typePropertyDefinition !== undefined) typePropertyDefinition.required = true

  // add additional property
  schema.properties?.push(
    {
      name: 'collectionFormat',
      versions: ['2.x'],
      notAllowed ({ cache }) {
        return cache.isArray === true ? undefined : 'Property "type" must equal "array" to use "collectionFormat".'
      },
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
