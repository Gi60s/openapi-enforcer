import {
  Data,
  SchemaProperty,
  ComponentSchema, ExtendedComponent
} from './'
import * as PartialSchema from './helpers/PartialSchema'
import * as Serilizer from './helpers/serializer'
import { noop } from '../utils/util'
import * as V from './helpers/common-validators'
import * as E from '../DefinitionException/methods'
import { Schema as Schema3 } from './v3/Schema'
import {
  Parameter2 as Definition2,
  Parameter3 as Definition3,
  Schema3 as SchemaDefinition3
} from './helpers/DefinitionTypes'

type Definition = Definition2 | Definition3

interface ComponentMap {
  Parameter: ExtendedComponent
  Schema: ExtendedComponent
}

export function schemaGenerator (components: ComponentMap, data: Data): ComponentSchema<Definition> {
  const schema: ComponentSchema<Definition> = data.root.major === 2
    ? PartialSchema.schemaGenerator(components.Parameter, data)
    : { allowsSchemaExtensions: false, properties: [] }

  const { definition } = data.context
  const at = definition.in
  const type = 'type' in definition ? definition.type : ''
  const isQueryOrFormData = at === 'query' || at === 'formData'
  const { allowedStyles, defaultExplode, defaultStyle } = Serilizer.getValidatorSettings(at)

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
      schema: { type: 'string' }
    },
    {
      name: 'allowEmptyValue',
      notAllowed: isQueryOrFormData ? undefined : 'Only allowed if "in" is query or formData.',
      schema: {
        type: 'boolean',
        default: false
      }
    },
    {
      name: 'allowReserved',
      versions: ['3.x.x'],
      notAllowed: at === 'query' ? undefined : 'Property only allowed for "query" parameters.',
      schema: {
        type: 'boolean',
        default: false
      }
    },
    {
      name: 'collectionFormat',
      versions: ['2.x'],
      notAllowed: type === 'array' && isQueryOrFormData ? undefined : 'Property only allowed when "type" is "array" and when "in" is "formData" or "query".',
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
      notAllowed: at === 'body' ? undefined : 'Property only allowed if "in" is set to "body".',
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
        default: defaultStyle,
        enum: allowedStyles
      }
    },
    {
      name: 'explode',
      versions: ['3.x.x'],
      schema: {
        type: 'boolean',
        default: defaultExplode
      }
    }
  )

  // modify the type property to also include "file" if "in" is set to "formData"
  const typeProperty = schema.properties?.find((prop: SchemaProperty) => prop.name === 'type')
  if (typeProperty !== undefined) {
    typeProperty.schema.enum = at === 'formData'
      ? ['array', 'boolean', 'file', 'integer', 'number', 'string']
      : ['array', 'boolean', 'integer', 'number', 'string']
  }

  const v2Validator = {
    before: schema.validator?.before ?? (() => true),
    after: schema.validator?.after ?? noop
  }
  if (schema.validator === undefined) schema.validator = {}
  schema.validator.after = (data) => {
    const { major } = data.root
    const { reference } = data.component
    const { exception } = data.context

    if (major === 2) v2Validator.after(data)

    V.defaultRequiredConflict(data)

    // if parameter in path then validate that required is true
    if (at === 'path' && definition.required !== true) {
      const pathParameterMustBeRequired = E.pathParameterMustBeRequired(definition.name, {
        definition,
        locations: ['required' in definition ? { node: definition, key: 'required', type: 'value' } : { node: definition }],
        reference
      })
      exception.message(pathParameterMustBeRequired)
    }

    if (major === 3) {
      V.exampleExamplesConflict(data)
      if (definition.schema !== undefined && !('$ref' in definition.schema)) {
        V.examplesMatchSchema(data, new Schema3(definition.schema))
      }

      // if style is specified then check that it aligns with the schema type
      const built = data.context.built as Definition3
      const type = (built.schema as SchemaDefinition3)?.type ?? ''
      const style = built.style ?? ''
      if (type !== '') {
        const validStyle = Serilizer.styleMatchesType(built.in, style, type, built.explode as boolean)
        if (!validStyle) {
          const invalidStyle = E.invalidStyle(style, type, {
            definition,
            locations: [{ node: definition, key: 'style', type: 'value' }],
            reference
          })
          exception.at('style').message(invalidStyle)
        }
      }

      // ensure that the explode value is valid
      if ('explode' in built) {
        const validExplode = Serilizer.styleMatchesExplode(built.in, style, built.explode as boolean)
        if (!validExplode) {
          const invalidCookieExplode = E.invalidCookieExplode(definition.name, {
            definition,
            locations: [{ node: definition, key: 'explode', type: 'value' }],
            reference
          })
          exception.at('explode').message(invalidCookieExplode)
        }
      }

      // TODO: If type is "file", the consumes MUST be either "multipart/form-data", " application/x-www-form-urlencoded" or both and the parameter MUST be in "formData".
    }
  }

  return schema
}
