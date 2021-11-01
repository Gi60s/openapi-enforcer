import {
  findAncestor,
  OASComponent,
  Data,
  Dereferenced,
  Referencable,
  Version,
  Exception,
  ComponentSchema
} from '../index'
import * as E from '../../Exception/methods'
import rx from '../../utils/rx'
import { Header } from './Header'
import { MediaType } from './MediaType'
import { Encoding3 as Definition, MediaType3 as MediaTypeDefinition, Schema3 as SchemaDefinition } from '../helpers/DefinitionTypes'
import * as Serilizer from '../helpers/serializer'

export class Encoding<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly allowReserved?: boolean
  readonly contentType?: string
  readonly explode?: boolean
  readonly headers?: Record<string, Referencable<HasReference, Header<HasReference>>>
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
    const ignoreAllowReserved = checkIfIgnored(data, 'allowReserved', 'application/x-www-form-urlencoded', 'The "allowReserved" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
    const ignoreExplode = checkIfIgnored(data, 'explode', 'application/x-www-form-urlencoded', 'The "explode" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
    const { exception, definition, key } = data.context
    const { reference } = data.component

    const mediaTypeData = findAncestor<MediaTypeDefinition>(data, MediaType)
    const mediaTypeDefinition = mediaTypeData?.context.built ?? {}
    const mediaTypeSchema: SchemaDefinition = mediaTypeDefinition.schema === undefined || '$ref' in mediaTypeDefinition.schema
      ? {}
      : mediaTypeDefinition.schema
    const encodingSchema: SchemaDefinition = (mediaTypeSchema.properties?.[key] ?? {}) as SchemaDefinition // this may be a Reference but for what I'm doing I can ignore that case.
    const type = encodingSchema.type ?? ''
    const contentTypeDefault = getDefaultContentType(encodingSchema, mediaTypeData)
    const { allowedStyles, defaultStyle, defaultExplode } = Serilizer.getValidatorSettings('query')

    return {
      allowsSchemaExtensions: true,
      properties: [
        {
          name: 'style',
          schema: {
            type: 'string',
            default: defaultStyle,
            enum: allowedStyles,
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
            ignored: ignoreAllowReserved
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
              component: Header
            }
          }
        },
        {
          name: 'explode',
          schema: {
            type: 'boolean',
            default: defaultExplode,
            ignored: ignoreExplode
          }
        }
      ],
      validator: {
        after () {
          const { built } = data.context

          // additional "style" property validation
          // The Encoding Object may only exist for requestBodies where the
          // media type is multipart or application/x-www-form-urlencoded
          if (!ignoreStyle) {
            const style = built.style
            const validStyle = Serilizer.styleMatchesType('query', style, type, built.explode)
            if (!validStyle) {
              const invalidStyle = E.invalidStyle(style, type, {
                definition,
                locations: [{ node: definition, key: 'style', type: 'value' }],
                reference
              })
              exception.at('style').message(invalidStyle)
            }
          }

          if ('contentType' in built) {
            const contentType = built.contentType
            if (!rx.mediaType.test(contentType)) {
              const invalidMediaType = E.invalidMediaType(contentType, {
                definition,
                locations: [{ node: definition, key: 'contentType', type: 'value' }],
                reference
              })
              exception.at('contentType').message(invalidMediaType)
            }
          }

          if ('headers' in built) {
            const contentTypeKey = Object.keys(built.headers).find(key => key.toLowerCase() === 'content-type')
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

function getDefaultContentType (encodingSchema: SchemaDefinition, mediaTypeData: Data | undefined): string {
  if (mediaTypeData !== undefined) {
    if (encodingSchema.type === 'string' && encodingSchema.format === 'binary') return 'application/octet-stream'
    if (encodingSchema.type === 'object') return 'application/json'
    if (encodingSchema.type === 'array') {
      const i = encodingSchema.items as SchemaDefinition
      if (i.type === 'string' && i.format === 'binary') return 'application/octet-stream'
      if (i.type === 'object' || i.type === 'array') return 'application/json'
    }
  }
  return 'text/plain'
}

function checkIfIgnored (data: Data, key: string, allowedMediaType: RegExp | string, reason: string): false | string {
  const { chain } = data.context
  const contextKey = chain[1]?.context.key
  if (contextKey === undefined) return false // if we have no context then we'll not ignore
  const ignore = typeof allowedMediaType === 'string'
    ? !contextKey.includes(allowedMediaType)
    : !allowedMediaType.test(contextKey)
  return ignore ? reason : false
}
