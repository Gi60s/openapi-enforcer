import { OASComponent, initializeData, SchemaComponent, SchemaObject, SpecMap, Version, Exception } from './'
import rx from '../rx'
import { addExceptionLocation, no, yes } from '../util'
import * as E from '../Exception/methods'
import * as Encoding from './Encoding'
import * as Example from './Example'
import * as Reference from './Reference'
import * as RequestBody from './RequestBody'
import * as Schema from './Schema'
import { lookup } from '../loader'

export interface Definition {
  [extension: string]: any
  encoding?: Record<string, Encoding.Definition | Reference.Definition>
  example?: any
  examples?: Record<string, Example.Definition | Reference.Definition>
  schema?: Schema.Definition | Reference.Definition
}

export class MediaType extends OASComponent {
  readonly [extension: string]: any
  encoding?: Record<string, Encoding.Encoding | Reference.Reference>
  example?: any
  examples?: Record<string, Example.Example | Reference.Reference>
  schema?: Schema.Schema | Reference.Reference

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing MediaType object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#media-type-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#media-type-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#media-type-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#media-type-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      after ({ built, chain, definition, exception, key, reference }, component) {
        const parent = chain[0]
        if (parent !== undefined && parent.key === 'content' && !rx.mediaType.test(key)) {
          const invalidMediaType = E.invalidMediaType(reference, key)
          addExceptionLocation(invalidMediaType, lookup(parent.definition, key, 'key'))
          exception.message(invalidMediaType)
        }

        if ('example' in built && 'examples' in built) {
          const exampleExamplesConflict = E.exampleExamplesConflict(reference)
          addExceptionLocation(exampleExamplesConflict, lookup(component, 'example', 'key'), lookup(component, 'examples', 'key'))
          exception.message(exampleExamplesConflict)
        }
      },
      properties: [
        {
          name: 'schema',
          schema: {
            type: 'component',
            allowsRef: true,
            component: Schema.Schema
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
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Example.Example
            }
          }
        },
        {
          name: 'encoding',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            ignored ({ chain }) {
              const requestBodyObject = chain.length > 4 ? chain[4] : null // TODO: validate that this is a RequestBody instance
              if (requestBodyObject === null) return true

              const component = (requestBodyObject.schema as SchemaComponent).component
              return component !== RequestBody.RequestBody || !rx.contentType.test(chain[3].key)
            },
            after ({ chain, exception, reference }, component) {
              const mediaTypeObject = chain[1]
              const key = chain[0].key
              const { built } = mediaTypeObject
              if (!('schema' in built) || !('properties' in built.schema) || !(key in built.schema.properties)) {
                const encodingNameNotMatched = E.encodingNameNotMatched(reference)
                addExceptionLocation(encodingNameNotMatched, lookup(component, 'encoding', 'key'))
                exception.message(encodingNameNotMatched)
              }
            },
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Encoding.Encoding
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
