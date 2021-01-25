import * as Header from './Header'
import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

const rxContentType = /^([a-z-]+)\/(\*|[a-z-]+)(?:\+([a-z-]+))?/

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: { [key: string]: Header.Definition }
  style?: string
}

export interface Object {
  [extension: string]: any
  readonly allowReserved?: boolean
  readonly contentType?: string
  readonly explode?: boolean
  readonly headers?: { [key: string]: Header.Object }
  readonly style?: string
}

export function Factory (): FactoryResult<Definition, Object> {
  class Encoding extends EnforcerComponent<Definition, Object> implements Object {
    readonly allowReserved?: boolean
    readonly contentType?: string
    readonly explode?: boolean
    readonly headers?: { [key: string]: Header.Object }
    readonly style?: string

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Encoding,
    validator: function (data): SchemaObject {
      const components = data.components
      return {
        type: 'object',
        before: data => {
          const { alert, chain } = data

          const ancestor = chain[1]
          if (ancestor === undefined) {
            alert('warn', 'ENC001', 'Unable to validate Encoding outside of surrounding MediaType object.')
            return false
          }

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
              after ({ alert, chain, definition }) {
                const ancestor = chain[2]
                const type = ancestor.definition.schema.type
                if (type !== undefined && definition !== undefined && chain[0].definition.in === 'query') {
                  if ((definition !== 'form') &&
                    !(definition === 'spaceDelimited' && type === 'array') &&
                    !(definition === 'pipeDelimited' && type === 'array') &&
                    !(definition === 'deepObject' && type === 'object')) {
                    alert('error', 'ENC002', 'Style "' + definition + '" is incompatible with schema type: ' + type)
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
              after ({ alert, definition }) {
                if (!rxContentType.test(definition)) {
                  alert('error', 'ENC003', 'Value is not a valid content-type')
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
              additionalProperties: {
                type: 'component',
                component: components.Header,
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
  }
}
