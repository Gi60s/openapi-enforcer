import { Exception } from './Exception'
import { ExceptionBase, Message, smart } from './ExceptionBase'
import { ValidatorData } from '../components/helpers/builder-validator-types'
import {
  Operation2 as OperationDefinition2,
  Operation3 as OperationDefinition3
} from '../components/helpers/definition-types'
import { lookupLocation } from '../utils/loader'

export interface LocationInput {
  node?: any // if node is not provided then the component definition is used for the node
  key?: string | number
  type?: 'value' | 'key' | 'both'
}

type OperationDefinition = OperationDefinition2 | OperationDefinition3

interface Adders {
  $refIgnoresSiblings: (data: ValidatorData, location: LocationInput, siblingProperties: string[]) => Message
  $refNotAllowed: (data: ValidatorData, location: LocationInput) => Message
  additionalPropertiesInValue: (data: ValidatorData, locations: LocationInput[], additionalProperties: string[]) => Message
  allOfConflictingSchemaTypes: (data: ValidatorData, location: LocationInput, types: string[]) => Message
  allOfConflictingSchemaFormats: (data: ValidatorData, location: LocationInput, formats: string[]) => Message
  constraintIsNotAMultiple: (data: ValidatorData, location: LocationInput, constraint: 'minimum' | 'maximum', value: string | number, multipleOf: string | number) => Message
  defaultRequiredConflict: (data: ValidatorData, locations: LocationInput[]) => Message
  defaultValueDoesNotMatchSchema: (data: ValidatorData, location: LocationInput, defaultValue: any, exception: Exception) => Message
  encodingMissingAssociatedSchema: (data: ValidatorData, location: LocationInput) => Message
  encodingNameNotMatched: (data: ValidatorData, location: LocationInput, encodingName: string) => Message
  encodingHeaderContentType: (data: ValidatorData, location: LocationInput) => Message
  encodingHeadersIgnored: (data: ValidatorData, location: LocationInput) => Message
  enumMissingValues: (data: ValidatorData, location: LocationInput) => Message
  enumNotMet: (data: ValidatorData, location: LocationInput, acceptableValues: any[], invalidValue: any) => Message
  enumValueDoesNotMatchSchema: (data: ValidatorData, location: LocationInput, value: any, exception: Exception) => Message
  exampleMediaTypeNotProduced: (data: ValidatorData, location: LocationInput, mediaType: string, produces: string[]) => Message
  exampleNotSerializable: (data: ValidatorData, location: LocationInput, example: any, schema: any, exception: Exception) => Message
  exampleNotValid: (data: ValidatorData, location: LocationInput, example: any, schema: any, exception: Exception) => Message
  exampleWithoutSchema: (data: ValidatorData, location: LocationInput) => Message
  exceedsArrayLengthBounds: (data: ValidatorData, location: LocationInput, boundBy: 'maxItems' | 'minItems', boundValue: number, actualCount: number) => Message
  exceedsNumberBounds: (data: ValidatorData, location: LocationInput, boundBy: 'maximum' | 'minimum', allowEqual: boolean, boundValue: any, invalidValue: number) => Message
  exceedsStringLengthBounds: (data: ValidatorData, location: LocationInput, boundBy: 'maxLength' | 'minLength', boundValue: number, invalidValue: string) => Message
  exceedsSummaryLength: (data: ValidatorData, location: LocationInput, summary: string) => Message
  extensionNotAllowed: (data: ValidatorData, location: LocationInput) => Message
  invalidAdditionalPropertiesSchema: (data: ValidatorData, location: LocationInput, invalidSchema: any) => Message
  invalidCookieExplode: (data: ValidatorData, location: LocationInput, parameterName: string) => Message
  invalidEmail: (data: ValidatorData, location: LocationInput, invalidValue: any) => Message
  invalidMaxMin: (data: ValidatorData, locations: LocationInput[], minimum: any, maximum: any, minProperty: string, maxProperty: string, exclusive: boolean) => Message
  invalidMediaType: (data: ValidatorData, location: LocationInput, mediaType: string) => Message
  invalidOpenApiVersionNumber: (data: ValidatorData, location: LocationInput, version: string) => Message
  invalidResponseCode: (data: ValidatorData, location: LocationInput, code: string) => Message
  invalidResponseLinkKey: (data: ValidatorData, location: LocationInput, key: string) => Message
  invalidSemanticVersionNumber: (data: ValidatorData, location: LocationInput, version: string) => Message
  invalidStyle: (data: ValidatorData, location: LocationInput, style: string, type: string, at: string, explode: boolean, mode: 'type' | 'location') => Message
  invalidType: (data: ValidatorData, location: LocationInput, expectedType: string, invalidValue: any, reference?: string) => Message
  invalidUrl: (data: ValidatorData, location: LocationInput, invalidValue: any) => Message
  invalidVersionForComponent: (data: ValidatorData, location: LocationInput, componentName: string, version: string) => Message
  linkOperationConflict: (data: ValidatorData, locations: LocationInput[]) => Message
  linkOperationMissing: (data: ValidatorData, location: LocationInput) => Message
  linkedOperationNotFound: (data: ValidatorData, location: LocationInput, key: 'operationId' | 'operationRef', value: string) => Message
  loaderFailedToLoadResource: (path: string, cause: string) => Message
  loaderNotAvailable: (path: string) => Message
  mediaTypeSchemaMustBeObject: (data: ValidatorData, location: LocationInput, type: string) => Message
  missingRequiredProperties: (data: ValidatorData, location: LocationInput, properties: string[]) => Message
  mustNotBeNull: (data: ValidatorData, location: LocationInput) => Message
  noPathsDefined: (data: ValidatorData, location: LocationInput) => Message
  notRecommended: (data: ValidatorData, location: LocationInput, message: string) => Message
  operationMethodShouldNotHaveBody: (data: ValidatorData, location: LocationInput, method: string) => Message
  operationIdMustBeUnique: (data: ValidatorData, locations: LocationInput[], operationId: string, conflictsData: Array<ValidatorData<OperationDefinition>>) => Message
  parameterBodyFormDataConflict: (data: ValidatorData, locations: LocationInput[]) => Message
  parameterCollectionMultiFormat: (data: ValidatorData, location: LocationInput) => Message
  parameterContentMediaTypeCount: (data: ValidatorData, locations: LocationInput[], mediaTypes: string[]) => Message
  parameterFileTypeConstraintsNotMet: (data: ValidatorData, location: LocationInput) => Message,
  parameterNamespaceConflict: (data: ValidatorData, locations: LocationInput[], name: string, at: string) => Message
  parameterSchemaContentRequired: (data: ValidatorData, location: LocationInput) => Message
  pathEndingsInconsistent: (data: ValidatorData, locations: LocationInput[], pathsWithTrailingSlash: string[], pathsWithoutTrailingSlash: string[]) => Message
  pathMissingMethods: (data: ValidatorData, location: LocationInput, path: string) => Message
  pathParameterMustBeRequired: (data: ValidatorData, location: LocationInput, parameterName: string) => Message
  pathParameterMismatch: (data: ValidatorData, locations: LocationInput[], parameterName: string, path: string, missingIn: 'path' | 'parameters') => Message
  propertiesMutuallyExclusive: (data: ValidatorData, locations: LocationInput[], properties: string[]) => Message
  propertyIgnored: (data: ValidatorData, location: LocationInput, value: string, reason: string) => Message
  propertyNotAllowed: (data: ValidatorData, location: LocationInput, propertyName: string, reason: string) => Message
  refNotResolved: (data: ValidatorData, location: LocationInput, ref: string, from: string) => Message
  requestBodyContentEmpty: (data: ValidatorData, location: LocationInput) => Message
  responseBodyNotAllowed: (data: ValidatorData, location: LocationInput, type: 'schema' | 'content') => Message
  responseRequired: (data: ValidatorData, location: LocationInput) => Message
  responseShouldIncludeLocationHeader: (data: ValidatorData, location: LocationInput) => Message
  responsesShouldIncludeSuccess: (data: ValidatorData, location: LocationInput) => Message
  securityRequirementNotEmptyArray: (data: ValidatorData, location: LocationInput, major: number) => Message
  securitySchemeMissingReference: (data: ValidatorData, location: LocationInput, major: number) => Message
  swaggerBasePathInvalid: (data: ValidatorData, location: LocationInput, basePath: string) => Message
  swaggerBasePathTemplating: (data: ValidatorData, location: LocationInput, basePath: string) => Message
  swaggerHostDoesNotSupportPathTemplating: (data: ValidatorData, location: LocationInput, host: string) => Message
  swaggerHostHasScheme: (data: ValidatorData, location: LocationInput, host: string, scheme: string) => Message
  swaggerHostHasSubPath: (data: ValidatorData, location: LocationInput, host: string, subPath: string) => Message
  unknownTypeFormat: (data: ValidatorData, location: LocationInput, type: string, format: string) => Message
  valueIgnored: (data: ValidatorData, location: LocationInput, value: string, reason: string) => Message
}

export class DefinitionException extends ExceptionBase<DefinitionException> {
  at (key: string | number): DefinitionException {
    return super.at(key) as DefinitionException
  }

  add: Adders = {
    $refIgnoresSiblings: (data: ValidatorData, location: LocationInput, siblingProperties: string[]) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'REIGSI',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Objects with a $ref property will cause all other sibling properties to be ignored. Ignored properties: ' + smart(siblingProperties)
      }))
    },

    $refNotAllowed: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'RENOAL',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Reference not allowed here.'
      }))
    },

    additionalPropertiesInValue: (data: ValidatorData, locations: LocationInput[], additionalProperties: string[]) => {
      return this.message(getExceptionMessageData(data, locations, false, {
        code: 'ADPRIV',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'ignore',
        message: additionalProperties.length === 1
          ? 'Additional property found in value: ' + smart(additionalProperties)
          : 'Additional properties found in value: ' + smart(additionalProperties),
        metadata: { additionalProperties }
      }))
    },

    allOfConflictingSchemaTypes: (data: ValidatorData, location: LocationInput, types: string[]) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'ALOCST',
        alternateLevels: [],
        level: 'error',
        message: 'Subschemas within "allOf" should be able to resolve to the same type. Types found: ' + smart(types),
        metadata: { types }
      }))
    },

    allOfConflictingSchemaFormats: (data: ValidatorData, location: LocationInput, formats: string[]) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'ALOCSF',
        alternateLevels: [],
        level: 'error',
        message: 'Subschemas within "allOf" should be able to resolve to the same type formats. Formats found: ' + smart(formats),
        metadata: { formats }
      }))
    },

    constraintIsNotAMultiple: (data: ValidatorData, location: LocationInput, constraint: 'minimum' | 'maximum', value: string | number, multipleOf: string | number) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'COINMU',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: constraint[0].toUpperCase() + constraint.substring(1) + ' value ' + smart(value) + ' is not a multiple of ' + smart(multipleOf)
      }))
    },

    defaultRequiredConflict: (data: ValidatorData, locations: LocationInput[]) => {
      return this.message(getExceptionMessageData(data, locations, false, {
        code: 'DERECO',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Setting a "default" value and setting "required" to true means the "default" value will never be used.'
      }))
    },

    defaultValueDoesNotMatchSchema: (data: ValidatorData, location: LocationInput, defaultValue: any, exception: Exception) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'DVDNMS',
        alternateLevels: [], // ['ignore', 'info', 'warn', 'error'],
        level: 'error',
        message: 'Default value ' + smart(defaultValue) + ' does not match its associated schema.',
        metadata: { exception, defaultValue },
        exception
      }))
    },

    encodingMissingAssociatedSchema: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'ENMIAS',
        alternateLevels: [],
        level: 'error',
        message: 'Encoding can only be used when the Media Type definition also contains a schema.'
      }))
    },

    encodingNameNotMatched: (data: ValidatorData, location: LocationInput, encodingName: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'ENNANM',
        alternateLevels: [],
        level: 'error',
        message: 'Encoding name ' + smart(encodingName) + ' must match a property name in the media type\'s schema',
        metadata: { encodingName }
      }))
    },

    encodingHeaderContentType: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'ENHECT',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Encoding headers should not include Content-Type. That is already part of the Encoding definition under the "contentType" property.'
      }))
    },

    encodingHeadersIgnored: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'ENHEIG',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Encoding headers ignored unless part of a request body with content multipart/*.'
      }))
    },

    enumMissingValues: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'ENMIVA',
        alternateLevels: [],
        level: 'error',
        message: 'Enum should not be an empty array.'
      }))
    },

    enumNotMet: (data: ValidatorData, location: LocationInput, acceptableValues: any[], invalidValue: any) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'ENNOME',
        alternateLevels: [],
        level: 'error',
        message: acceptableValues.length > 1
          ? 'Value must be one of: ' + smart(acceptableValues) + '. Received: ' + smart(invalidValue, { wrapArray: true })
          : 'Value must equal: ' + smart(acceptableValues[0]) + '. Received: ' + smart(invalidValue, { wrapArray: true }),
        metadata: { acceptableValues, invalidValue }
      }))
    },

    enumValueDoesNotMatchSchema: (data: ValidatorData, location: LocationInput, value: any, exception: Exception) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'ENVDMS',
        alternateLevels: [], // ['ignore', 'info', 'warn', 'error'],
        level: 'error',
        message: 'Enum value ' + smart(value) + ' does not match its associated schema.',
        metadata: { exception, value },
        exception
      }))
    },

    exampleMediaTypeNotProduced: (data: ValidatorData, location: LocationInput, mediaType: string, produces: string[]) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'EXMTNP',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Example uses media type ' + smart(mediaType) + ' that is not listed in the possible list of produces: ' + smart(produces),
        metadata: { mediaType, produces }
      }))
    },

    exampleNotSerializable: (data: ValidatorData, location: LocationInput, example: any, schema: any, exception: Exception) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'EXNOSE',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'error',
        message: 'Example could not be serialized and therefore cannot be validated against the schema.',
        metadata: { example, exception, schema },
        exception
      }))
    },

    exampleNotValid: (data: ValidatorData, location: LocationInput, example: any, schema: any, exception: Exception) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'EXNOVA',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Example is not valid when compared against the schema.',
        metadata: { example, exception, schema },
        exception
      }))
    },

    exampleWithoutSchema: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'EXWISC',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'info',
        message: 'An example is great, but you should add a schema. A schema can provide more detailed information than an example.'
      }))
    },

    exceedsArrayLengthBounds: (data: ValidatorData, location: LocationInput, boundBy: 'maxItems' | 'minItems', boundValue: number, actualCount: number) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'EXARLB',
        alternateLevels: [],
        level: 'error',
        message: 'Array must have ' +
          (boundBy === 'maxItems' ? 'at most ' : 'at least ') +
          String(boundValue) +
          (boundValue === 1 ? ' item' : ' items') +
          '. Array contains ' + String(actualCount) +
          (actualCount === 1 ? ' item.' : ' items.'),
        metadata: { boundBy, boundValue, actualCount }
      }))
    },

    exceedsNumberBounds: (data: ValidatorData, location: LocationInput, boundBy: 'maximum' | 'minimum', allowEqual: boolean, boundValue: any, invalidValue: number) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'EXNUBO',
        alternateLevels: [],
        level: 'error',
        message: 'Value must be ' +
          (boundBy === 'maximum' ? 'less than ' : 'greater than ') +
          (allowEqual ? 'or equal to ' : '') +
          smart(boundValue, { addQuotationMarksToStrings: false }) + '. Received: ' + smart(invalidValue, { addQuotationMarksToStrings: false, wrapArray: true }),
        metadata: { allowEqual, boundBy, boundValue, invalidValue }
      }))
    },

    exceedsStringLengthBounds: (data: ValidatorData, location: LocationInput, boundBy: 'maxLength' | 'minLength', boundValue: number, invalidValue: string) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'EXSTLB',
        alternateLevels: [],
        level: 'error',
        message: 'Value must have length ' +
          (boundBy === 'maxLength' ? 'less than' : 'greater than') +
          ' or equal to' + String(boundValue) +
          '. Received: ' + String(invalidValue) + ' (length of ' + String(invalidValue.length) + ')',
        metadata: { boundBy, boundValue, invalidValue }
      }))
    },

    exceedsSummaryLength: (data: ValidatorData, location: LocationInput, summary: string) => {
      const length = summary.length
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'EXSULE',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Summary should be less than 120 characters in length. Current length: ' + smart(length),
        metadata: { length, summary }
      }))
    },

    extensionNotAllowed: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'EXNOAL',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Schema extensions not allowed here.'
      }))
    },

    invalidAdditionalPropertiesSchema: (data: ValidatorData, location: LocationInput, invalidSchema: any) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INADPS',
        alternateLevels: [],
        level: 'error',
        message: 'Additional properties must be either a boolean or a valid schema definition.',
        metadata: { invalidSchema }
      }))
    },

    invalidCookieExplode: (data: ValidatorData, location: LocationInput, parameterName: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INCOEX',
        alternateLevels: [],
        level: 'error',
        message: 'Cookies do not support exploded values for schemas of type array or object.',
        metadata: { parameterName }
      }))
    },

    invalidEmail: (data: ValidatorData, location: LocationInput, invalidValue: any) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INVEMA',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Value does not appear to be a valid email address: ' + smart(invalidValue),
        metadata: { invalidValue }
      }))
    },

    invalidMaxMin: (data: ValidatorData, locations: LocationInput[], minimum: any, maximum: any, minProperty: string, maxProperty: string, exclusive = false) => {
      return this.message(getExceptionMessageData(data, locations, false, {
        code: 'INMAMI',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'error',
        message: 'Property ' + smart(minProperty) + ' (' + smart(minimum, { addQuotationMarksToStrings: false }) + ') must be less than ' +
          (exclusive ? 'or equal to ' : '') +
          smart(maxProperty) + ' (' + smart(maximum, { addQuotationMarksToStrings: false }) + ').',
        metadata: { minimum, maximum, minProperty, maxProperty }
      }))
    },

    invalidMediaType: (data: ValidatorData, location: LocationInput, mediaType: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INMETY',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Media type appears invalid: ' + smart(mediaType),
        metadata: { mediaType }
      }))
    },

    invalidOpenApiVersionNumber: (data: ValidatorData, location: LocationInput, version: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INOPVN',
        alternateLevels: [],
        level: 'error',
        message: 'OpenAPI specification version not supported: ' + smart(version),
        metadata: { version }
      }))
    },

    invalidResponseCode: (data: ValidatorData, location: LocationInput, code: string) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'INRECO',
        alternateLevels: [],
        level: 'error',
        message: 'Invalid response code: ' + smart(code),
        metadata: { code }
      }))
    },

    invalidResponseLinkKey: (data: ValidatorData, location: LocationInput, key: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INRELK',
        alternateLevels: [],
        level: 'error',
        message: 'Invalid key used for link value: ' + smart(key),
        metadata: { key }
      }))
    },

    invalidSemanticVersionNumber: (data: ValidatorData, location: LocationInput, version: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INSEVN',
        alternateLevels: [],
        level: 'error',
        message: 'Value must be a semantic version number.',
        metadata: { version }
      }))
    },

    invalidStyle: (data: ValidatorData, location: LocationInput, style: string, type: string, at: string, explode: boolean, mode: 'type' | 'location') => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INPAST',
        alternateLevels: [],
        level: 'error',
        message: 'Style ' + smart(style) + ' is incompatible with ' +
          (mode === 'type' ? 'schema type ' + smart(type) + ' when explode is set to ' + String(explode) + '.' : smart(at) + ' parameter.'),
        metadata: {
          in: at,
          mode,
          style,
          type
        }
      }))
    },

    invalidType: (data: ValidatorData, location: LocationInput, expectedType: string, invalidValue: any, reference?: string) => {
      const metadata: Record<string, any> = {
        expectedType,
        invalidValue
      }
      if (typeof reference === 'string' && reference.length > 0) metadata.reference = reference
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INVTYP',
        alternateLevels: [],
        level: 'error',
        message: 'Invalid type. Expected ' + smart(expectedType, { addQuotationMarksToStrings: false }) + '. Received: ' + smart(invalidValue, { wrapArray: true }),
        metadata
      }))
    },

    invalidUrl: (data: ValidatorData, location: LocationInput, invalidValue: any) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INVURL',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'error',
        message: 'Value does not appear to be a valid URL: ' + smart(invalidValue),
        metadata: { invalidValue }
      }))
    },

    invalidVersionForComponent: (data: ValidatorData, location: LocationInput, componentName: string, version: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'INVEFC',
        alternateLevels: [],
        level: 'error',
        message: smart(componentName) + ' object is not supported by the OpenAPI specification version ' + smart(version),
        metadata: { componentName, version }
      }))
    },

    linkOperationConflict: (data: ValidatorData, locations: LocationInput[]) => {
      return this.message(getExceptionMessageData(data, locations, true, {
        code: 'LIOPCO',
        alternateLevels: [],
        level: 'error',
        message: 'The operationId and operationRef are mutually exclusive.'
      }))
    },

    linkOperationMissing: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'LIOPMI',
        alternateLevels: [],
        level: 'error',
        message: 'A link object must include either the "operationId" or the "operationRef" property.'
      }))
    },

    linkedOperationNotFound: (data: ValidatorData, location: LocationInput, key: 'operationId' | 'operationRef', value: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'LIOINF',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'error',
        message: 'The operation object associated with the ' + key + ' ' + smart(value) + ' could not be found.',
        metadata: { key, value }
      }))
    },

    loaderFailedToLoadResource: (path: string, cause: string) => {
      if (cause === '') cause = 'unknown'
      return this.message(getExceptionMessageData(null, [], false, {
        code: 'LOFTLR',
        alternateLevels: [],
        level: 'error',
        message: 'Unable to load resource: ' + smart(path) + '. Cause: ' + smart(cause, { addQuotationMarksToStrings: false }),
        metadata: { path, cause }
      }))
    },

    loaderNotAvailable: (path: string) => {
      return this.message(getExceptionMessageData(null, [], false, {
        code: 'LONOAV',
        alternateLevels: [],
        level: 'error',
        message: 'No defined loaders were able to load the path: ' + smart(path),
        metadata: { path }
      }))
    },

    mediaTypeSchemaMustBeObject: (data: ValidatorData, location: LocationInput, type: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'MTSMBO',
        alternateLevels: [],
        level: 'error',
        message: 'MediaType schema must be of type "object" when using the "encoding" property. Received type: ' + smart(type),
        metadata: { type }
      }))
    },

    missingRequiredProperties: (data: ValidatorData, location: LocationInput, properties: string[]) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'MIREPR',
        alternateLevels: [],
        level: 'error',
        message: properties.length === 1
          ? 'Missing required property: ' + smart(properties[0])
          : 'Missing required properties: ' + smart(properties),
        metadata: { missingProperties: properties }
      }))
    },

    mustNotBeNull: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'MUNOBN',
        alternateLevels: [],
        level: 'error',
        message: 'Value must not be null.'
      }))
    },

    noPathsDefined: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'NOPADE',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'No paths defined.'
      }))
    },

    notRecommended: (data: ValidatorData, location: LocationInput, message: string) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'NOTREC',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'info',
        message
      }))
    },

    operationMethodShouldNotHaveBody: (data: ValidatorData, location: LocationInput, method: string) => {
      const upperMethod = smart(method.toUpperCase())
      return this.message(getExceptionMessageData(data, [location], 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/' + method.toUpperCase(), {
        code: 'OMRBNA',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Including a request body with a ' + upperMethod + ' request is not advised. Some implementations may reject ' + upperMethod + ' requests that contain a request body.',
        metadata: { method }
      }))
    },

    operationIdMustBeUnique: (data: ValidatorData, locations: LocationInput[], operationId: string, conflictsData: Array<ValidatorData<OperationDefinition>>) => {
      const conflicts = conflictsData.map(conflict => {
        const { key: method, chain } = conflict.context
        const { key: path } = chain[0]?.context ?? { path: '' }
        return method.toUpperCase() + ' ' + path // operation method and path
      })
      return this.message(getExceptionMessageData(data, locations, conflictsData[0].component.reference, {
        code: 'OPIMBU',
        alternateLevels: [],
        level: 'error',
        message: 'The operationId ' + smart(operationId) + ' is not unique and must be unique.',
        metadata: { operationId, conflicts, operations: conflictsData }
      }))
    },

    parameterBodyFormDataConflict: (data: ValidatorData, locations: LocationInput[]) => {
      return this.message(getExceptionMessageData(data, locations, true, {
        code: 'PABFDC',
        alternateLevels: [],
        level: 'error',
        message: 'You cannot specify both body and formData parameters together. They are mutually exclusive.'
      }))
    },

    parameterCollectionMultiFormat: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'PACOMF',
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        level: 'error',
        message: 'The collection format property can only be set to "multi" when the parameter is in "query" or "formData"'
      }))
    },

    parameterContentMediaTypeCount: (data: ValidatorData, locations: LocationInput[], mediaTypes: string[]) => {
      return this.message(getExceptionMessageData(data, locations, true, {
        code: 'PACOMT',
        alternateLevels: [],
        level: 'error',
        message: 'The "content" property must define exactly one media type. ' +
          (mediaTypes.length === 0 ? ' No types were defined.' : 'Defined types: ' + smart(mediaTypes))
      }))
    },

    parameterFileTypeConstraintsNotMet: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'PAFTCN',
        alternateLevels: [],
        level: 'error',
        message: 'Parameter of type "file" can only be used when in "formData" and operation consumes is set to "multipart/form-data" and/or "application/x-www-form-urlencoded".'
      }))
    },

    parameterNamespaceConflict: (data: ValidatorData, locations: LocationInput[], name: string, at: string) => {
      return this.message(getExceptionMessageData(data, locations, true, {
        code: 'PANACO',
        alternateLevels: [],
        level: 'error',
        message: 'Parameter names must be unique per space. Conflicts found with the name ' + smart(name) + ' and space ' + smart(at) + '.',
        metadata: { name, at }
      }))
    },

    parameterSchemaContentRequired: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'PASCCO',
        alternateLevels: [],
        level: 'error',
        message: 'One of either the "schema" or "content" properties must be included.'
      }))
    },

    pathEndingsInconsistent: (data: ValidatorData, locations: LocationInput[], pathsWithTrailingSlash: string[], pathsWithoutTrailingSlash: string[]) => {
      return this.message(getExceptionMessageData(data, locations, false, {
        code: 'PAENIN',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Path endings are inconsistent. Some paths end with a slash and some do not. This may cause confusion for users of your API.',
        metadata: { pathsWithTrailingSlash, pathsWithoutTrailingSlash }
      }))
    },

    pathMissingMethods: (data: ValidatorData, location: LocationInput, path: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'PAMIME',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'No methods defined for path: ' + smart(path),
        metadata: { path }
      }))
    },

    pathParameterMustBeRequired: (data: ValidatorData, location: LocationInput, parameterName: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'PAPMBR',
        alternateLevels: [],
        level: 'error',
        message: 'Path parameters must be marked as required. Parameter: ' + smart(parameterName),
        metadata: { parameterName }
      }))
    },

    pathParameterMismatch: (data: ValidatorData, locations: LocationInput[], parameterName: string, path: string, missingIn: 'path' | 'parameters') => {
      return this.message(getExceptionMessageData(data, locations, true, {
        code: 'PAPMMM',
        alternateLevels: [],
        level: 'error',
        message: missingIn === 'path'
          ? 'Path is missing path parameter ' + smart(parameterName) + ' that is defined in the parameters array.'
          : 'Path contains a parameter ' + smart(parameterName) + ' that is not defined in the parameters array.',
        metadata: { parameterName, path, missingIn }
      }))
    },

    propertiesMutuallyExclusive: (data: ValidatorData, locations: LocationInput[], properties: string[]) => {
      return this.message(getExceptionMessageData(data, locations, true, {
        code: 'PRMUEX',
        alternateLevels: [],
        level: 'error',
        message: 'The following properties are mutually exclusive: ' + smart(properties),
        metadata: { properties }
      }))
    },

    propertyIgnored: (data: ValidatorData, location: LocationInput, value: string, reason: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'PROIGN',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Property ' + smart(value) + ' ignored. ' + reason,
        metadata: { value, reason }
      }))
    },

    propertyNotAllowed: (data: ValidatorData, location: LocationInput, propertyName: string, reason: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'PRNOAL',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'error',
        message: 'Property ' + smart(propertyName) + ' not allowed. ' + reason,
        metadata: { propertyName, reason }
      }))
    },

    refNotResolved: (data: ValidatorData, location: LocationInput, ref: string, from: string) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'RENORE',
        alternateLevels: [],
        level: 'error',
        message: 'Cannot resolve reference ' + smart(ref) + ' from ' + smart(from) + '.',
        metadata: { ref, from }
      }))
    },

    requestBodyContentEmpty: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'REBOCE',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'error',
        message: 'The request body content map must contain one or more media type definitions.'
      }))
    },

    responseBodyNotAllowed: (data: ValidatorData, location: LocationInput, type: 'schema' | 'content') => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'REBONA',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'A 204 response must not contain a body but this response has a defined ' + type + '.',
        metadata: { type }
      }))
    },

    responseRequired: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'RESREQ',
        alternateLevels: [],
        level: 'error',
        message: 'Responses object must define at least one response.'
      }))
    },

    responseShouldIncludeLocationHeader: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], 'https://tools.ietf.org/html/rfc7231#section-4.3.3', {
        code: 'RESILC',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'A 201 response for a POST request should return a location header and this is not documented in your OpenAPI document.'
      }))
    },

    responsesShouldIncludeSuccess: (data: ValidatorData, location: LocationInput) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'RESHIS',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Responses object should define at least one success (200 level) response or a default response.'
      }))
    },

    securityRequirementNotEmptyArray: (data: ValidatorData, location: LocationInput, major: number) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'SERNEA',
        alternateLevels: [],
        level: 'error',
        message: 'Security requirement value must be an empty array unless associated security scheme type is ' +
          (major === 2 ? 'oauth2' : 'either oauth2 or openIdConnect')
      }))
    },

    securitySchemeMissingReference: (data: ValidatorData, location: LocationInput, major: number) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'SESCMR',
        alternateLevels: [],
        level: 'error',
        message: 'Security scheme name must have an associated reference at ' +
          (major === 2 ? 'Swagger > SecurityDefinitions' : 'OpenAPI > Components > SecuritySchemes')
      }))
    },

    swaggerBasePathInvalid: (data: ValidatorData, location: LocationInput, basePath: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'SWBAPI',
        alternateLevels: [],
        level: 'error',
        message: 'The base path must start with a forward slash.',
        metadata: { basePath }
      }))
    },

    swaggerBasePathTemplating: (data: ValidatorData, location: LocationInput, basePath: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'SHDNSP',
        alternateLevels: [],
        level: 'error',
        message: 'The base path does not support path templating.',
        metadata: { basePath }
      }))
    },

    swaggerHostDoesNotSupportPathTemplating: (data: ValidatorData, location: LocationInput, host: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'SHDNSP',
        alternateLevels: [],
        level: 'error',
        message: 'The host does not support path templating.',
        metadata: { host }
      }))
    },

    swaggerHostHasScheme: (data: ValidatorData, location: LocationInput, host: string, scheme: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'SWHOHS',
        alternateLevels: [],
        level: 'error',
        message: 'The host must not include the scheme: ' + smart(scheme),
        metadata: { host, scheme }
      }))
    },

    swaggerHostHasSubPath: (data: ValidatorData, location: LocationInput, host: string, subPath: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'SWHHAS',
        alternateLevels: [],
        level: 'error',
        message: 'The host must not include sub path: ' + smart(subPath),
        metadata: { host, subPath }
      }))
    },

    unknownTypeFormat: (data: ValidatorData, location: LocationInput, type: string, format: string) => {
      return this.message(getExceptionMessageData(data, [location], false, {
        code: 'UNTYFO',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'Unregistered format ' + smart(format) + ' used for type ' + smart(type) + '.',
        metadata: { type, format }
      }))
    },

    valueIgnored: (data: ValidatorData, location: LocationInput, value: string, reason: string) => {
      return this.message(getExceptionMessageData(data, [location], true, {
        code: 'VALIGN',
        alternateLevels: ['ignore', 'info', 'warn', 'error'],
        level: 'warn',
        message: 'The following value will be ignored: ' + smart(value) + '. ' + reason,
        metadata: { value, reason }
      }))
    }

  }
}

function getExceptionMessageData (data: ValidatorData | null, locations: LocationInput[], reference: boolean | string, message: Partial<Message>): Message {
  // convert location lookup data to actual locations
  const actualLocations = locations
    .map(location => {
      const node = location.node ?? data?.component.definition
      return lookupLocation(node, location.key, location.type)
    })
    .filter(location => location !== undefined)

  return Object.assign(message, {
    code: 'OAE-D' + (message.code as string),
    definition: data === null ? '' : data.component.definition,
    locations: actualLocations,
    metadata: message.metadata ?? {},
    reference: reference === true
      ? data === null ? '' : data.component.reference
      : reference === false ? '' : reference
  }) as Message
}
