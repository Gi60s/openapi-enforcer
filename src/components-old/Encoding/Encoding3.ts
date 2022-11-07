import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { IEncoding3, IEncoding3Definition } from './IEncoding'
import { ISchemaProcessorData } from '../ISchemaProcessor'
import { IComponentSchemaObject, IComputeFunction } from '../IComponentSchema'
import { getLocation } from '../../Locator/Locator'
import { encodingContentTypeIgnored, mediaTypeInvalid, styleInvalid } from '../../Exception/methods'

const ignoreStyle = checkIfIgnored('style', 'application/x-www-form-urlencoded', 'The "style" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
const ignoreAllowReserved = checkIfIgnored('allowReserved', 'application/x-www-form-urlencoded', 'The "allowReserved" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')
const ignoreExplode = checkIfIgnored('explode', 'application/x-www-form-urlencoded', 'The "explode" property is ignored unless the request body media type is "application/x-www-form-urlencoded".')

export class Encoding extends EnforcerComponent<IEncoding3Definition, Encoding> implements IEncoding3 {
  extensions!: Record<string, any>
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, Header>
  style!: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'

  constructor (definition: IEncoding3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#encoding-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#encoding-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#encoding-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#encoding-object'
  }

  // The Encoding Object may only exist for requestBodies where the
  // media type is multipart or application/x-www-form-urlencoded.
  // Request Body Object: content -> Map<string, Media Type Object>
  // Media Type Object: encoding -> Encoding Object (this object)
  static validate (definition: IEncoding3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static getSchema (data: ISchemaProcessorData): IComponentSchemaObject {
    const { allowedStyles, defaultStyle, defaultExplode } = Serializer.getValidatorSettings('query')
    const { key } = data
    const mediaTypeData = findAncestorData<MediaTypeDefinition>(data, MediaType)
    const mediaTypeDefinition = mediaTypeData?.context.built ?? {}
    const mediaTypeSchema: SchemaDefinition = mediaTypeDefinition.schema === undefined || '$ref' in mediaTypeDefinition.schema
      ? {}
      : mediaTypeDefinition.schema
    const encodingSchema: SchemaDefinition = (mediaTypeSchema.properties?.[key] ?? {}) as SchemaDefinition // this may be a Reference but for what I'm doing I can ignore that case.
    const type = encodingSchema.type ?? ''

    return {
      type: 'object',
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
            default: getDefaultContentType(encodingSchema, mediaTypeData)
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
      after (data) {
        if (data.mode === 'validate') {
          const { built, exception, definition, reference } = data

          // additional "style" property validation
          // The Encoding Object may only exist for requestBodies where the
          // media type is multipart or application/x-www-form-urlencoded
          if (ignoreStyle === false) {
            const style = built.style ?? ''
            const validStyle = Serializer.styleMatchesType('query', style, type, built.explode as boolean)
            if (!validStyle) {
              exception.add(styleInvalid(data, style, type, built.explode))
            }
          }

          if (definition.contentType !== undefined) {
            const contentType = definition.contentType
            if (!rx.mediaType.test(contentType)) {
              exception.add(mediaTypeInvalid(data, 'contentType', contentType, 'value'))
            }
          }

          if (built.headers !== undefined) {
            const contentTypeKey = Object.keys(built.headers).find(key => key.toLowerCase() === 'content-type')
            if (contentTypeKey !== undefined) {
              exception.add(encodingContentTypeIgnored(data, contentTypeKey))
            }
          }
        }
      }
    }
  }
}

function checkIfIgnored (key: string, allowedMediaType: RegExp | string, reason: string): IComputeFunction<string | false> {
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

function getSchema (data: ISchemaProcessorData): IComponentSchemaObject {

}
