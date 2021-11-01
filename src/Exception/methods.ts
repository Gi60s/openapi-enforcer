import { Exception } from './'
import { ExceptionMessageDataInput, LocationInput } from './types'
import { Data as ValidatorData } from '../components'
import { Operation2 as OperationDefinition2, Operation3 as OperationDefinition3 } from '../components/helpers/DefinitionTypes'
import { getExceptionMessageData, smart } from './error-codes'

type OperationDefinition = OperationDefinition2 | OperationDefinition3

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
    ? 'Value must be one of: ' + smart(acceptableValues, true) + '. Received: ' + smart(invalidValue, true)
    : 'Value must equal: ' + smart(acceptableValues[0], true) + '. Received: ' + smart(invalidValue, true)
  return result
}

export function exampleExamplesConflict (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('EXAMPLE_EXAMPLES_CONFLICT', {}, data)
}

export function exampleMediaTypeNotProduced (mediaType: string, produces: string[], data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('EXAMPLE_MEDIA_TYPE_NOT_PRODUCED', { mediaType, produces }, data)
}

export function exampleNotSerializable (example: any, schema: any, exception: Exception, data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('EXAMPLE_NOT_SERIALIZABLE', { example, exception, schema }, data)
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

export function exceedsNumberBounds (boundBy: 'maximum' | 'minimum', allowEqual: boolean, boundValue: any, invalidValue: number, data?: DataR): ExceptionMessageDataInput {
  const result = getExceptionMessageData('EXCEEDS_NUMBER_BOUNDS', { allowEqual, boundBy, boundValue, invalidValue }, data ?? {
    definition: null,
    locations: [],
    reference: ''
  })
  result.message = 'Value must be ' +
    (boundBy === 'maximum' ? 'less than' : 'greater than') +
    (allowEqual ? ' or equal to' : '') +
    smart(boundValue, false) + '. Received: ' + smart(invalidValue, false)
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
  return getExceptionMessageData('INVALID_URL', { invalidValue }, data)
}

export function invalidValueFormat (type: string, format: string, invalidValue: any, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_VALUE_FORMAT', { type, format, invalidValue }, data)
}

export function invalidVersionForComponent (componentName: string, version: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_VERSION_FOR_COMPONENT', { componentName, version }, data)
}

export function linkOperationConflict (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('LINK_OPERATION_CONFLICT', { }, data)
}

export function loaderFailedToLoadResource (path: string, cause: string, data: Data): ExceptionMessageDataInput {
  if (cause === '') cause = 'unknown'
  return getExceptionMessageData('LOADER_FAILED_TO_LOAD_RESOURCE', { path, cause }, data)
}

export function loaderPathNotCached (path: string, data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('LOADER_PATH_NOT_CACHED', { path }, data)
}

export function loaderNotAvailable (path: string, data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('LOADER_NOT_AVAILABLE', { path }, data)
}

export function mediaTypeSchemaMustBeObject (type: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('MEDIA_TYPE_SCHEMA_MUST_BE_OBJECT', { type }, data)
}

export function missingRequiredProperties (properties: string[], data: DataR): ExceptionMessageDataInput {
  const result = getExceptionMessageData('MISSING_REQUIRED_PROPERTIES', { properties }, data)
  if (properties.length === 1) result.message = 'Missing required property: ' + properties.join(', ')
  return result
}

export function mustNotBeNull (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('MUST_NOT_BE_NULL', { }, data)
}

export function noPathsDefined (data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('NO_PATHS_DEFINED', { }, data)
}

export function operationMethodShouldNotHaveBody (method: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('OPERATION_METHOD_REQUEST_BODY_NOT_ADVISED', { method, upperMethod: method.toUpperCase() }, data)
}

export function operationIdMustBeUnique (operationId: string, conflictsData: Array<ValidatorData<OperationDefinition>>, data: DataR): ExceptionMessageDataInput {
  const conflicts = conflictsData.map(conflict => {
    const { key: method, chain } = conflict.context
    const { key: path } = chain[0]?.context ?? { path: '' }
    return method.toUpperCase() + ' ' + path // operation method and path
  })
  return getExceptionMessageData('OPERATION_ID_MUST_BE_UNIQUE', { operationId, conflicts, operations: conflictsData }, data)
}

export function pathEndingsInconsistent (pathsWithTrailingSlash: string[], pathsWithoutTrailingSlash: string[], data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('PATH_ENDINGS_INCONSISTENT', { pathsWithTrailingSlash, pathsWithoutTrailingSlash }, data)
}

export function pathMissingMethods (path: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('PATH_MISSING_METHODS', { path }, data)
}

export function pathParameterMustBeRequired (parameterName: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('PATH_PARAMETER_MUST_BE_REQUIRED', { parameterName }, data)
}

export function propertyIgnored (value: string, reason: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('PROPERTY_IGNORED', { value, reason }, data)
}

export function propertyNotAllowed (propertyName: string, reason: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('PROPERTY_NOT_ALLOWED', { propertyName, reason }, data)
}

export function refInfiniteLoop (data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('REF_INFINITE_LOOP', { }, data)
}

export function refInvalidStart (data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('REF_INVALID_START', { }, data)
}

export function refNotResolved (ref: string, from: string, data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('REF_NOT_RESOLVED', { ref, from }, data)
}

export function responseBodyNotAllowed (type: 'schema' | 'content', data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('RESPONSE_BODY_NOT_ALLOWED', { type }, data)
}

export function responseRequired (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('RESPONSE_REQUIRED', { }, data)
}

export function responseShouldIncludeLocationHeader (data: Data): ExceptionMessageDataInput {
  const result = getExceptionMessageData('RESPONSE_SHOULD_INCLUDE_LOCATION_HEADER', { }, data)
  result.reference = 'https://tools.ietf.org/html/rfc7231#section-4.3.3'
  return result
}

export function responsesShouldIncludeSuccess (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('RESPONSE_SHOULD_INCLUDE_SUCCESS', { }, data)
}

export function securityRequirementNotEmptyArray (major: number, data: DataR): ExceptionMessageDataInput {
  const result = getExceptionMessageData('SECURITY_REQUIREMENT_NOT_EMPTY_ARRAY', { }, data)
  result.message = 'Security requirement value must be an empty array unless associated security scheme type is ' +
      (major === 2 ? 'oauth2' : 'either oauth2 or openIdConnect')
  return result
}

export function securitySchemeMissingReference (major: number, data: DataR): ExceptionMessageDataInput {
  const result = getExceptionMessageData('SECURITY_SCHEME_MISSING_REFERENCE', { }, data)
  result.message = 'Security scheme name must have an associated reference at ' +
      (major === 2 ? 'Swagger > SecurityDefinitions' : 'OpenAPI > Components > SecuritySchemes')
  return result
}

export function securitySchemeNotUrl (data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('SECURITY_SCHEME_NOT_URL', { }, data)
}

export function swaggerBasePathInvalid (basePath: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('SWAGGER_BASE_PATH_INVALID', { basePath }, data)
}

export function swaggerBasePathTemplating (basePath: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('SWAGGER_BASE_PATH_TEMPLATING', { basePath }, data)
}

export function swaggerHostDoesNotSupportPathTemplating (host: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('SWAGGER_HOST_DOES_NOT_SUPPORT_PATH_TEMPLATING', { host }, data)
}

export function swaggerHostHasScheme (host: string, scheme: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('SWAGGER_HOST_HAS_SCHEME', { host, scheme }, data)
}

export function swaggerHostHasSubPath (host: string, subPath: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('SWAGGER_HOST_HAS_SUBPATH', { host, subPath }, data)
}

export function unknownTypeFormat (type: string, format: string, data: Data): ExceptionMessageDataInput {
  return getExceptionMessageData('UNKNOWN_TYPE_FORMAT', { type, format }, data)
}

export function valueIgnored (value: string, reason: string, data: DataR): ExceptionMessageDataInput {
  return getExceptionMessageData('VALUE_IGNORED', { value, reason }, data)
}

/* /////////////////////////////////
//                                //
//  NON-SCHEMA VALIDATION ERRORS  //
//                                //
///////////////////////////////// */

export function invalidValue (expected: string, invalidValue: any): ExceptionMessageDataInput {
  return getExceptionMessageData('INVALID_VALUE', { expected, invalidValue }, {
    definition: null,
    locations: [],
    reference: ''
  })
}

export function notMultipleOf (multipleOf: number, invalidValue: any): ExceptionMessageDataInput {
  return getExceptionMessageData('NOT_MULTIPLE_OF', { invalidValue, multipleOf }, {
    definition: null,
    locations: [],
    reference: ''
  })
}

export function randomPasswordWarning (): ExceptionMessageDataInput {
  return getExceptionMessageData('RANDOM_PASSWORD_WARNING', { }, {
    definition: null,
    locations: [],
    reference: ''
  })
}
