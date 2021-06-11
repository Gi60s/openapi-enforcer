import { initializeData, Data, SchemaObject, SpecMap, Version, SchemaProperty, Exception } from './'
import * as PartialSchema from './helpers/PartialSchema'
import { addExceptionLocation, no, yes } from '../util'
import * as E from '../Exception/methods'
import * as Items from './Items'
import * as Example from './Example'
import * as Reference from './Reference'
import * as Schema from './Schema'
import * as DataType from './helpers/DataTypes'
import { lookupLocation } from '../loader'

export type Definition = Definition2 | Definition3

export interface Definition2 extends PartialSchema.Definition<Items.Definition> {
  [extension: string]: any
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
  [extension: string]: any
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

export class Parameter extends PartialSchema.PartialSchema<Items.Items> {
  readonly [extension: string]: any
  readonly name!: string
  readonly in!: 'body' | 'cookie' | 'formData' | 'header' | 'path' | 'query'
  readonly allowEmptyValue?: boolean
  readonly description?: string
  readonly required?: boolean
  readonly schema?: Schema.Schema | Reference.Reference

  // v2 properties (in addition to those added by PartialSchema
  readonly collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  readonly type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'

  // v3 properties
  readonly allowReserved?: boolean
  readonly deprecated?: boolean
  readonly example?: any
  readonly examples?: Record<string, Example.Example | Reference.Reference>

  readonly explode?: boolean
  readonly style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Parameter object', definition, version, arguments[2])
    super(data)
  }

  static defineDataType (type: DataType.Type, format: string, definition: DataType.Definition): void {
    PartialSchema.defineDataType(Parameter, type, format, definition)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#parameter-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#parameter-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#parameter-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#parameter-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#parameter-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    // copy schema from partial schema generator
    const schema = PartialSchema.schemaGenerator(Parameter)

    // mark properties from partial schema as applicable only to version 2.x
    schema.properties?.forEach((property: SchemaProperty) => {
      property.versions = ['2.x']
    })

    // add additional properties
    schema.properties?.push(
      {
        name: 'name',
        required: yes,
        schema: { type: 'string' }
      },
      {
        name: 'in',
        required: yes,
        schema: { type: 'string' }
      },
      {
        name: 'allowEmptyValue',
        allowed: (data: Data, def: Definition) => ['query', 'formData'].includes(def.in) ? true : 'Only allowed if "in" is query or formData.',
        schema: {
          type: 'boolean',
          default: () => false
        }
      },
      {
        name: 'allowReserved',
        versions: ['3.x.x'],
        allowed: (data: Data, { in: at }: { in: string }) => {
          return at === 'query' || 'Property only allowed for "query" parameters.'
        },
        schema: {
          type: 'boolean',
          default: () => false
        }
      },
      {
        name: 'collectionFormat',
        versions: ['2.x'],
        allowed: ({ chain }: Data, def: Definition) => {
          if (chain[0].definition.type !== 'array') return 'Property only allowed when "type" is "array".'
          if (!['query', 'formData'].includes(def.in)) return 'Property only allowed when "in" is "formData" or "query".'
          return true
        },
        schema: {
          type: 'string',
          default: () => 'csv',
          enum: () => ['csv', 'ssv', 'tsv', 'pipes', 'multi']
        }
      },
      {
        name: 'deprecated',
        versions: ['3.x.x'],
        schema: {
          type: 'boolean',
          default: no
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
          type: 'any',
          after: ({ exception, root }: Data) => {
            root.finally.push(() => {
              // TODO: test if example matches schema
            })
          }
        }
      },
      {
        name: 'examples',
        versions: ['3.x.x'],
        schema: {
          type: 'object',
          allowsSchemaExtensions: no,
          additionalProperties: {
            type: 'any',
            after: ({ exception, root }: Data) => {
              root.finally.push(() => {
                // TODO: test if example matches schema
              })
            }
          }
        }
      },
      {
        name: 'required',
        schema: {
          type: 'boolean',
          default: () => false,
          before (data: Data, def) {
            const { exception, component, definition: value } = data
            if (component.definition?.in === 'path' && value !== true) {
              const pathParameterMustBeRequired = E.pathParameterMustBeRequired(data.reference, component.definition.name)
              addExceptionLocation(pathParameterMustBeRequired, lookupLocation(def, 'required', 'value') ?? lookupLocation(def))
              exception.message(pathParameterMustBeRequired)
              return false
            }
            return true
          }
        }
      },
      {
        name: 'schema',
        versions: ['2.x'],
        allowed: (data: Data, def: Definition) => {
          // if (data.major === 3 || def.in === 'body') return true
          if (def.in === 'body') return true
          return 'Property only allowed if "in" is set to "body".'
        },
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
          default (data: Data, { in: at }: { in: string }) {
            switch (at) {
              case 'cookie': return 'form'
              case 'header': return 'simple'
              case 'path': return 'simple'
              case 'query': return 'simple'
              default: return ''
            }
          },
          enum (data: Data, { in: at }: { in: string }) {
            switch (at) {
              case 'cookie': return ['form']
              case 'header': return ['simple']
              case 'path': return ['simple', 'label', 'matrix']
              case 'query': return ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject']
              default: return []
            }
          },
          after (data: Data, def) {
            const { definition: style, exception, component } = data
            const at = def.in
            data.finally.push(function () {
              const parameter = component.built
              const schema: Schema.Schema | Reference.Reference | undefined = parameter.schema
              if (schema !== undefined && !('$ref' in schema)) {
                const type = schema.type
                if (type === undefined) return
                if (at === 'query') {
                  if ((style !== 'form') &&
                    !(style === 'spaceDelimited' && type === 'array') &&
                    !(style === 'pipeDelimited' && type === 'array') &&
                    !(style === 'deepObject' && type === 'object')) {
                    const invalidStyle = E.invalidStyle(data.reference, style, type)
                    addExceptionLocation(invalidStyle, lookupLocation(def, 'style', 'value'))
                    exception.message(invalidStyle)
                  }
                }
              }
            })
          }
        }
      },
      {
        name: 'explode',
        versions: ['3.x.x'],
        schema: {
          type: 'boolean',
          default: (data: Data, def: Definition) => def.style === 'form',
          after (data: Data, def) {
            const { definition: explode, exception, component } = data
            data.finally.push(function () {
              const parameter = component.built
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
      typeProperty.schema.enum = (data: Data, def: Definition) => {
        return def.in === 'formData'
          ? ['array', 'boolean', 'file', 'integer', 'number', 'string']
          : ['array', 'boolean', 'integer', 'number', 'string']
      }
    }

    const v2After = schema.after
    schema.after = (data: Data, def: Definition) => {
      const { built, exception, major } = data

      // if v2 then use item validator
      if (major === 2 && v2After !== undefined) v2After(data, def)

      if (built.required === true && 'default' in built) {
        const defaultRequiredConflict = E.defaultRequiredConflict()
        addExceptionLocation(defaultRequiredConflict, lookupLocation(def, 'default', 'key'), lookupLocation(def, 'required'))
        exception.message(defaultRequiredConflict)
      }

      if (built.example !== undefined && built.examples !== undefined) {
        const exampleExamplesConflict = E.exampleExamplesConflict(data.reference)
        addExceptionLocation(exampleExamplesConflict, lookupLocation(def, 'example', 'key'), lookupLocation(def, 'examples', 'key'))
        exception.message(exampleExamplesConflict)
      }

      // TODO: If type is "file", the consumes MUST be either "multipart/form-data", " application/x-www-form-urlencoded" or both and the parameter MUST be in "formData".
    }

    return schema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
