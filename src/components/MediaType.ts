import { ComponentDefinition } from '../component-registry'
import * as Encoding from './Encoding'
import * as Example from './Example'
import * as Schema from './Schema'
import { Data, SchemaComponent, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

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

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#media-type-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#media-type-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#media-type-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#media-type-object'
})

export const Component = class MediaType extends EnforcerComponent<Definition, Object> implements Object {
  encoding?: { [key: string]: Encoding.Object }
  example?: any
  examples?: { [key: string]: Example.Object }
  schema?: Schema.Definition

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    after ({ alert, built, chain, key }) {
      const parent = chain.length > 0 ? chain[0] : null
      if (parent !== null && parent.key === 'content' && !rxMediaType.test(key)) {
        alert('warn', 'MEDTYP', key)
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
          allowsRef: true,
          component: Schema.Component
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
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: Example.Component
          }
        }
      },
      {
        name: 'encoding',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          ignored ({ chain }) {
            const requestBodyObject = chain.length > 4 ? chain[4] : null // TODO: validate that this is a RequestBody instance
            return requestBodyObject === null || (requestBodyObject.schema as SchemaComponent<any, any>).component !== RequestBody.Component || !rxContentTypeMime.test(chain[3].key)
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
            allowsRef: true,
            component: Encoding.Component
          }
        }
      }
    ]
  }
}

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}

export const rxMediaType = /^(?:\*|(application|audio|example|font|image|message|model|multipart|text|video|x-\S+))\/(?:\*|(?:([\w.-]+)\+)?([\w.-]+)(?:; *(.+))?)$/
