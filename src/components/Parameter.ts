import { Schema } from './'
import { Component, ComponentSchema } from './helpers/builder-validator-types'
import * as PartialSchema from './helpers/PartialSchema'
import * as Serilizer from './helpers/serializer'
import * as V from './helpers/common-validators'
import { Schema as Schema3 } from './v3/Schema'
import {
  Parameter2 as Definition2,
  Parameter3 as Definition3,
  Schema3 as SchemaDefinition3
} from './helpers/definition-types'
import { LocationInput } from '../Exception'

type Definition = Definition2 | Definition3

interface ComponentMap {
  Parameter: Component
  Schema: Component
}

export function schemaGenerator (major: number, components: ComponentMap): ComponentSchema<Definition> {
  // copy schema from partial schema generator
  const schema: ComponentSchema = PartialSchema.schemaGenerator(components.Parameter)

  // all partial schema properties should be marked as version 2.x
  schema.properties?.forEach(prop => {
    prop.versions = ['2.x']
  })

  // add additional properties
  schema.properties?.push(
    {
      name: 'name',
      required: true,
      schema: { type: 'string' }
    },
    {
      name: 'in',
      required: true,
      schema: { type: 'string' },
      after (cache, value, built) {
        cache.isArray = built.type === 'array'
        cache.isQueryOrFormData = value === 'query' || value === 'formData'

        const { allowedStyles, defaultExplode, defaultStyle } = Serilizer.getValidatorSettings(value)
        cache.allowedStyles = allowedStyles
        cache.defaultExplode = defaultExplode
        cache.defaultStyle = defaultStyle
      }
    },
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
        return built.at === 'query' ? undefined : 'Property only allowed for "query" parameters.'
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
        return cache.isArray as boolean && cache.isQueryOrFormData as boolean ? undefined : 'Property only allowed when "type" is "array" and when "in" is "formData" or "query".'
      },
      schema: {
        type: 'string',
        default: 'csv',
        enum: ['csv', 'ssv', 'tsv', 'pipes', 'multi']
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
            type: 'any'
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
        },
        enum ({ cache }) {
          return cache.allowedStyles
        }
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

  // modify the type property to also include "file" if "in" is set to "formData"
  schema.adjustProperty('type', propertySchema => {
    (propertySchema.schema as Schema).enum = ({ built }) => {
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

    if (major === 3) {
      V.exampleExamplesConflict(data)
      V.examplesMatchSchema(data, Schema3)

      // if style is specified then check that it aligns with the schema type
      const built = data.context.built as Definition3
      const type = (built.schema as SchemaDefinition3)?.type ?? ''
      const style = built.style ?? ''
      if (type !== '') {
        const validStyle = Serilizer.styleMatchesType(built.in, style, type, built.explode as boolean)
        if (!validStyle) {
          exception.at('style').add.invalidStyle(data, { node: definition, key: 'style', type: 'value' }, style, type)
        }
      }

      // ensure that the explode value is valid
      if ('explode' in built) {
        const validExplode = Serilizer.styleMatchesExplode(built.in, style, built.explode as boolean)
        if (!validExplode) {
          exception.at('explode').add.invalidCookieExplode(data, { node: definition, key: 'explode', type: 'value' }, definition.name)
        }
      }

      // TODO: If type is "file", the consumes MUST be either "multipart/form-data", " application/x-www-form-urlencoded" or both and the parameter MUST be in "formData".
    }
  })

  return schema
}
