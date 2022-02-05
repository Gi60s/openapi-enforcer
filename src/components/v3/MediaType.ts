import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { OASComponent, componentValidate } from '../index'
import rx from '../../utils/rx'
import * as E from '../../DefinitionException/methods'
import * as V from '../helpers/common-validators'
import { Encoding } from './Encoding'
import { Example } from './Example'
import { RequestBody } from './RequestBody'
import { Schema } from './Schema'
import { MediaType3 as Definition } from '../helpers/definition-types'

let mediaTypeSchema: ComponentSchema<Definition>

export class MediaType extends OASComponent {
  extensions!: Record<string, any>
  encoding?: Record<string, Encoding>
  example?: any
  examples?: Record<string, Example>
  schema?: Schema

  constructor (definition: Definition, version?: Version) {
    super(MediaType, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#media-type-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#media-type-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#media-type-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#media-type-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (mediaTypeSchema === undefined) {
      mediaTypeSchema = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        validator: {
          after (data) {
            const { built, chain, definition, exception, key: mediaType } = data.context
            const parent = chain[0]

            // check that the media type appears valid
            if (parent?.context.key === 'content' && !rx.mediaType.test(mediaType)) {
              const invalidMediaType = E.invalidMediaType(data, { node: parent.context.definition, key: mediaType, type: 'key' }, mediaType)
              exception.message(invalidMediaType)
            }

            // check for example vs examples conflict
            V.exampleExamplesConflict(data)

            // validate the example or examples
            V.examplesMatchSchema(data, Schema)

            const schema = built.schema
            const schemaHasRef = schema?.$ref !== undefined
            if (schema !== undefined && !schemaHasRef && built.encoding !== undefined) {
              // check that the schema type is object if encoding is being used
              if (schema.type !== 'object') {
                const mediaTypeSchemaMustBeObject = E.mediaTypeSchemaMustBeObject(data, { key: 'type', type: 'value' }, schema.type ?? '')
                exception.message(mediaTypeSchemaMustBeObject)
              }

              // check that each encoding property matches a property in the schema
              Object.keys(built.encoding).forEach(key => {
                if (schema.properties?.[key] === undefined) {
                  const encodingNameNotMatched = E.encodingNameNotMatched(data, { node: definition.encoding, key, type: 'key' }, key)
                  exception.at('encoding').at(key).message(encodingNameNotMatched)
                }
              })
            } else if (schema === undefined && built.encoding !== undefined) {
              const missingSchema = E.encodingMissingAssociatedSchema(data, { key: 'type', type: 'value' })
              exception.message(missingSchema)
            }
          }
        },
        properties: [
          {
            name: 'schema',
            schema: {
              type: 'component',
              allowsRef: true,
              component: Schema
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
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Example
                }
              }
            }
          },
          {
            name: 'encoding',
            schema: {
              type: 'object',
              allowsSchemaExtensions: false,
              ignored (data) {
                const chain = data.data.context.chain
                const hasContext = chain[1]?.component.constructor === RequestBody
                if (!hasContext) return 'The encoding is ignored without media type context.'

                const mediaType = (data.data.context.key ?? '').toLowerCase()
                if (mediaType === 'application/x-www-form-urlencoded' || mediaType.startsWith('multipart/')) return false
                return 'The encoding is ignored unless the media type is application/x-www-form-urlencoded or multipart.'
              },
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Encoding
                }
              }
            }
          }
        ]
      })
    }
    return mediaTypeSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
