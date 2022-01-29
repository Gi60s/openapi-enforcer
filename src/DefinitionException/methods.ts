import { Exception } from '../utils/Exception'
import { ExceptionMessageDataInput, Level, LocationInput } from './types'
import { ValidatorData } from '../components/helpers/builder-validator-types'
import { Operation2 as OperationDefinition2, Operation3 as OperationDefinition3 } from '../components/helpers/definition-types'

type OperationDefinition = OperationDefinition2 | OperationDefinition3

interface MessageData {
  code: string
  alternateLevels: Level[]
  level: Level
  message: string
  metadata?: Record<string, any>
}

export function $refIgnoresSiblings (data: ValidatorData, location: LocationInput, siblingProperties: string[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'REIGSI',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Objects with a $ref property will cause all other sibling properties to be ignored. Ignored properties: ' + smart(siblingProperties)
  })
}

export function $refNotAllowed (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'RENOAL',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Reference not allowed here.'
  })
}

export function allOfConflictingSchemaTypes (data: ValidatorData, location: LocationInput, types: string[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'ALOCST',
    alternateLevels: [],
    level: 'error',
    message: 'Subschemas within "allOf" should be able to resolve to the same type. Types found: ' + smart(types),
    metadata: { types }
  })
}

export function allOfConflictingSchemaFormats (data: ValidatorData, location: LocationInput, formats: string[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'ALOCSF',
    alternateLevels: [],
    level: 'error',
    message: 'Subschemas within "allOf" should be able to resolve to the same type formats. Formats found: ' + smart(formats),
    metadata: { formats }
  })
}

export function defaultRequiredConflict (data: ValidatorData, locations: LocationInput[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, locations, false, {
    code: 'DERECO',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Setting a "default" value and setting "required" to true means the "default" value will never be used.'
  })
}

export function defaultValueDoesNotMatchSchema (data: ValidatorData, location: LocationInput, defaultValue: any): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'DVDNMS',
    alternateLevels: [], // ['ignore', 'opinion', 'warn', 'error'],
    level: 'error',
    message: 'Default value ' + smart(defaultValue) + ' does not match its associated schema.',
    metadata: { defaultValue }
  })
}

export function encodingNameNotMatched (data: ValidatorData, location: LocationInput, encodingName: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'ENNANM',
    alternateLevels: [],
    level: 'error',
    message: 'Encoding name ' + smart(encodingName) + ' must match a property name in the media type\'s schema',
    metadata: { encodingName }
  })
}

export function encodingHeaderContentType (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'ENHECT',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Encoding headers should not include Content-Type. That is already part of the Encoding definition under the "contentType" property.'
  })
}

export function encodingHeadersIgnored (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'ENHEIG',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Encoding headers ignored unless part of a request body with content multipart/*.'
  })
}

export function enumMissingValues (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'ENMIVA',
    alternateLevels: [],
    level: 'error',
    message: 'Enum should not be an empty array.'
  })
}

export function enumNotMet (data: ValidatorData, location: LocationInput, acceptableValues: any[], invalidValue: any): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'ENNOME',
    alternateLevels: [],
    level: 'error',
    message: acceptableValues.length > 1
      ? 'Value must be one of: ' + smart(acceptableValues) + '. Received: ' + smart(invalidValue)
      : 'Value must equal: ' + smart(acceptableValues[0]) + '. Received: ' + smart(invalidValue),
    metadata: { acceptableValues, invalidValue }
  })
}

export function exampleMediaTypeNotProduced (data: ValidatorData, location: LocationInput, mediaType: string, produces: string[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'EXMTNP',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Example uses media type ' + smart(mediaType) + ' that is not listed in the possible list of produces: ' + smart(produces),
    metadata: { mediaType, produces }
  })
}

export function exampleNotSerializable (data: ValidatorData, location: LocationInput, example: any, schema: any, exception: Exception): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'EXNOSE',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Example could not be serialized and therefore cannot be validated against the schema.',
    metadata: { example, exception, schema }
  })
}

export function exampleNotValid (data: ValidatorData, location: LocationInput, example: any, schema: any, exception: Exception): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'EXNOVA',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Example is not valid when compared against the schema.',
    metadata: { example, exception, schema }
  })
}

export function exampleWithoutSchema (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'EXWISC',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'opinion',
    message: 'An example is great, but you should add a schema. A schema can provide more detailed information than an example.'
  })
}

export function exceedsArrayLengthBounds (data: ValidatorData, location: LocationInput, boundBy: 'maxItems' | 'minItems', boundValue: number, actualCount: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'EXARLB',
    alternateLevels: [],
    level: 'error',
    message: 'Array must have ' +
      (boundBy === 'maxItems' ? 'at most ' : 'at least ') + String(boundValue) +
      ' items. Array contains ' + String(actualCount) + ' items.',
    metadata: { boundBy, boundValue, actualCount }
  })
}

export function exceedsNumberBounds (data: ValidatorData, location: LocationInput, boundBy: 'maximum' | 'minimum', allowEqual: boolean, boundValue: any, invalidValue: number): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'EXNUBO',
    alternateLevels: [],
    level: 'error',
    message: 'Value must be ' +
      (boundBy === 'maximum' ? 'less than ' : 'greater than ') +
      (allowEqual ? 'or equal to ' : '') +
      smart(boundValue, false) + '. Received: ' + smart(invalidValue, false),
    metadata: { allowEqual, boundBy, boundValue, invalidValue }
  })
}

export function exceedsStringLengthBounds (data: ValidatorData, location: LocationInput, boundBy: 'maxLength' | 'minLength', boundValue: number, invalidValue: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'EXSTLB',
    alternateLevels: [],
    level: 'error',
    message: 'Value must have length ' +
      (boundBy === 'maxLength' ? 'less than' : 'greater than') +
      ' or equal to' + String(boundValue) +
      '. Received: ' + String(invalidValue) + ' (length of ' + String(invalidValue.length) + ')',
    metadata: { boundBy, boundValue, invalidValue }
  })
}

export function exceedsSummaryLength (data: ValidatorData, location: LocationInput, summary: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'EXSULE',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Summary should be less than 120 characters in length. Current length: ' + smart(length),
    metadata: { length: summary.length, summary }
  })
}

export function extensionNotAllowed (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'EXNOAL',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Schema extensions not allowed here.'
  })
}

export function invalidAdditionalPropertiesSchema (data: ValidatorData, location: LocationInput, invalidSchema: any): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INADPS',
    alternateLevels: [],
    level: 'error',
    message: 'Additional properties must be either a boolean or a valid schema definition.',
    metadata: { invalidSchema }
  })
}

export function invalidCookieExplode (data: ValidatorData, location: LocationInput, parameterName: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INCOEX',
    alternateLevels: [],
    level: 'error',
    message: 'Cookies do not support exploded values for schemas of type array or object.',
    metadata: { parameterName }
  })
}

export function invalidEmail (data: ValidatorData, location: LocationInput, invalidValue: any): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INVEMA',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Value does not appear to be a valid email address: ' + smart(invalidValue),
    metadata: { invalidValue }
  })
}

export function invalidMaxMin (data: ValidatorData, locations: LocationInput[], minimum: any, maximum: any, minProperty: string, maxProperty: string, exclusive = false): ExceptionMessageDataInput {
  return getExceptionMessageData(data, locations, false, {
    code: 'INMAMI',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'error',
    message: 'Property ' + smart(minProperty) + ' (' + smart(minimum, false) + ') must be less than ' +
      (exclusive ? 'or equal to ' : '') +
      smart(maxProperty) + ' (' + smart(maximum, false) + ').',
    metadata: { minimum, maximum, minProperty, maxProperty }
  })
}

export function invalidMediaType (data: ValidatorData, location: LocationInput, mediaType: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INMETY',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Media type appears invalid: ' + smart(mediaType),
    metadata: { mediaType }
  })
}

export function invalidMultipleOf (data: ValidatorData, location: LocationInput, value: any): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INMETY',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Multiple of value must be greater than zero. Received: ' + smart(value),
    metadata: { value }
  })
}

export function invalidOpenApiVersionNumber (data: ValidatorData, location: LocationInput, version: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INOPVN',
    alternateLevels: [],
    level: 'error',
    message: 'OpenAPI specification version not supported: ' + smart(version),
    metadata: { version }
  })
}

export function invalidResponseCode (data: ValidatorData, location: LocationInput, code: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'INRECO',
    alternateLevels: [],
    level: 'error',
    message: 'Invalid response code: ' + smart(code),
    metadata: { code }
  })
}

export function invalidResponseLinkKey (data: ValidatorData, location: LocationInput, key: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INRELK',
    alternateLevels: [],
    level: 'error',
    message: 'Invalid key used for link value: ' + smart(key),
    metadata: { key }
  })
}

export function invalidSemanticVersionNumber (data: ValidatorData, location: LocationInput, version: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INSEVN',
    alternateLevels: [],
    level: 'error',
    message: 'Value must be a semantic version number.',
    metadata: { version }
  })
}

export function invalidStyle (data: ValidatorData, location: LocationInput, style: string, type: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INPAST',
    alternateLevels: [],
    level: 'error',
    message: 'Style ' + smart(style) + ' is incompatible with schema type: ' + smart(type),
    metadata: { style, type }
  })
}

export function invalidType (data: ValidatorData, location: LocationInput, expectedType: string, invalidValue: any): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INVTYP',
    alternateLevels: [],
    level: 'error',
    message: 'Invalid type. Expected ' + smart(expectedType, false) + '. Received: ' + smart(invalidValue),
    metadata: { expectedType, invalidValue }
  })
}

export function invalidUrl (data: ValidatorData, location: LocationInput, invalidValue: any): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INVURL',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'error',
    message: 'Value does not appear to be a valid URL: ' + smart(invalidValue),
    metadata: { invalidValue }
  })
}

export function invalidVersionForComponent (data: ValidatorData, location: LocationInput, componentName: string, version: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'INVEFC',
    alternateLevels: [],
    level: 'error',
    message: smart(componentName) + ' object is not supported by the OpenAPI specification version ' + smart(version),
    metadata: { componentName, version }
  })
}

export function linkOperationConflict (data: ValidatorData, locations: LocationInput[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, locations, true, {
    code: 'LIOPCO',
    alternateLevels: [],
    level: 'error',
    message: 'The operationId and operationRef are mutually exclusive.'
  })
}

export function loaderFailedToLoadResource (path: string, cause: string): ExceptionMessageDataInput {
  if (cause === '') cause = 'unknown'
  return getExceptionMessageData(null, [], false, {
    code: 'LOFTLR',
    alternateLevels: [],
    level: 'error',
    message: 'Unable to load resource: ' + smart(path) + '. Cause: ' + smart(cause, false),
    metadata: { path, cause }
  })
}

export function loaderNotAvailable (path: string): ExceptionMessageDataInput {
  return getExceptionMessageData(null, [], false, {
    code: 'LONOAV',
    alternateLevels: [],
    level: 'error',
    message: 'No defined loaders were able to load the path: ' + smart(path),
    metadata: { path }
  })
}

export function mediaTypeSchemaMustBeObject (data: ValidatorData, location: LocationInput, type: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'MTSMBO',
    alternateLevels: [],
    level: 'error',
    message: 'MediaType schema must be of type "object". Received type: ' + smart(type),
    metadata: { type }
  })
}

export function missingRequiredProperties (data: ValidatorData, location: LocationInput, properties: string[]): ExceptionMessageDataInput {
  const result = getExceptionMessageData(data, [location], true, {
    code: 'MIREPR',
    alternateLevels: [],
    level: 'error',
    message: properties.length === 1
      ? 'Missing required property: ' + smart(properties[0])
      : 'Missing required properties: ' + smart(properties),
    metadata: { properties }
  })
  return result
}

export function mustNotBeNull (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'MUNOBN',
    alternateLevels: [],
    level: 'error',
    message: 'Value must not be null.'
  })
}

export function noPathsDefined (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'NOPADE',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'No paths defined.'
  })
}

export function notRecommended (data: ValidatorData, location: LocationInput, message: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'NOTREC',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'opinion',
    message
  })
}

export function operationMethodShouldNotHaveBody (data: ValidatorData, location: LocationInput, method: string): ExceptionMessageDataInput {
  const upperMethod = smart(method.toUpperCase())
  return getExceptionMessageData(data, [location], 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/' + method.toUpperCase(), {
    code: 'OMRBNA',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Including a request body with a ' + upperMethod + ' request is not advised. Some implementations may reject ' + upperMethod + ' requests that contain a request body.',
    metadata: { method }
  })
}

export function operationIdMustBeUnique (data: ValidatorData, locations: LocationInput[], operationId: string, conflictsData: Array<ValidatorData<OperationDefinition>>): ExceptionMessageDataInput {
  const conflicts = conflictsData.map(conflict => {
    const { key: method, chain } = conflict.context
    const { key: path } = chain[0]?.context ?? { path: '' }
    return method.toUpperCase() + ' ' + path // operation method and path
  })
  return getExceptionMessageData(data, locations, conflictsData[0].component.reference, {
    code: 'OPIMBU',
    alternateLevels: [],
    level: 'error',
    message: 'The operationId ' + smart(operationId) + ' must be unique for each operation.',
    metadata: { operationId, conflicts, operations: conflictsData }
  })
}

export function parameterBodyFormDataConflict (data: ValidatorData, locations: LocationInput[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, locations, true, {
    code: 'PABFDC',
    alternateLevels: [],
    level: 'error',
    message: 'You cannot specify both body and formData parameters together. They are mutually exclusive.'
  })
}

export function parameterContentMediaTypeCount (data: ValidatorData, locations: LocationInput[], mediaTypes: string[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, locations, true, {
    code: 'PACOMT',
    alternateLevels: [],
    level: 'error',
    message: 'The "content" property must define exactly one media type. ' +
      (mediaTypes.length === 0 ? ' No types were defined.' : 'Defined types: ' + smart(mediaTypes))
  })
}

export function parameterNamespaceConflict (data: ValidatorData, locations: LocationInput[], name: string, at: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, locations, true, {
    code: 'PANACO',
    alternateLevels: [],
    level: 'error',
    message: 'Parameter names must be unique per space. Conflicts found with the name ' + smart(name) + ' and space ' + smart(at) + '.',
    metadata: { name, at }
  })
}

export function parameterSchemaContentRequired (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'PASCCO',
    alternateLevels: [],
    level: 'error',
    message: 'One of either the "schema" or "content" properties must be included.'
  })
}

export function pathEndingsInconsistent (data: ValidatorData, locations: LocationInput[], pathsWithTrailingSlash: string[], pathsWithoutTrailingSlash: string[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, locations, false, {
    code: 'PAENIN',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Path endings are inconsistent. Some paths end with a slash and some do not. This may cause confusion for users of your API.',
    metadata: { pathsWithTrailingSlash, pathsWithoutTrailingSlash }
  })
}

export function pathMissingMethods (data: ValidatorData, location: LocationInput, path: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'PAMIME',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'No methods defined for path: ' + smart(path),
    metadata: { path }
  })
}

export function pathParameterMustBeRequired (data: ValidatorData, location: LocationInput, parameterName: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'PAPMBR',
    alternateLevels: [],
    level: 'error',
    message: 'Path parameters must be marked as required. Parameter: ' + smart(parameterName),
    metadata: { parameterName }
  })
}

export function propertiesMutuallyExclusive (data: ValidatorData, locations: LocationInput[], properties: string[]): ExceptionMessageDataInput {
  return getExceptionMessageData(data, locations, true, {
    code: 'PRMUEX',
    alternateLevels: [],
    level: 'error',
    message: 'The following properties are mutually exclusive: ' + smart(properties),
    metadata: { properties }
  })
}

export function propertyIgnored (data: ValidatorData, location: LocationInput, value: string, reason: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'PROIGN',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Property ignored: ' + smart(value) + '. ' + reason,
    metadata: { value, reason }
  })
}

export function propertyNotAllowed (data: ValidatorData, location: LocationInput, propertyName: string, reason: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'PRNOAL',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'error',
    message: 'Property ' + smart(propertyName) + ' not allowed. ' + reason,
    metadata: { propertyName, reason }
  })
}

export function refNotResolved (data: ValidatorData, location: LocationInput, ref: string, from: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'RENORE',
    alternateLevels: [],
    level: 'error',
    message: 'Cannot resolve reference ' + smart(ref) + ' from ' + smart(from) + '.',
    metadata: { ref, from }
  })
}

export function requestBodyContentEmpty (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'REBOCE',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'error',
    message: 'The request body content map must contain one or more media type definitions.'
  })
}

export function responseBodyNotAllowed (data: ValidatorData, location: LocationInput, type: 'schema' | 'content'): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'REBONA',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'A 204 response must not contain a body but this response has a defined ' + type + '.',
    metadata: { type }
  })
}

export function responseRequired (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'RESREQ',
    alternateLevels: [],
    level: 'error',
    message: 'Responses object must define at least one response.'
  })
}

export function responseShouldIncludeLocationHeader (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], 'https://tools.ietf.org/html/rfc7231#section-4.3.3', {
    code: 'RESILC',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'A 201 response for a POST request should return a location header and this is not documented in your OpenAPI document.'
  })
}

export function responsesShouldIncludeSuccess (data: ValidatorData, location: LocationInput): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'RESHIS',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Responses object should define at least one success (200 level) response or a default response.'
  })
}

export function securityRequirementNotEmptyArray (data: ValidatorData, location: LocationInput, major: number): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'SERNEA',
    alternateLevels: [],
    level: 'error',
    message: 'Security requirement value must be an empty array unless associated security scheme type is ' +
      (major === 2 ? 'oauth2' : 'either oauth2 or openIdConnect')
  })
}

export function securitySchemeMissingReference (data: ValidatorData, location: LocationInput, major: number): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'SESCMR',
    alternateLevels: [],
    level: 'error',
    message: 'Security scheme name must have an associated reference at ' +
      (major === 2 ? 'Swagger > SecurityDefinitions' : 'OpenAPI > Components > SecuritySchemes')
  })
}

export function swaggerBasePathInvalid (data: ValidatorData, location: LocationInput, basePath: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'SWBAPI',
    alternateLevels: [],
    level: 'error',
    message: 'The base path must start with a forward slash.',
    metadata: { basePath }
  })
}

export function swaggerBasePathTemplating (data: ValidatorData, location: LocationInput, basePath: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'SHDNSP',
    alternateLevels: [],
    level: 'error',
    message: 'The base path does not support path templating.',
    metadata: { basePath }
  })
}

export function swaggerHostDoesNotSupportPathTemplating (data: ValidatorData, location: LocationInput, host: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'SHDNSP',
    alternateLevels: [],
    level: 'error',
    message: 'The host does not support path templating.',
    metadata: { host }
  })
}

export function swaggerHostHasScheme (data: ValidatorData, location: LocationInput, host: string, scheme: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'SWHOHS',
    alternateLevels: [],
    level: 'error',
    message: 'The host must not include the scheme: ' + smart(scheme),
    metadata: { host, scheme }
  })
}

export function swaggerHostHasSubPath (data: ValidatorData, location: LocationInput, host: string, subPath: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'SWHHAS',
    alternateLevels: [],
    level: 'error',
    message: 'The host must not include sub path: ' + smart(subPath),
    metadata: { host, subPath }
  })
}

export function unknownTypeFormat (data: ValidatorData, location: LocationInput, type: string, format: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], false, {
    code: 'UNTYFO',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Unregistered format ' + smart(format) + ' used for type ' + smart(type) + '.',
    metadata: { type, format }
  })
}

export function valueIgnored (data: ValidatorData, location: LocationInput, value: string, reason: string): ExceptionMessageDataInput {
  return getExceptionMessageData(data, [location], true, {
    code: 'VALIGN',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'The following value will be ignored: ' + smart(value) + '. ' + reason,
    metadata: { value, reason }
  })
}

function getExceptionMessageData (data: ValidatorData | null, locations: LocationInput[], reference: boolean | string, message: MessageData): ExceptionMessageDataInput {
  // for all defined locations, set the node to the component definition if no node is provided
  if (data !== null) {
    locations.forEach(l => {
      if (l.node === undefined) l.node = data.component.definition
    })
  }

  return Object.assign(message, {
    code: 'OAE-D' + message.code,
    definition: data === null ? '' : data.component.definition,
    locations,
    metadata: message.metadata ?? {},
    reference: reference === true
      ? data === null ? '' : data.component.reference
      : reference === false ? '' : reference
  })
}

function smart (value: any, addQuotationMarksToStrings = true): string {
  if (typeof value === 'string') {
    return addQuotationMarksToStrings
      ? '"' + value.replace(/"/g, '\\"') + '"'
      : value
  } else if (value instanceof Date) {
    return isNaN(+value) ? 'invalid date object' : value.toISOString()
  } else if (Array.isArray(value)) {
    return value.map(v => smart(v, addQuotationMarksToStrings)).join(', ')
  } else {
    return String(value)
  }
}
