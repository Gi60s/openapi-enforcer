import * as Encoding from './Encoding'
import * as Example from './Example'
import * as Schema from './Schema'
import { SchemaComponent, SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics, v3 } from './'

const rxContentTypeMime = /(?:^multipart\/)|(?:^application\/x-www-form-urlencoded$)/

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  encoding?: { [key: string]: Encoding.Definition }
  example?: any
  examples?: { [key: string]: Example.Definition }
  schema?: Schema.Definition
}

export interface Object {
  [extension: string]: any
  encoding?: { [key: string]: Encoding.Object }
  example?: any
  examples?: { [key: string]: Example.Object }
  schema?: Schema.Definition
}

export function Factory (): FactoryResult<Definition, Object> {
  class MediaType extends EnforcerComponent<Definition, Object> implements Object {
    encoding?: { [key: string]: Encoding.Object }
    example?: any
    examples?: { [key: string]: Example.Object }
    schema?: Schema.Definition

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: MediaType,
    validator: function (data): SchemaObject {
      const components = data.components as v3
      return {
        type: 'object',
        after ({ alert, built, chain, key }) {
          const parent = chain.length > 0 ? chain[0] : null
          if (parent !== null && parent.key === 'content' && !rxMediaType.test(key)) {
            alert('warn', 'MED001', 'Media type appears invalid')
          }

          if ('example' in built && 'examples' in built) {
            alert('error', 'MED002', 'Properties "example" and "examples" are mutually exclusive.')
          }
        },
        properties: [
          {
            name: 'schema',
            schema: {
              type: 'component',
              component: components.Schema
            }
          },
          {
            name: 'example',
            schema: {
              type: 'any'
            }
          },
          {
            name: 'examples',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.Example
              }
            }
          },
          {
            name: 'encoding',
            schema: {
              type: 'object',
              ignored ({ chain }) {
                const requestBodyObject = chain.length > 4 ? chain[4] : null // TODO: validate that this is a RequestBody instance
                return requestBodyObject === null || (requestBodyObject.schema as SchemaComponent<any, any>).component !== components.RequestBody || !rxContentTypeMime.test(chain[3].key)
              },
              after ({ alert, chain }) {
                const mediaTypeObject = chain[1]
                const key = chain[0].key
                const { built } = mediaTypeObject
                if (!('schema' in built) || !('properties' in built.schema) || !(key in built.schema.properties)) {
                  alert('error', 'MED004', 'Encoding name must match a property name in the media type\'s schema')
                }
              },
              additionalProperties: {
                type: 'component',
                component: components.Encoding
              }
            }
          }
        ]
      }
    }
  }
}

export const rxMediaType = /^(?:\*|(application|audio|example|font|image|message|model|multipart|text|video|x-\S+))\/(?:\*|(?:([\w.-]+)\+)?([\w.-]+)(?:; *(.+))?)$/
