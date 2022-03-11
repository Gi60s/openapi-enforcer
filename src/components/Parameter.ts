import { Schema } from './'
import { Component, ComponentSchema } from './helpers/builder-validator-types'
import * as PartialSchema from './helpers/PartialSchema'
import * as Serializer from './helpers/serializer'
import * as V from './helpers/common-validators'
import { Example } from './v3/Example'
import { Items } from './v2/Items'
import { MediaType } from './v3/MediaType'
import { Schema as Schema3 } from './v3/Schema'
import {
  Parameter2 as Definition2, Parameter3,
  Parameter3 as Definition3, Reference,
  Schema3 as SchemaDefinition3
} from './helpers/definition-types'
import { LocationInput } from '../Exception'

type Definition = Definition2 | Definition3

interface ComponentMap {
  Parameter: Component
  Schema: Component
}

// This function is for Parameter3 which can define a schema on either the schema or content properties.
export function getSchema<Definition, Result> (definition: Definition): Result | Reference | undefined {
  const def = definition as unknown as Definition3
  if (def.schema !== undefined) return def.schema as unknown as Result
  if (def.content !== null && typeof def.content === 'object') {
    const mimeType = Object.keys(def.content)[0]
    if (mimeType !== undefined) return def.content[mimeType]?.schema as unknown as Result
  }
}

export function schemaGenerator (major: number, components: ComponentMap): ComponentSchema<Definition> {
  // copy schema from partial schema generator
  const schema: ComponentSchema = PartialSchema.schemaGenerator(Items)

  // all partial schema properties should be marked as version 2.x
  schema.properties?.forEach(prop => {
    prop.versions = ['2.x']
  })

  // add additional properties
  schema.properties?.unshift(
    {
      name: 'name',
      required: true,
      schema: { type: 'string' }
    },
    {
      name: 'in',
      required: true,
      schema: {
        type: 'string',
        enum (data) {
          return data.data.root.major === 2
            ? ['body', 'formData', 'header', 'path', 'query']
            : ['cookie', 'header', 'path', 'query']
        }
      },
      after (cache, value, built) {
        cache.isArray = built.type === 'array'
        cache.isQueryOrFormData = value === 'query' || value === 'formData'

        const { allowedStyles, defaultExplode, defaultStyle } = Serializer.getValidatorSettings(value)
        cache.allowedStyles = allowedStyles
        cache.defaultExplode = defaultExplode
        cache.defaultStyle = defaultStyle
      }
    }
  )

  schema.properties?.push(
    {
      name: 'allowEmptyValue',
      notAllowed ({ cache, data }) {
        const major = data.root.major
        return cache.isQueryOrFormData as boolean
          ? undefined
          : 'Only allowed if "in" is "query"' + (major === 2 ? ' or "formData"' : '') + '.'
      },
      schema: {
        type: 'boolean',
        default: false
      }
    },
    {
      name: 'allowReserved',
      versions: ['3.x.x'],
      notAllowed ({ built }) {
        return built.in === 'query' ? undefined : 'Property only allowed for "query" parameters.'
      },
      schema: {
        type: 'boolean',
        default: false
      }
    },
    {
      name: 'collectionFormat',
      versions: ['2.x'],
      notAllowed ({ cache }) {
        return cache.isArray as boolean ? undefined : 'Property only allowed when "type" is "array".'
      },
      schema: {
        type: 'string',
        default: 'csv',
        enum: ['csv', 'ssv', 'tsv', 'pipes', 'multi']
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
            component: MediaType,
            allowsRef: false
          }
        }
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
            component: Example,
            allowsRef: true
          }
        }
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
      versions: ['2.x'],
      notAllowed ({ built }) {
        return built.in === 'body' ? undefined : 'Property only allowed if "in" is set to "body".'
      },
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: components.Schema
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
    },
    {
      name: 'style',
      versions: ['3.x.x'],
      schema: {
        type: 'string',
        default ({ cache }) {
          return cache.defaultStyle
        }
        // enum ({ cache }) {
        //   return cache.allowedStyles
        // }
      }
    },
    {
      name: 'explode',
      versions: ['3.x.x'],
      schema: {
        type: 'boolean',
        default ({ cache }) {
          return cache.defaultExplode
        }
      }
    }
  )

  // modify the type property
  schema.adjustProperty('type', propertySchema => {
    const schema = propertySchema.schema as Schema

    // type is not allowed if "in" is body
    propertySchema.notAllowed = ({ built }) => {
      return built.in !== 'body' ? undefined : 'The "type" property can only be used when "in" is not set to "body".'
    }

    // make required if type is not body
    propertySchema.required = ({ built }) => {
      return built.in !== 'body'
    }

    // modify possible values to also include "file" if "in" is set to "formData"
    schema.enum = ({ built }) => {
      return built.in === 'formData'
        ? ['array', 'boolean', 'file', 'integer', 'number', 'string']
        : ['array', 'boolean', 'integer', 'number', 'string']
    }
  })

  schema.hook('after-validate', (data) => {
    const { major } = data.root
    const { exception, definition, built } = data.context
    const at = built.in

    V.defaultRequiredConflict(data)

    if ('allowEmptyValue' in built && major !== 2) {
      exception.add.notRecommended(data, { key: 'allowEmptyValue', type: 'key' }, 'Use of the property "allowEmptyValue" is not recommended because it is likely to be removed in the future.')
    }

    // if parameter in path then validate that required is true
    if (at === 'path' && definition.required !== true) {
      const location: LocationInput = 'required' in definition ? { node: definition, key: 'required', type: 'value' } : { node: definition }
      exception.add.pathParameterMustBeRequired(data, location, definition.name)
    }

    if (major === 2) {
      if (built.collectionFormat === 'multi' && built.in !== 'query' && built.in !== 'formData') {
        exception.at('collectionFormat').add.parameterCollectionMultiFormat(data, { key: 'collectionFormat', type: 'value' })
      }
    }

    if (major === 3) {
      const built = data.context.built as Definition3
      const schema = getSchema<Definition3, SchemaDefinition3>(built)

      V.exampleExamplesConflict(data)
      V.examplesMatchSchema(data, Schema3)
      V.parameterSchemaContent(data)

      // if style is specified then check that it aligns with the schema type

      const type = schema !== undefined && 'type' in schema ? schema.type ?? '' : ''
      const style = built.style ?? ''
      const styleMatchesLocation = Serializer.styleMatchesIn(built.in, style as any)
      const explode = built.explode as boolean
      if (type !== '') {
        if (!styleMatchesLocation) {
          exception.at('style').add.invalidStyle(data, { node: definition, key: 'style', type: 'value' }, style, type, built.in, explode, 'location')
        } else if (!Serializer.styleMatchesType(built.in, style, type, built.explode as boolean)) {
          exception.at('style').add.invalidStyle(data, { node: definition, key: 'style', type: 'value' }, style, type, built.in, explode, 'type')
        }
      }

      // ensure that the explode value is valid
      if ('explode' in built && styleMatchesLocation) {
        const validExplode = Serializer.styleMatchesExplode(built.in, style, built.explode as boolean)
        if (!validExplode) {
          exception.at('explode').add.invalidCookieExplode(data, { node: definition, key: 'explode', type: 'value' }, definition.name)
        }
      }
    }
  })

  return schema
}
