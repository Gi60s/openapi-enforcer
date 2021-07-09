import { OASComponent, initializeData, Referencable, SchemaComponent, SchemaObject, SpecMap, Version, Exception } from './'
import rx from '../rx'
import { addExceptionLocation, no, yes } from '../util'
import * as E from '../Exception/methods'
import * as Encoding from './Encoding'
import * as Example from './Example'
import * as Reference from './Reference'
import * as RequestBody from './RequestBody'
import * as Schema from './Schema'
import { lookupLocation } from '../loader'
import { Dereferenced } from './Reference'

export interface Definition {
  [key: `x-${string}`]: any
  encoding?: Record<string, Encoding.Definition | Reference.Definition>
  example?: any
  examples?: Record<string, Example.Definition | Reference.Definition>
  schema?: Schema.Definition | Reference.Definition
}

export class MediaType<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  encoding?: Record<string, Referencable<HasReference, Encoding.Encoding<HasReference>>>
  example?: any
  examples?: Record<string, Referencable<HasReference, Example.Example>>
  schema?: Referencable<HasReference, Schema.Schema>

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', MediaType, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#media-type-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#media-type-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#media-type-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#media-type-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      after ({ built, chain, exception, key, reference }, component) {
        const parent = chain[0]
        if (parent !== undefined && parent.key === 'content' && !rx.mediaType.test(key)) {
          const invalidMediaType = E.invalidMediaType(reference, key)
          addExceptionLocation(invalidMediaType, lookupLocation(parent.definition, key, 'key'))
          exception.message(invalidMediaType)
        }

        if ('example' in built && 'examples' in built) {
          const exampleExamplesConflict = E.exampleExamplesConflict(reference)
          addExceptionLocation(exampleExamplesConflict, lookupLocation(component, 'example', 'key'), lookupLocation(component, 'examples', 'key'))
          exception.message(exampleExamplesConflict)
        }
      },
      properties: [
        {
          name: 'schema',
          schema: {
            type: 'component',
            allowsRef: true,
            component: Schema.Schema,
            after ({ definition, exception, reference }) {
              if (definition.$ref === undefined && definition.type !== 'object') {
                const mediaTypeSchemaMustBeObject = E.mediaTypeSchemaMustBeObject(reference, definition.type)
                addExceptionLocation(mediaTypeSchemaMustBeObject, lookupLocation(definition, 'type', 'value'))
                exception.message(mediaTypeSchemaMustBeObject)
              }
            }
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
              // ignore unless this resides within a request body
              return chain[2]?.component.constructor !== RequestBody.RequestBody
            },
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Encoding.Encoding,
              after ({ definition, exception, key, reference }, componentDef) {
                // ensure that any properties in the encoding have a matching property in the schema properties
                if (componentDef.schema?.properties?.[key] === undefined) {
                  const encodingNameNotMatched = E.encodingNameNotMatched(reference)
                  addExceptionLocation(encodingNameNotMatched, lookupLocation(definition, key, 'key'))
                  exception.message(encodingNameNotMatched)
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
