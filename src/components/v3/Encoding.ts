import { DefinitionException } from '../../Exception'
import { OASComponent, componentValidate, findAncestorData, ComputeFunction } from '../index'
import { ComponentSchema, Data, Version } from '../helpers/builder-validator-types'
import rx from '../../utils/rx'
import { Header } from './Header'
import { MediaType } from './MediaType'
import { Encoding3 as Definition, MediaType3 as MediaTypeDefinition, Schema3 as SchemaDefinition } from '../helpers/definition-types'
import * as Serializer from '../helpers/serializer'

const ignoreStyle = checkIfIgnored('style', 'application/x-www-form-urlencoded', 'The "style" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
const ignoreAllowReserved = checkIfIgnored('allowReserved', 'application/x-www-form-urlencoded', 'The "allowReserved" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
const ignoreExplode = checkIfIgnored('explode', 'application/x-www-form-urlencoded', 'The "explode" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
let schemaEncoding: ComponentSchema<Definition>

export class Encoding extends OASComponent {
  extensions!: Record<string, any>
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, Header>
  style!: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'

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

  // The Encoding Object may only exist for requestBodies where the
  // media type is multipart or application/x-www-form-urlencoded.
  // Request Body Object: content -> Map<string, Media Type Object>
  // Media Type Object: encoding -> Encoding Object (this object)
  static get schema (): ComponentSchema<Definition> {
    if (schemaEncoding === undefined) {
      schemaEncoding = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'style',
            before (cache, data) {
              const { allowedStyles, defaultStyle, defaultExplode } = Serializer.getValidatorSettings('query')
              cache.allowedStyles = allowedStyles
              cache.defaultStyle = defaultStyle
              cache.defaultExplode = defaultExplode
              cache.ignoreStyle = ignoreStyle(data.component)

              const { key } = data.context
              const mediaTypeData = findAncestorData<MediaTypeDefinition>(data, MediaType)
              const mediaTypeDefinition = mediaTypeData?.context.built ?? {}
              const mediaTypeSchema: SchemaDefinition = mediaTypeDefinition.schema === undefined || '$ref' in mediaTypeDefinition.schema
                ? {}
                : mediaTypeDefinition.schema
              const encodingSchema: SchemaDefinition = (mediaTypeSchema.properties?.[key] ?? {}) as SchemaDefinition // this may be a Reference but for what I'm doing I can ignore that case.
              cache.encodingSchema = encodingSchema
              cache.mediaTypeData = mediaTypeData
              cache.type = encodingSchema.type ?? ''
            },
            schema: {
              type: 'string',
              default: ({ cache }) => cache.defaultStyle,
              enum: ({ cache }) => cache.allowedStyles,
              ignored: ({ cache }) => cache.ignoreStyle
            }
          },
          {
            name: 'contentType',
            schema: {
              type: 'string',
              default ({ cache }) {
                return getDefaultContentType(cache.encodingSchema, cache.mediaTypeData)
              }
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
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Header
                }
              }
            }
          },
          {
            name: 'explode',
            schema: {
              type: 'boolean',
              default ({ cache }) {
                return cache.defaultExplode
              },
              ignored: ignoreExplode
            }
          }
        ],
        validator: {
          after (data) {
            const { built, exception, definition } = data.context
            const { cache } = data.component

            // additional "style" property validation
            // The Encoding Object may only exist for requestBodies where the
            // media type is multipart or application/x-www-form-urlencoded
            if (cache.ignoreStyle === false) {
              const style = built.style ?? ''
              const validStyle = Serializer.styleMatchesType('query', style, cache.type, built.explode as boolean)
              if (!validStyle) {
                exception.at('style').add.invalidStyle(data, { key: 'style', type: 'value' }, style, cache.type)
              }
            }

            if (built.contentType !== undefined) {
              const contentType = built.contentType
              if (!rx.mediaType.test(contentType)) {
                exception.at('contentType').add.invalidMediaType(data, { key: 'contentType', type: 'value' }, contentType)
              }
            }

            if (built.headers !== undefined) {
              const contentTypeKey = Object.keys(built.headers).find(key => key.toLowerCase() === 'content-type')
              if (contentTypeKey !== undefined) {
                exception.at('headers').add.valueIgnored(data, { node: definition.headers, key: contentTypeKey, type: 'key' }, contentTypeKey, 'Encoding headers should not include Content-Type. That is already part of the Encoding definition under the "contentType" property.')
              }
            }
          }
        }
      })
    }
    return schemaEncoding
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
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

function checkIfIgnored (key: string, allowedMediaType: RegExp | string, reason: string): ComputeFunction<string | false> {
  return data => {
    const { chain } = data.data.context
    const contextKey: string = chain[1]?.context.key
    if (contextKey === undefined) return false // if we have no context then we'll not ignore
    const ignore = typeof allowedMediaType === 'string'
      ? !contextKey.includes(allowedMediaType)
      : !allowedMediaType.test(contextKey)
    return ignore ? reason : false
  }
}
