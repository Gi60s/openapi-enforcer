import { Component, ComponentSchema } from './helpers/builder-validator-types'
import * as V from './helpers/common-validators'
import * as PartialSchema from './helpers/PartialSchema'
import { Header2 as Definition2, Header3 as Definition3 } from './helpers/definition-types'

interface ComponentsMap {
  Example?: Component // v3
  Header: Component
  MediaType?: Component // v3
  Schema?: Component // v3
}

export function schemaGenerator (major: number, components: ComponentsMap): ComponentSchema<Definition2 | Definition3> {
  // copy schema from partial schema generator
  const schema: ComponentSchema = PartialSchema.schemaGenerator(components.Header)

  // all partial schema properties should be marked as version 2.x
  schema.properties?.forEach(prop => {
    prop.versions = ['2.x']
  })

  schema.hook('after-validate', (data) => {
    const major = data.root.major

    if (major === 2) {
      V.defaultRequiredConflict(data)
    } else {
      V.exampleExamplesConflict(data)
      V.parameterSchemaContent(data)
      V.examplesMatchSchema(data, components.Schema)
    }
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
        component: components.Schema as Component
      }
    },
    {
      name: 'content',
      versions: ['3.x.x'],
      schema: {
        type: 'object',
        allowsSchemaExtensions: false,
        additionalProperties: {
          schema: {
            type: 'component',
            allowsRef: false,
            component: components.MediaType as Component
          }
        }
      }
    },
    {
      name: 'example',
      versions: ['3.x.x'],
      schema: {
        type: 'any'
      }
    },
    {
      name: 'examples',
      versions: ['3.x.x'],
      schema: {
        type: 'object',
        allowsSchemaExtensions: false,
        additionalProperties: {
          schema: {
            type: 'component',
            component: components.Example as Component,
            allowsRef: true
          }
        }
      }
    }
  )

  return schema
}
