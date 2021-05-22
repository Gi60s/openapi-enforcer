import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { no, yes } from '../util'
import * as E from '../Exception/methods'
import * as Header from './Header'
import * as Link from './Link'
import * as MediaType from './MediaType'
import * as Reference from './Reference'
import * as Schema from './Schema'

const rxContentType = /^content-type$/i
const rxLinkName = /^[a-zA-Z0-9.\-_]+$/

export type Definition = Definition2 | Definition3

export interface Definition2 {
  [extension: string]: any
  description: string
  headers?: Record<string, Header.Definition>
  examples?: Record<string, any>
  schema?: Schema.Definition2 | Reference.Definition
}

export interface Definition3 {
  [extension: string]: any
  content?: Record<string, MediaType.Definition>
  description: string
  headers?: Record<string, Header.Definition | Reference.Definition>
  links?: Record<string, Link.Definition | Reference.Definition>
}

export class Response extends OASComponent {
  readonly [extension: string]: any
  readonly content?: Record<string, MediaType.MediaType>
  readonly description!: string
  readonly examples?: Record<string, any>
  readonly headers?: Record<string, Header.Header | Reference.Reference>
  readonly links?: Record<string, Link.Link | Reference.Reference>
  readonly schema?: Schema.Schema

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Response object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'http://spec.openapis.org/oas/v2.0#response-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#response-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#response-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#response-object'
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
              after ({ built, exception, definition: example }) {
                // validate the example if a schema is defined
                if ('schema' in built) {
                  const schema = built.schema as Schema.Schema
                  const serialized = schema.serialize(example)
                  if (serialized.error != null) {
                    exception.message(E.exampleNotSerializable(example, schema, serialized.error))
                  } else {
                    const error = schema.validate(serialized.value)
                    if (error != null) {
                      exception.message(E.exampleNotValid(example, schema, error))
                    }
                  }
                } else {
                  exception.message(E.exampleWithoutSchema())
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
              after ({ exception, key, reference }) {
                if (!rxLinkName.test(key)) exception.message(E.invalidResponseLinkKey(reference, key))
              }
            }
          }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
