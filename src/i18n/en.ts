import { II18nMessagesMap } from './i18n'

export const language: II18nMessagesMap = {
  COMPONENT_NAME_INVALID: 'Component {{componentsNamespace}} property names can only contain letters, numbers, dots, ' +
    'dashes, and underscores. The property {{propertyName}} is not valid.',
  CONTENT_TYPE_INVALID: 'Content-type appears to be invalid: {{contentType}}.',
  DATA_STORE_REF_INVALID: 'Unable to add the item to the datastore because the data store reference is invalid.',
  DISCRIMINATOR_ILLEGAL: 'The discriminator can only used in conjunction with allOf, oneOf, or anyOf.',
  DISCRIMINATOR_MAPPING_INVALID: 'The mapping value {{value}} was not found in the list of potential {anyOfOneOf} values.',
  DISCRIMINATOR_REQUIRED_PROPERTY: 'The discriminator property {{propertyName}} is required by all schemas associated with this discriminator.',
  ENUM_NOT_MET: 'Expected one of {{enum}}. Received: {{value}}.',
  I18N_LANGUAGE_NOT_DEFINED: 'Language cannot be set to {{languageCode}} because that language has not yet been added.',
  I18N_MISSING_MESSAGES: 'Cannot add language {{languageCode}} because the following message codes are not defined ' +
    'within the messages map: {{missingMessageCodes}}',
  LOADER_NOT_FOUND: 'Unable to find a loader to load the provided resource: {{resource}}.',
  LOADER_YAML_PARSE_ERROR: 'Unable to parse YAML for one or more reasons: {{reasons}}.',
  LOADER_YAML_SUPPORT_ERROR: 'YAML anchors and aliases are not currently supported.',
  LOCATOR_INVALID_REFERENCE: 'Invalid reference. It must be a non-null object or an array.',
  NOT_IMPLEMENTED: 'Function not implemented',
  NULL_INVALID: 'Value cannot be null.',
  OPERATION_BODY_FORM_CONFLICT: 'Parameters can include a body parameter or one or more formData parameters, but not ' +
    'both. The body parameter and formData parameter are mutually exclusive.',
  OPERATION_BODY_NOT_UNIQUE: 'Only one body parameter is allowed, but multiple were found.',
  OPERATION_CONSUMES_FORM_DATA: 'When specifying formData or file type parameters you should also specify that the ' +
    'operation consumes either "multipart/form-data" or "application/x-www-form-urlencoded".',
  OPERATION_ID_NOT_UNIQUE: 'Each operationId must be unique, but multiple operations have the same operationId: {{operationId}}.',
  OPTIONS_INVALID: 'Invalid options specified. {{details}}',
  PARAMETER_NAMESPACE_CONFLICT: 'Found one or more parameter conflicts. Parameters cannot share the same "name" and ' +
    '"in" values.',
  PARAMETER_PATH_NOT_DEFINED: 'One or more parameters in the path are not defined as path parameters in the Parameters ' +
    'array: {{parameterNames}}.',
  PARAMETER_NOT_IN_PATH: 'A path parameter was defined in the parameters array that is not found in the path: {{parameterName}}.',
  PATH_ENDINGS_INCONSISTENT: 'Some paths end with a slash and some do not. This inconsistency may confuse the users of ' +
    'your API.',
  PATH_MISSING_LEADING_SLASH: 'The path should start with a forward slash.',
  PATH_OPERATION_CONFLICT: 'One or more paths are indistinguishable due to duplicate paths and methods.',
  PATH_SPEC_CONFLICT: 'One or more paths are considered invalid by the standards of the OpenAPI specification due to ' +
    'path collision, but because they have different methods they are distinguishable.',
  PATH_NOT_FOUND: 'No matching path found for path: {{path}}',
  PATHS_EMPTY: 'No paths were provided.',
  PROPERTIES_MUTUALLY_EXCLUSIVE: 'These properties are mutually exclusive: {{propertyNames}}.',
  PROPERTY_NOT_ALLOWED: 'The property {{propertyName}} is not allowed. {reason}',
  PROPERTY_MISSING: 'Required property {{propertyName}} is missing.',
  PROPERTY_UNKNOWN: 'The property {{propertyName}} is not allowed because it is not part of the spec.',
  REF_NOT_ALLOWED: 'According to the OpenAPI specification, the $ref is not allowed here.',
  REF_CONFLICT: 'The $ref property is not supported when other fields also exist. See issue ' +
    'https://github.com/OAI/OpenAPI-Specification/issues/2635',
  REF_NOT_RESOLVED: 'The reference could not be resolved: {{reference}}.',
  SCHEMA_NOT_MET: 'The value {{value}} does not match any of the potential values.',
  SCHEMA_NOT_DESERIALIZABLE: 'The value could not be deserialized. {reason}',
  SCHEMA_NOT_RANDOMIZABLE: 'A random value could not be generated. {reason}',
  SCHEMA_NOT_SERIALIZABLE_TYPE: 'The value could not be serialized. The value is not the expected type: {expectedType}',
  SCHEMA_TYPE_FORMAT_BINARY_LENGTH: 'The binary format requires {lengthProperty} to be a multiple of 8.',
  SCHEMA_TYPE_FORMAT_BYTE_LENGTH: 'The binary format requires {lengthProperty} to be a multiple of 4',
  SCHEMA_TYPE_FORMAT_DATE_FORMAT: 'The date string should be formatted as YYYY-MM-DD',
  SCHEMA_TYPE_FORMAT_DATE_INVALID: 'The date is not valid: {{value}}.',
  SCHEMA_TYPE_FORMAT_DATE_LENGTH: 'The date format requires {lengthProperty} to equal 10',
  SCHEMA_TYPE_FORMAT_DATE_TIME_FORMAT: 'The date-time string should be formatted as YYYY-MM-DDThh:mm:ss.sssZ or YYYY-MM-DDThh:mm:ss.sss+00:00',
  SCHEMA_TYPE_FORMAT_DATE_TIME_LENGTH: 'The date-time string {lengthProperty} must be between 20 and 29.',
  SUMMERY_EXCEEDS_RECOMMENDED_LENGTH: 'The summary should be less than 120 characters in length.',
  URL_INVALID: 'URL appears to be invalid: {{url}}.',
  VALUE_OUT_OF_RANGE: metadata => {
    if (metadata.description === undefined) metadata.description = 'value'
    if ('maximum' in metadata && 'minimum' in metadata) {
      return `The {description} {{value}} must be ${metadata.exclusive === true ? '' : 'equal to or '} between {{minimum}} and {{maximum}}`
    } else if ('maximum' in metadata) {
      return `The {description} {{value}} must be less than ${metadata.exclusive === true ? '' : 'or equal to '} {{maximum}}`
    } else if ('minimum' in metadata) {
      return `The {description} {{value}} must be greater than ${metadata.exclusive === true ? '' : 'or equal to '} {{minimum}}`
    } else {
      return 'The value {{value}} is outside the expected range'
    }
  },
  VALUE_TYPE_INVALID: 'The value {{value}} did not match the expected data type: {{expectedType}}.',
  VERSION_MISMATCH: 'The OpenAPI Enforcer and the OpenAPI specification both support a {{componentName}} object, although ' +
    'you\'re using the wrong version of the class in the OpenAPI enforcer for this object.',
  VERSION_NOT_IMPLEMENTED: 'The OpenAPI Enforcer does not currently support OpenAPI specification version {{version}}.',
  VERSION_NOT_SUPPORTED: 'The {{componentName}} object does not exist in OpenAPI specification {{version}}.'
}
