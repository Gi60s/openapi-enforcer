import { Exception } from './'
import { ExceptionMessageDataInput, LocationInput } from './types'
import { smart } from '../util'
import { getExceptionMessageData } from './error-codes'

interface Data {
  definition: any
  locations: LocationInput[]
}

interface DataR {
  definition: any
  locations: LocationInput[]
  reference: string
}

export function $refNotAllowed (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('$REF_NOT_ALLOWED', {}, data)
}

export function defaultRequiredConflict (data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('DEFAULT_REQUIRED_CONFLICT', {}, data)
}

export function defaultValueDoesNotMatchSchema (defaultValue: any, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('DEFAULT_VALUE_DOES_NOT_MATCH_SCHEMA', { defaultValue }, data)
}

export function encodingNameNotMatched (encodingName: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('ENCODING_NAME_NOT_MATCHED', { encodingName }, data)
}

export function encodingHeaderContentType (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('ENCODING_HEADER_CONTENT_TYPE', {}, data)
}

export function encodingHeadersIgnored (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('ENCODING_HEADERS_IGNORED', {}, data)
}

export function enumMissingValues (data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('ENUM_MISSING_VALUES', {}, data)
}

export function enumNotMet (acceptableValues: any[], invalidValue: any, data: DataR): ExceptionMessageDataInput {
  const result = getExceptionMessageData('ENUM_NOT_MET', { acceptableValues, invalidValue }, data)
  result.message = acceptableValues.length > 1
    ? 'Value must be one of: ' + acceptableValues.map(v => smart(v)).join(', ') + '. Received: ' + smart(invalidValue)
    : 'Value must equal: ' + smart(acceptableValues[0]) + '. Received: ' + smart(invalidValue)
  return result
}

export function exampleExamplesConflict (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('EXAMPLE_EXAMPLES_CONFLICT', {}, data)
}

export function exampleNotSerializable (example: any, schema: any, exception: Exception, data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('EXAMPLE_EXAMPLES_CONFLICT', { example, exception, schema }, data)
}

export function exampleNotValid (example: any, schema: any, exception: Exception, data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('EXAMPLE_NOT_VALID', { example, exception, schema }, data)
}

export function exampleValueExternalConflict (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('EXAMPLE_VALUE_EXTERNAL_CONFLICT', {}, data)
}

export function exampleWithoutSchema (data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('EXAMPLE_WITHOUT_SCHEMA', {}, data)
}

export function exceedsNumberBounds (boundBy: 'maximum' | 'minimum', allowEqual: boolean, boundValue: any, invalidValue: number, data: DataR): ExceptionMessageDataInput {
  const result = getExceptionMessageData('EXCEEDS_NUMBER_BOUNDS', { allowEqual, boundBy, boundValue, invalidValue }, data)
  result.message = 'Value must be ' +
    (boundBy === 'maximum' ? 'less than' : 'greater than') +
    (allowEqual ? ' or equal to' : '') +
    smart(boundValue) + '. Received: ' + smart(invalidValue)
  return result
}

export function exceedsStringLengthBounds (boundBy: 'maxLength' | 'minLength', boundValue: number, invalidValue: string, data: DataR): ExceptionMessageDataInput {
  const result = getExceptionMessageData('EXCEEDS_STRING_LENGTH_BOUNDS', { boundBy, boundValue, invalidValue }, data)
  result.message = 'Value must have length ' +
    (boundBy === 'maxLength' ? 'less than' : 'greater than') +
    ' or equal to' + String(boundValue) +
    '. Received: ' + String(invalidValue) + ' (length of ' + String(invalidValue.length) + ')'
  return result
}

export function exceedsSummaryLength (summary: string, data: DataR): ExceptionMessageDataInput {
  const length = summary.length
  return getExceptionMessageData('EXCEEDS_SUMMARY_LENGTH', { length, summary }, data)
}

export function extensionNotAllowed (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('EXTENSION_NOT_ALLOWED', {}, data)
}

export function invalidAdditionalPropertiesSchema (invalidSchema: any, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_ADDITIONAL_PROPERTIES_SCHEMA', { invalidSchema }, data)
}

// TODO: keep moving these over to error-codes.ts
export function invalidCookieExplode (parameterName: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_COOKIE_EXPLODE', { parameterName }, data)
}

export function invalidEmail (invalidValue: any, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_EMAIL', { invalidValue }, data)
}

export function invalidMaxMin (minimum: any, maximum: any, minProperty: string, maxProperty: string, data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_EMAIL', { minimum, maximum, minProperty, maxProperty }, data)
}

export function invalidMediaType (mediaType: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_MEDIA_TYPE', { mediaType }, data)
}

export function invalidOpenApiVersionNumber (version: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_OPENAPI_VERSION_NUMBER', { version }, data)
}

export function invalidResponseCode (code: string, data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_RESPONSE_CODE', { code }, data)
}

export function invalidResponseLinkKey (key: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_RESPONSE_LINK_KEY', { key }, data)
}

export function invalidSemanticVersionNumber (version: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_SEMANTIC_VERSION_NUMBER', { version }, data)
}

export function invalidStyle (style: string, type: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_PARAMETER_STYLE', { style, type }, data)
}

export function invalidType (expectedType: string, invalidValue: any, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_TYPE', { expectedType, invalidValue }, data)
}

export function invalidUrl (invalidValue: any, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'DVIURL',
    definition: data.definition,
    locations: data.locations,
    message: 'Value does not appear to be a valid URL: ' + smart(invalidValue),
    metadata: {
      invalidValue
    },
    reference: data.reference
  }
}

export function invalidValue (expected: string, value: any, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'DTNVAL',
    definition: data.definition,
    locations: data.locations,
    message: 'Value is not valid. Expected ' + expected + '. Received: ' + smart(value),
    metadata: {
      expected,
      value
    },
    reference: data.reference
  }
}

export function invalidValueFormat (expected: string, format: string, value: any, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'DTFRMT',
    definition: data.definition,
    locations: data.locations,
    message: 'Expected ' + expected + ' of the format ' + format + '. Received: ' + smart(value),
    metadata: {
      expected,
      format,
      value
    },
    reference: data.reference
  }
}

export function invalidVersionForComponent (componentName: string, version: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'DVVERS',
    definition: data.definition,
    locations: data.locations,
    message: componentName + ' object is not supported by OpenAPI specification version ' + version,
    metadata: {
      componentName,
      version
    },
    reference: data.reference
  }
}

export function linkOperationConflict (data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'LNKCFL',
    definition: data.definition,
    locations: data.locations,
    message: 'Must not define both operationId and operationRef',
    metadata: {},
    reference: data.reference
  }
}

export function loaderFailedToLoadResource (path: string, cause: string, data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'LOADLF',
    definition: data.definition,
    locations: data.locations,
    message: 'Unable to load resource: ' + path + (cause.length > 0 ? '. ' + cause : ''),
    metadata: { cause, path },
    reference: ''
  }
}

export function loaderPathNotCached (path: string, data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'LOADCA',
    definition: data.definition,
    locations: data.locations,
    message: 'Cannot find node for path: "' + path,
    metadata: { path },
    reference: ''
  }
}

export function loaderNotAvailable (path: string, data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'LOADNA',
    definition: data.definition,
    locations: data.locations,
    message: 'No defined loaders were able to load the path: ' + path,
    metadata: { path },
    reference: ''
  }
}

export function mediaTypeSchemaMustBeObject (type: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'MEDSCO',
    definition: data.definition,
    locations: data.locations,
    message: 'MediaType schema must be of type "object". Received type: ' + type,
    metadata: { type },
    reference: data.reference
  }
}

export function missingRequiredProperties (properties: string[], data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'DVPREQ',
    definition: data.definition,
    locations: data.locations,
    message: properties.length === 1
      ? 'Missing required property: ' + properties[0]
      : 'Missing required properties: ' + properties.join(', '),
    metadata: {
      properties
    },
    reference: data.reference
  }
}

export function mustNotBeNull (data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'DVPREQ',
    definition: data.definition,
    locations: data.locations,
    message: 'Value must not be null.',
    metadata: {},
    reference: data.reference
  }
}

export function noPathsDefined (data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'PTHSND',
    definition: data.definition,
    locations: data.locations,
    message: 'No paths defined',
    metadata: {},
    reference: ''
  }
}

export function notMultipleOf (multipleOf: number, value: any, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'DTMULT',
    definition: data.definition,
    locations: data.locations,
    message: 'Expected a multiple of ' + String(multipleOf) + '. Received: ' + smart(value),
    metadata: {
      multipleOf,
      value
    },
    reference: data.reference
  }
}

export function operationMethodShouldNotHaveBody (method: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'OPRBDY',
    definition: data.definition,
    locations: data.locations,
    message: 'Including a request body with a ' + method.toUpperCase() + ' request is against the REST specification. Additionally, some of your network infrastructure may not support a body in this method',
    metadata: {
      method
    },
    reference: data.reference
  }
}

export function operationIdMustBeUnique (operationId: string, conflicts: any[], data: DataR): ExceptionMessageDataInput {
  return {
    active (): boolean {
      return conflicts.length > 1
    },
    alternateLevels: [],
    level: 'error',
    code: 'OPRIID',
    definition: data.definition,
    locations: data.locations,
    message: 'The operationId "' + operationId + '" must be unique.',
    metadata: {
      get conflicts (): string[] {
        return conflicts
          .filter(conflict => conflict.chain.length >= 2)
          .map(conflict => {
            const { chain } = conflict
            return (chain[2].key as string).toUpperCase() + ' ' + (chain[1].key as string) // operation method and path
          })
      },
      operationId
    },
    reference: data.reference
  }
}

export function pathEndingsInconsistent (pathsWithTrailingSlash: string[], pathsWithoutTrailingSlash: string[], data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'PTHINC',
    definition: data.definition,
    locations: data.locations,
    message: 'Path endings are inconsistent. Some paths end with a slash and some do not.',
    metadata: {
      pathsWithTrailingSlash,
      pathsWithoutTrailingSlash
    },
    reference: ''
  }
}

export function pathMissingMethods (path: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'NOMTHD',
    definition: data.definition,
    locations: data.locations,
    message: 'No methods defined for path: ' + path,
    metadata: {
      path
    },
    reference: data.reference
  }
}

export function pathParameterMustBeRequired (parameterName: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'PATREQ',
    definition: data.definition,
    locations: data.locations,
    message: 'Path parameters must be marked as required. Parameter: ' + parameterName,
    metadata: {
      parameterName
    },
    reference: data.reference
  }
}

export function propertyNotAllowed (propertyName: string, reason: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'DVPNAL',
    definition: data.definition,
    locations: data.locations,
    message: 'Property "' + propertyName + '" not allowed.' + (reason.length > 0 ? ' ' + reason : ''),
    metadata: {
      propertyName,
      reason
    },
    reference: data.reference
  }
}

export function randomPasswordWarning (data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'DTRPAS',
    definition: data.definition,
    locations: data.locations,
    message: 'It may not be safe to use this random value as a password',
    metadata: {},
    reference: ''
  }
}

export function refInfiniteLoop (data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'REFPIL',
    definition: data.definition,
    locations: data.locations,
    message: 'Unresolvable infinite loop',
    metadata: {},
    reference: ''
  }
}

export function refInvalidStart (data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'REFINS',
    definition: data.definition,
    locations: data.locations,
    message: 'References must start with #/',
    metadata: {},
    reference: ''
  }
}

export function refNotResolved (ref: string, from: string, data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'REFTNF',
    definition: data.definition,
    locations: data.locations,
    message: 'Cannot resolve reference "' + ref + '" from "' + from + '"',
    metadata: { ref, from },
    reference: ''
  }
}

export function responseBodyNotAllowed (type: 'schema' | 'content', data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'RESNBD',
    definition: data.definition,
    locations: data.locations,
    message: 'A 204 response must not contain a body but this response has a defined ' + type,
    metadata: {
      type
    },
    reference: ''
  }
}

export function responseRequired (data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'RESNOV',
    definition: data.definition,
    locations: data.locations,
    message: 'Responses object must define at least one response',
    metadata: {},
    reference: data.reference
  }
}

export function responseShouldIncludeLocationHeader (data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'RESPHD',
    definition: data.definition,
    locations: data.locations,
    message: 'A 201 response for a POST request should return a location header and this is not documented in your OpenAPI document',
    metadata: {},
    reference: 'https://tools.ietf.org/html/rfc7231#section-4.3.3'
  }
}

export function responsesShouldIncludeSuccess (data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'RESNOS',
    definition: data.definition,
    locations: data.locations,
    message: 'Responses object should define at least one success (200 level) response or a default response',
    metadata: {},
    reference: data.reference
  }
}

export function securityRequirementNotEmptyArray (major: number, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'SSNEAR',
    definition: data.definition,
    locations: data.locations,
    message: 'Security requirement value must be an empty array unless associated security scheme type is ' +
      (major === 2 ? 'oauth2' : 'either oauth2 or openIdConnect'),
    metadata: {},
    reference: data.reference
  }
}

export function securitySchemeMissingReference (major: number, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'SSNAME',
    definition: data.definition,
    locations: data.locations,
    message: 'Security scheme name must have an associated reference at ' +
      (major === 2 ? 'Swagger > SecurityDefinitions' : 'OpenAPI > Components > SecuritySchemes'),
    metadata: {},
    reference: data.reference
  }
}

export function securitySchemeNotUrl (data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'SSOURL',
    definition: data.definition,
    locations: data.locations,
    message: 'Value must be a URL',
    metadata: {},
    reference: data.reference
  }
}

export function swaggerBasePathInvalid (basePath: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'SWGBPT',
    definition: data.definition,
    locations: data.locations,
    message: 'The base path must start with a forward slash: ' + basePath,
    metadata: {
      basePath
    },
    reference: data.reference
  }
}

export function swaggerBasePathTemplating (basePath: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'SWGBPT',
    definition: data.definition,
    locations: data.locations,
    message: 'The base path does not support path templating: ' + basePath,
    metadata: {
      basePath
    },
    reference: data.reference
  }
}

export function swaggerHostDoesNotSupportPathTemplating (host: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'SWGHPT',
    definition: data.definition,
    locations: data.locations,
    message: 'The host does not support path templating: ' + host,
    metadata: {
      host
    },
    reference: data.reference
  }
}

export function swaggerHostHasScheme (host: string, scheme: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'SWGHPR',
    definition: data.definition,
    locations: data.locations,
    message: 'The host must not include the scheme: ' + scheme,
    metadata: {
      host,
      scheme
    },
    reference: data.reference
  }
}

export function swaggerHostHasSubPath (host: string, subPath: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: [],
    level: 'error',
    code: 'SWGHBP',
    definition: data.definition,
    locations: data.locations,
    message: 'The host must not include sub path: ' + subPath,
    metadata: {
      host,
      subPath
    },
    reference: data.reference
  }
}

export function unknownTypeFormat (type: string, format: string, data: Data): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'SWGHBP',
    definition: data.definition,
    locations: data.locations,
    message: 'Non-standard format "' + format + '" used for type "' + type + '"',
    metadata: {
      format,
      type
    },
    reference: ''
  }
}

export function valueIgnored (value: string, reason: string, data: DataR): ExceptionMessageDataInput {
  return {
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    code: 'IGNORD',
    definition: data.definition,
    locations: data.locations,
    message: 'The following value will be ignored: ' + value + '.' + (reason !== '' ? ' ' + reason : ''),
    metadata: {
      reason,
      value
    },
    reference: data.reference
  }
}
