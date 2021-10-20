import {
  initializeData,
  Data,
  Dereferenced,
  SchemaObject,
  SpecMap,
  Version,
  SchemaProperty,
  Exception,
  Referencable,
  ComponentSchema
} from './'
import * as PartialSchema from './helpers/PartialSchema'
import { addExceptionLocation, no, noop, yes } from '../util'
import * as E from '../Exception/methods'
import * as Items from './Items'
import * as Example from './Example'
import * as Reference from './Reference'
import * as Schema from './Schema'
import * as DataType from './helpers/DataTypes'
import { lookupLocation } from '../loader'
import { SchemaDefinition3 } from '../index'

export type Definition = Definition2 | Definition3

export interface Definition2 extends PartialSchema.Definition<Items.Definition> {
  [key: `x-${string}`]: any
  name: string
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  default?: any
  description?: string
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Items.Definition
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
  pattern?: string
  required?: boolean
  schema?: Schema.Definition2
  type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'
  uniqueItems?: boolean
}

export interface Definition3 {
  [key: `x-${string}`]: any
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  allowReserved?: boolean
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Example.Definition | Reference.Definition>
  explode?: boolean
  required?: boolean
  schema?: Schema.Definition3 | Reference.Definition
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'
}

export class Parameter<HasReference=Dereferenced> extends PartialSchema.PartialSchema<Items.Items> {
  readonly [key: `x-${string}`]: any
  readonly name!: string
  readonly in!: 'body' | 'cookie' | 'formData' | 'header' | 'path' | 'query'
  readonly allowEmptyValue?: boolean
  readonly description?: string
  readonly required?: boolean
  readonly schema?: Referencable<HasReference, Schema.Schema>

  // v2 properties (in addition to those added by PartialSchema
  readonly collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  readonly type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'

  // v3 properties
  readonly allowReserved?: boolean
  readonly deprecated?: boolean
  readonly example?: any
  readonly examples?: Record<string, Referencable<HasReference, Example.Example>>

  readonly explode?: boolean
  readonly style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'

  constructor (definition: Definition, version?: Version) {
    super(Parameter, definition, version, arguments[2])
  }

  static defineDataType (type: DataType.Type, format: string, definition: DataType.Definition): void {
    PartialSchema.defineDataType(Parameter, type, format, definition)
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#parameter-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#parameter-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#parameter-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#parameter-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#parameter-object'
  }

  static schemaGenerator (data: Data<Definition>): ComponentSchema<Definition> {
    // copy schema from partial schema generator
    const schema = PartialSchema.schemaGenerator(Parameter, data)

    const { definition } = data.context
    const at = definition.in
    const type = 'type' in definition ? definition.type : ''
    const isQueryOrFormData = at === 'query' || at === 'formData'

    const styleDefault = at === 'cookie'
      ? 'form'
      : (at === 'header' || at === 'path' || at === 'query') ? 'simple' : ''
    const styleEnum = at === 'cookie'
      ? ['form']
      : at === 'header'
        ? ['simple']
        : at === 'path'
          ? ['simple', 'label', 'matrix']
          : at === 'query'
            ? ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject']
            : []

    // mark properties from partial schema as applicable only to version 2.x
    schema.properties?.forEach((property: SchemaProperty) => {
      property.versions = ['2.x']
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
            type: 'any'
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
          component: Schema.Schema
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
      },
      {
        name: 'style',
        versions: ['3.x.x'],
        schema: {
          type: 'string',
          default: styleDefault,
          enum: styleEnum
        }
      },
      {
        name: 'explode',
        versions: ['3.x.x'],
        schema: {
          type: 'boolean',
          default: style === 'form', WORKING HERE
          after (data: Data, def) {
            const { definition: explode, exception, component } = data
            data.component.finally.push(function () {
              const parameter = component.data.built
              if (parameter.schema !== undefined && !('$ref' in parameter.schema)) {
                const type = parameter.schema.type
                const { at, name } = def
                if (at === 'cookie' && explode === true && (type === 'array' || type === 'object')) {
                  const invalidCookieExplode = E.invalidCookieExplode(data.reference, name)
                  addExceptionLocation(invalidCookieExplode, lookupLocation(def, 'explode', 'value'))
                  exception.message(invalidCookieExplode)
                }
              }
            })
          }
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

      // validate default and required are not both set
      if (definition.required === true && 'default' in definition) {
        const defaultRequiredConflict = E.defaultRequiredConflict({
          definition,
          locations: [
            { node: definition, key: 'default', type: 'key' },
            { node: definition, key: 'required', type: 'key' }
          ]
        })
        exception.message(defaultRequiredConflict)
      }

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
        // validate example and examples are not both set
        if ('example' in definition && 'examples' in definition) {
          const exampleExamplesConflict = E.exampleExamplesConflict({
            definition,
            locations: [
              { node: definition, key: 'example', type: 'key' },
              { node: definition, key: 'examples', type: 'key' }
            ],
            reference
          })
          exception.message(exampleExamplesConflict)
        }

        // validate that example matches schema
        if ('example' in definition) {
          data.root.finally.push(() => {
            // TODO: test if example matches schema
          })
        }

        // validate that example matches schema
        if ('examples' in definition) {
          data.root.finally.push(() => {
            const examples = definition.examples ?? {}
            Object.keys(examples).forEach(key => {
              // TODO: test if example matches schema
            })
          })
        }

        // if style is specified then check that it aligns with the schema type
        const built = data.context.built as Definition3
        const type = (built.schema as SchemaDefinition3)?.type ?? ''
        const style = built.style ?? ''
        if (type !== '') {
          if ((style !== 'form') &&
            !(style === 'spaceDelimited' && type === 'array') &&
            !(style === 'pipeDelimited' && type === 'array') &&
            !(style === 'deepObject' && type === 'object')) {
            const invalidStyle = E.invalidStyle(style, type, {
              definition,
              locations: [{ node: definition, key: 'style', type: 'value' }],
              reference
            })
            exception.message(invalidStyle)
          }
        }

        // TODO: If type is "file", the consumes MUST be either "multipart/form-data", " application/x-www-form-urlencoded" or both and the parameter MUST be in "formData".
      }
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
