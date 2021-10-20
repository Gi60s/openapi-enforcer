import {
  OASComponent,
  Data,
  Dereferenced,
  Referencable,
  Version,
  Exception,
  ComponentSchema
} from './'
import * as E from '../Exception/methods'
import rx from '../rx'
import * as Header from './Header'
import * as Reference from './Reference'
import { Definition3 as SchemaDefinition } from './Schema'
import { Definition as MediaTypeDefinition } from './MediaType'

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
    super(Encoding, definition, version, arguments[2])
  }

  // The Encoding Object may only exist for requestBodies where the
  // media type is multipart or application/x-www-form-urlencoded
  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#encoding-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#encoding-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#encoding-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#encoding-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    // The Encoding Object may only exist for requestBodies where the
    // media type is multipart or application/x-www-form-urlencoded.
    // Request Body Object: content -> Map<string, Media Type Object>
    // Media Type Object: encoding -> Encoding Object (this object)
    const ignoreStyle = checkIfIgnored(data, 'style', 'application/x-www-form-urlencoded', 'The "style" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
    const { chain, exception, definition, built } = data.context
    const { reference } = data.component

    const mediaTypeData: Data<MediaTypeDefinition> = chain[1]
    const mediaTypeDefinition = mediaTypeData?.context.built
    const schema: SchemaDefinition | null = '$ref' in (mediaTypeDefinition.schema ?? {})
      ? {}
      : mediaTypeDefinition.schema as SchemaDefinition
    const type = schema.type ?? ''

    const contentTypeDefault = (() => {
      if (mediaTypeData !== undefined) {
        if (schema.type === 'string' && schema.format === 'binary') return 'application/octet-stream'
        if (schema.type === 'object') return 'application/json'
        if (schema.type === 'array') {
          const i = schema.items as SchemaDefinition
          if (i.type === 'string' && i.format === 'binary') return 'application/octet-stream'
          if (i.type === 'object' || i.type === 'array') return 'application/json'
        }
      }
      return 'text/plain'
    })()

    return {
      allowsSchemaExtensions: true,
      properties: [
        {
          name: 'style',
          schema: {
            type: 'string',
            default: 'form',
            enum: ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'],
            ignored: ignoreStyle
          }
        },
        {
          name: 'contentType',
          schema: {
            type: 'string',
            default: contentTypeDefault
          }
        },
        {
          name: 'allowReserved',
          schema: {
            type: 'boolean',
            default: false,
            ignored: checkIfIgnored(data, 'allowReserved', 'application/x-www-form-urlencoded', 'The "allowReserved" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
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
          name: 'explode',
          schema: {
            type: 'boolean',
            default: built.style === 'form',
            ignored: checkIfIgnored(data, 'explode', 'application/x-www-form-urlencoded', 'The "explode" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
          }
        }
      ],
      validator: {
        after (data) {
          // additional "style" property validation
          // The Encoding Object may only exist for requestBodies where the
          // media type is multipart or application/x-www-form-urlencoded
          if (!ignoreStyle) {
            const style = definition.style
            if ((style !== 'form') &&
              !(style === 'spaceDelimited' && type === 'array') &&
              !(style === 'pipeDelimited' && type === 'array') &&
              !(style === 'deepObject' && type === 'object')) {
              const invalidStyle = E.invalidStyle(style, type, {
                definition,
                locations: [{ node: definition, key: 'style', type: 'value' }],
                reference
              })
              exception.at('style').message(invalidStyle)
            }
          }

          if ('contentType' in definition) {
            const contentType = definition.contentType
            if (!rx.mediaType.test(contentType)) {
              const invalidMediaType = E.invalidMediaType(contentType, {
                definition,
                locations: [{ node: definition, key: 'contentType', type: 'value' }],
                reference
              })
              exception.at('contentType').message(invalidMediaType)
            }
          }

          if ('headers' in definition) {
            const contentTypeKey = Object.keys(definition.headers).find(key => key.toLowerCase() === 'content-type')
            if (contentTypeKey !== undefined) {
              const valueIgnored = E.valueIgnored(contentTypeKey, 'Encoding headers should not include Content-Type. That is already part of the Encoding definition under the "contentType" property.', {
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

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}

function checkIfIgnored (data: Data, key: string, allowedMediaType: RegExp | string, reason: string): boolean {
  const { chain, definition, exception } = data.context
  const { reference } = data.component
  const contextKey = chain[1]?.context.key
  const ignore = typeof allowedMediaType === 'string'
    ? !contextKey.includes(allowedMediaType)
    : !allowedMediaType.test(contextKey)
  if (ignore && definition !== undefined) {
    const valueIgnored = E.valueIgnored(reference, reason, {
      definition,
      locations: [{ node: chain[0].context.definition, key: key }],
      reference
    })
    exception.message(valueIgnored)
  }
  return ignore
}
