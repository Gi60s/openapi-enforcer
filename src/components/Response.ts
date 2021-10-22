import {
  OASComponent,
  Dereferenced,
  Version,
  Exception,
  Referencable,
  ComponentSchema
} from './'
import { getAncestorComponent } from './helpers/traversal'
import * as E from '../Exception/methods'
import * as V from './helpers/common-validators'
import { Operation } from './Operation'
import { Swagger } from './Swagger'
import * as Header from './Header'
import * as Link from './Link'
import * as MediaType from './MediaType'
import * as Reference from './Reference'
import * as Schema from './Schema'

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

export class Response<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly content?: Record<string, MediaType.MediaType<HasReference>>
  readonly description!: string
  readonly examples?: Record<string, any>
  readonly headers?: Record<string, Referencable<HasReference, Header.Header<HasReference>>>
  readonly links?: Record<string, Referencable<HasReference, Link.Link>>
  readonly schema?: Schema.Schema

  constructor (definition: Definition, version?: Version) {
    super(Response, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v2.0#response-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#response-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#response-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#response-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return {
      allowsSchemaExtensions: true,
      properties: [
        {
          name: 'description',
          required: true,
          schema: {
            type: 'string'
          }
        },
        {
          name: 'content',
          versions: ['3.x.x'],
          schema: {
            type: 'object',
            allowsSchemaExtensions: false,
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
            allowsSchemaExtensions: false,
            additionalProperties: {
              type: 'any'
            }
          }
        },
        {
          name: 'headers',
          schema: {
            type: 'object',
            allowsSchemaExtensions: false,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Header.Header
            }
          }
        },
        {
          name: 'links',
          versions: ['3.x.x'],
          schema: {
            type: 'object',
            allowsSchemaExtensions: false,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Link.Link
            }
          }
        }
      ],
      validator: {
        after (data) {
          const { built, definition, exception } = data.context
          const { reference } = data.component
          const { major } = data.root

          if (major === 2) {
            if ('examples' in built) {
              const exampleMediaTypes = Object.keys(built.examples ?? {})

              // Validate that the key matches the Operation produces value, whether inherited or explicit.
              const operation = getAncestorComponent(data, Operation)
              const swagger = getAncestorComponent(data, Swagger)
              const produces: string[] = [].concat(operation?.context.built.produces ?? [], swagger?.context.built.produces ?? [])
              exampleMediaTypes.forEach(type => {
                if (!produces.includes(type)) {
                  const exampleMediaTypeNotProduced = E.exampleMediaTypeNotProduced(type, produces, {
                    definition,
                    locations: [{ node: (definition as Definition2).examples, key: type, type: 'key' }],
                    reference
                  })
                  exception.at('examples').at(type).message(exampleMediaTypeNotProduced)
                }
              })

              if (built.schema !== undefined) {
                if (!('$ref' in built.schema)) {
                  const schema = new Schema.Schema(built.schema, '2.0')
                  V.examplesMatchSchema(data, schema)
                }
              } else {
                V.examplesMatchSchema(data, null)
              }
            }
          } else if (major === 3) {
            if ('links' in built) {
              const keys = Object.keys(built.links ?? {})
              keys.forEach(key => {
                if (!rxLinkName.test(key)) {
                  const invalidResponseLinkKey = E.invalidResponseLinkKey(key, {
                    definition,
                    locations: [{ node: (definition as Definition3).links, key, type: 'key' }],
                    reference
                  })
                  exception.at('links').at(key).message(invalidResponseLinkKey)
                }
              })
            }

            if ('headers' in built) {
              const contentTypeKey = Object.keys(built.headers ?? {}).find(key => key.toLowerCase() === 'content-type')
              if (contentTypeKey !== undefined) {
                const valueIgnored = E.valueIgnored(contentTypeKey, 'Response headers should not include Content-Type. The content type is already part of the Response definition.', {
                  definition: definition,
                  locations: [{ node: definition.headers, key: contentTypeKey, type: 'key' }],
                  reference
                })
                exception.at('headers').message(valueIgnored)
              }
            }
          }
        }
      }
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
