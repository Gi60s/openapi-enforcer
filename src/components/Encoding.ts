import { OASComponent, initializeData, Data, Dereferenced, Referencable, SchemaObject, SpecMap, Version, Exception } from './'
import * as E from '../Exception/methods'
import rx from '../rx'
import { addExceptionLocation, no, yes } from '../util'
import * as Header from './Header'
import * as Reference from './Reference'
import { lookupLocation } from '../loader'

export interface Definition {
  [key: `x-${string}`]: any
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, Header.Definition | Reference.Definition>
  style?: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
}

export class Encoding<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly allowReserved?: boolean
  readonly contentType?: string
  readonly explode?: boolean
  readonly headers?: Record<string, Referencable<HasReference, Header.Header<HasReference>>>
  readonly style!: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', Encoding, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#encoding-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#encoding-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#encoding-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#encoding-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      before: data => {
        const { chain } = data

        const ancestor = chain[1]

        // TODO: remove this once i'm sure I'm getting the right position in hierarchy
        console.log('TODO: Validate that this is an encoding: ' + ancestor?.key)

        return true
      },
      properties: [
        {
          name: 'style',
          schema: {
            type: 'string',
            default: () => {
              return 'form'
            },
            enum: () => ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'],
            ignored: (data) => {
              return checkIfIgnored(data, 'style', 'application/x-www-form-urlencoded', 'The "style" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
            },
            after ({ chain, exception, definition, reference }, def) {
              const ancestor = chain[2]
              const type = ancestor?.definition.schema.type
              if (type !== undefined && definition !== undefined && chain[0].definition.in === 'query') {
                if ((definition !== 'form') &&
                  !(definition === 'spaceDelimited' && type === 'array') &&
                  !(definition === 'pipeDelimited' && type === 'array') &&
                  !(definition === 'deepObject' && type === 'object')) {
                  const invalidStyle = E.invalidStyle(reference, definition, type)
                  addExceptionLocation(invalidStyle, lookupLocation(def, 'style', 'value'))
                  exception.message(invalidStyle)
                }
              }
            }
          }
        },
        {
          name: 'contentType',
          schema: {
            type: 'string',
            default: ({ chain }) => {
              const propertyName = chain[0].key
              const v = chain[2]?.definition.schema?.properties?.[propertyName]
              if (v === undefined) return undefined
              if (v.type === 'string' && v.format === 'binary') return 'application/octet-stream'
              if (v.type === 'object') return 'application/json'
              if (v.type === 'array') {
                const i = v.items
                if (i.type === 'string' && i.format === 'binary') return 'application/octet-stream'
                if (i.type === 'object' || i.type === 'array') return 'application/json'
              }
              return 'text/plain'
            },
            after ({ definition, exception, reference }, def) {
              if (!rx.mediaType.test(definition)) {
                const invalidMediaType = E.invalidMediaType(reference, definition)
                addExceptionLocation(invalidMediaType, lookupLocation(def, 'contentType', 'value'))
                exception.message(invalidMediaType)
              }
            }
          }
        },
        {
          name: 'allowReserved',
          schema: {
            type: 'boolean',
            default: () => false,
            ignored (data) {
              return checkIfIgnored(data, 'allowReserved', 'application/x-www-form-urlencoded', 'The "allowReserved" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
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
              component: Header.Header,
              ignored (data) {
                const { chain, definition, exception, key, reference } = data
                const ignore = key.toLowerCase() === 'content-type'
                if (ignore) {
                  const valueIgnored = E.valueIgnored(reference, definition, 'Encoding headers should not include Content-Type. That is already part of the Encoding definition under the "contentType" property.')
                  addExceptionLocation(valueIgnored, lookupLocation(chain[0].definition, key))
                  exception.message(valueIgnored)
                }
                return ignore
              }
            }
          }
        },
        {
          name: 'explode',
          schema: {
            type: 'boolean',
            default: ({ chain }) => {
              return chain[0].built.style === 'form'
            },
            ignored: (data) => {
              return checkIfIgnored(data, 'explode', 'application/x-www-form-urlencoded', 'The "explode" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
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

function checkIfIgnored (data: Data, key: string, allowedMediaType: RegExp | string, reason: string): boolean {
  const { chain, definition, exception, reference } = data
  const ignore = typeof allowedMediaType === 'string'
    ? !chain[2]?.key.includes(allowedMediaType)
    : !allowedMediaType.test(chain[2]?.key)
  if (ignore && definition !== undefined) {
    const valueIgnored = E.valueIgnored(reference, definition, reason)
    addExceptionLocation(valueIgnored, lookupLocation(chain[0].definition, key))
    exception.message(valueIgnored)
  }
  return ignore
}
