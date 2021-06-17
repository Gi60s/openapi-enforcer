import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import * as E from '../Exception/methods'
import rx from '../rx'
import { addExceptionLocation, no, yes } from '../util'
import * as Header from './Header'
import * as Reference from './Reference'
import { lookupLocation } from '../loader'

export interface Definition {
  [extension: string]: any
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, Header.Definition | Reference.Definition>
  style?: string
}

export class Encoding extends OASComponent {
  readonly [extension: string]: any
  readonly allowReserved?: boolean
  readonly contentType?: string
  readonly explode?: boolean
  readonly headers?: Record<string, Header.Header | Reference.Reference>
  readonly style?: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Encoding object', definition, version, arguments[2])
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
        console.log('TODO: Validate that this is an encoding: ' + ancestor.key)

        return true
      },
      properties: [
        {
          name: 'style',
          schema: {
            type: 'string',
            default: () => 'form',
            enum: () => ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'],
            ignored: ({ chain }) => chain[1].key !== 'application/x-www-form-urlencoded',
            after ({ chain, exception, definition, reference }, def) {
              const ancestor = chain[2]
              const type = ancestor.definition.schema.type
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
              const v = chain[2].definition.schema.properties[propertyName]
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
            ignored: ({ chain }) => chain[2].key !== 'application/x-www-form-urlencoded'
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
              ignored: ({ chain }) => chain[0].key === 'content-type'
            },
            ignored: ({ chain }) => !chain[2].key.startsWith('multipart/')
          }
        },
        {
          name: 'explode',
          schema: {
            type: 'boolean',
            default: ({ chain }) => chain[0].built.style === 'form',
            ignored: ({ chain }) => chain[2].key !== 'application/x-www-form-urlencoded'
          }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
