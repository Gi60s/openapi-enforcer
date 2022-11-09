import { smart } from '../util'
import { ILocation } from '../Locator/ILocator'
import { IExceptionData } from './IException'
import { getLocation } from '../Locator/Locator'
import { ISchemaProcessor, ISchemaProcessorComponentData } from "../components-old/ISchemaProcessor";

type ILocations = Array<ILocation | undefined>

interface Data {
  componentId: string
  componentName: string
  definition: any
  reference: string
}

export function emailInvalid (cmp: ISchemaProcessorComponentData, email: string, locations: ILocations): IExceptionData {
  return {
    id: cmp.id + '_INVALID_EMAIL',
    level: 'warn',
    locations,
    message: 'Email appears to be invalid: ' + smart(email)
  }
}

export function encodingContentTypeIgnored (data: Data, contentTypeKey: string): IExceptionData {
  const { definition } = data
  return {
    id: 'ENCODING_HEADER_IGNORED',
    level: 'warn',
    locations: [getLocation(definition.headers, contentTypeKey)],
    message: 'Encoding headers should not include Content-Type. That is already part of the Encoding ' +
      'definition under the "contentType" property.',
    metadata: {
      key: contentTypeKey,
      value: definition.headers[contentTypeKey]
    }
  }
}

export function discriminatorMappingUnresolved (data: Data, key: string): IExceptionData {
  const { definition } = data
  const value = definition.mapping[key]
  return {
    id: 'DISCRIMINATOR_MAPPING_UNRESOLVED',
    level: 'warn',
    locations: [getLocation(definition, key, 'value')],
    message: 'Cannot resolve mapping: ' + smart(value),
    metadata: {
      key,
      value
    }
  }
}

export function mediaTypeInvalid (data: Data, property: string, mediaType: string, locationFilter: 'key' | 'value'): IExceptionData {
  const { componentId, definition } = data
  return {
    id: componentId + '_MEDIA_TYPE_INVALID',
    level: 'warn',
    locations: [getLocation(definition, property, locationFilter)],
    message: 'Media type appears invalid: ' + smart(mediaType),
    metadata: {
      mediaType
    }
  }
}

export function parameterStyleInvalid (data: Data, style: string, type: string, at: string, explode: boolean): IExceptionData {
  const { componentId, definition, reference } = data
  return {
    id: componentId + '_PARAMETER_STYLE_INVALID',
    level: 'error',
    locations: [getLocation(definition, 'style', 'value')],
    message: 'Style ' + smart(style) + ' is incompatible with ' + smart(at) + ' parameter.',
    metadata: {
      in: at,
      style
    },
    reference
  }
}

// export function propertiesMutuallyExclusive (data: Data, properties: string[]): IExceptionData {
//   const { componentId, definition, reference } = data
//   return {
//     id: componentId + '_PROPERTY_CONFLICT',
//     level: 'error',
//     locations: properties.map(p => getLocation(definition, p, 'key')),
//     message: 'These properties are mutually exclusive: ' + smart(properties),
//     metadata: { properties },
//     reference
//   }
// }

export function styleInvalid (data: Data, style: string, type: string, explode: boolean): IExceptionData {
  const { componentId, definition, reference } = data
  return {
    id: componentId + '_STYLE_INVALID',
    level: 'error',
    locations: [getLocation(definition, 'style', 'value')],
    message: 'Style ' + smart(style) + ' is incompatible with type ' + smart(type) +
      ' when explode is set to ' + String(explode) + '.',
    metadata: {
      explode,
      style
    },
    reference
  }
}

// export function urlInvalid (cmp: ISchemaProcessorComponentData, url: string, locations: ILocations): IExceptionData {
//   return {
//     id: cmp.id + '_URL_INVALID',
//     level: 'warn',
//     locations,
//     message: 'URL appears to be invalid: ' + smart(url),
//     metadata: {
//       url: url
//     },
//     reference: cmp.reference
//   }
// }
