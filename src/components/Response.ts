import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { addExceptionLocation, adjustExceptionLevel, no, yes } from '../util'
import * as E from '../Exception/methods'
import * as Header from './Header'
import * as Link from './Link'
import * as MediaType from './MediaType'
import * as Reference from './Reference'
import * as Schema from './Schema'
import { lookupLocation } from '../loader'

const rxContentType = /^content-type$/i
const rxLinkName = /^[a-zA-Z0-9.\-_]+$/

export type Definition = Definition2 | Definition3

export interface Definition2 {
  [key: `x-${string}`]: any
  description: string
  headers?: Record<string, Header.Definition>
  examples?: Record<string, any>
  schema?: Schema.Definition2 | Reference.Definition
}

export interface Definition3 {
  [key: `x-${string}`]: any
  content?: Record<string, MediaType.Definition>
  description: string
  headers?: Record<string, Header.Definition | Reference.Definition>
  links?: Record<string, Link.Definition | Reference.Definition>
}

export class Response extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly content?: Record<string, MediaType.MediaType>
  readonly description!: string
  readonly examples?: Record<string, any>
  readonly headers?: Record<string, Header.Header | Reference.Reference>
  readonly links?: Record<string, Link.Link | Reference.Reference>
  readonly schema?: Schema.Schema

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', Response, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'https://spec.openapis.org/oas/v2.0#response-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#response-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#response-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#response-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'description',
          required: yes,
          schema: {
            type: 'string'
          }
        },
        {
          name: 'content',
          versions: ['3.x.x'],
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: false,
              component: MediaType.MediaType
            }
          }
        },
        {
          name: 'schema',
          versions: ['2.0'],
          schema: {
            type: 'component',
            allowsRef: true,
            component: Schema.Schema
          }
        },
        {
          name: 'examples',
          versions: ['2.0'],
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'any',
              after ({ built, chain, key, exception, definition: example }) {
                // validate the example if a schema is defined
                const parent = chain[0]
                if ('schema' in built) {
                  const schema = built.schema as Schema.Schema
                  const serialized = schema.serialize(example)
                  if (serialized?.exception?.hasError === true) {
                    const exampleNotSerializable = E.exampleNotSerializable(example, schema, serialized.exception)
                    adjustExceptionLevel(parent?.definition, exampleNotSerializable)
                    addExceptionLocation(exampleNotSerializable, lookupLocation(parent?.definition, key, 'value'))
                    exception.message(exampleNotSerializable)
                  } else {
                    const error = schema.validate(serialized.value)
                    if (error != null) {
                      const exampleNotSerializable = E.exampleNotValid(example, schema, error)
                      adjustExceptionLevel(parent?.definition, exampleNotSerializable)
                      addExceptionLocation(exampleNotSerializable, lookupLocation(parent?.definition, key, 'value'))
                      exception.message(exampleNotSerializable)
                    }
                  }
                } else {
                  const exampleWithoutSchema = E.exampleWithoutSchema()
                  adjustExceptionLevel(parent?.definition, exampleWithoutSchema)
                  addExceptionLocation(exampleWithoutSchema, lookupLocation(parent?.definition, key, 'value'))
                  exception.message(exampleWithoutSchema)
                }
              }
            }
          }
        },
        {
          name: 'headers',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              ignored: ({ key }) => rxContentType.test(key),
              component: Header.Header
            }
          }
        },
        {
          name: 'links',
          versions: ['3.x.x'],
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Link.Link,
              after ({ exception, chain, key, reference }) {
                if (!rxLinkName.test(key)) {
                  const invalidResponseLinkKey = E.invalidResponseLinkKey(reference, key)
                  const parent = chain[0]
                  addExceptionLocation(invalidResponseLinkKey, lookupLocation(parent?.definition, key, 'key'))
                  exception.message(invalidResponseLinkKey)
                }
              }
            }
          }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
