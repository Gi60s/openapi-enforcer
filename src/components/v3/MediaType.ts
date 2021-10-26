import {
  OASComponent,
  Referencable,
  Data,
  Version,
  Exception,
  ComponentSchema
} from '../index'
import rx from '../../rx'
import * as E from '../../Exception/methods'
import * as V from '../helpers/common-validators'
import * as Encoding from './Encoding'
import * as Example from './Example'
import * as Reference from '../Reference'
import * as RequestBody from '../RequestBody'
import * as Schema from '../Schema'
import { Dereferenced } from '../Reference'

export interface Definition {
  [key: `x-${string}`]: any
  encoding?: Record<string, Encoding.Definition | Reference.Definition>
  example?: any
  examples?: Record<string, Example.Definition | Reference.Definition>
  schema?: Schema.Definition3 | Reference.Definition
}

export class MediaType<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  encoding?: Record<string, Referencable<HasReference, Encoding.Encoding<HasReference>>>
  example?: any
  examples?: Record<string, Referencable<HasReference, Example.Example>>
  schema?: Referencable<HasReference, Schema.Schema>

  constructor (definition: Definition, version?: Version) {
    super(MediaType, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#media-type-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#media-type-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#media-type-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#media-type-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    const { chain } = data.context
    const encodingIgnored = chain[1]?.component.constructor !== RequestBody.RequestBody

    return {
      allowsSchemaExtensions: true,
      validator: {
        after (data) {
          const { built, chain, definition, exception, key: mediaType } = data.context
          const { reference } = data.component
          const parent = chain[0]

          // check that the media type appears valid
          if (parent?.context.key === 'content' && !rx.mediaType.test(mediaType)) {
            const invalidMediaType = E.invalidMediaType(mediaType, {
              definition,
              locations: [{ node: parent.context.definition, key: mediaType, type: 'key' }],
              reference
            })
            exception.message(invalidMediaType)
          }

          // check for example vs examples conflict
          V.exampleExamplesConflict(data)

          // check that the schema type is object
          if (definition.schema !== undefined) {
            const schema = definition.schema
            if (!('$ref' in schema) && schema.type !== 'object') {
              const mediaTypeSchemaMustBeObject = E.mediaTypeSchemaMustBeObject(schema.type ?? '', {
                definition,
                locations: [{ node: definition, key: 'type', type: 'value' }],
                reference
              })
              exception.message(mediaTypeSchemaMustBeObject)
            }
          }

          // ensure that any properties in the encoding have a matching property in the schema properties
          const schema = definition.schema ?? {}
          if (!('$ref' in schema)) {
            Object.keys(definition.encoding ?? {}).forEach(key => {
              if (schema.properties?.[key] === undefined) {
                const encodingNameNotMatched = E.encodingNameNotMatched(key, {
                  definition,
                  locations: [{ node: definition.encoding, key, type: 'key' }],
                  reference
                })
                exception.at('encoding').at(key).message(encodingNameNotMatched)
              }
            })
          }
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
            allowsSchemaExtensions: false,
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
            allowsSchemaExtensions: false,
            ignored: encodingIgnored,
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
