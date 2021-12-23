import { smart, ucFirst } from './util'

type Message = [string, string, Record<string, any>]

export function dataTypeEnum (_enum: any[], value: any): Message {
  return [
    'DATA_ENUM_NOT_MET',
    'Value ' + smart(value) + ' did not meet enum requirements.',
    {
      enum: _enum,
      value
    }
  ]
}

export function dataTypeInvalid (expected: string, value: any): Message {
  return [
    'DATA_INVALID_TYPE',
    'Expected ' + expected + '. Received: ' + smart(value),
    {
      expected,
      value
    }
  ]
}

export function dataTypeMaximum (maximum: number, exclusive: boolean, sValue: string, value: number): Message {
  return [
    'DATA_BOUNDS_NUMERIC_RANGE',
    'Value must be less than ' + (exclusive ? '' : ' or equal to') + String(maximum) + '. Received: ' + sValue,
    {
      exclusive,
      maximum,
      sValue,
      value
    }
  ]
}

export function dataTypeMaxItems (maximum: number, length: number): Message {
  return [
    'DATA_BOUNDS_ARRAY_LENGTH',
    'Array must contain less than ' + String(maximum) + ' items. Item count: ' + String(length),
    {
      length,
      maximum
    }
  ]
}

export function dataTypeMaxLength (maximum: number, length: number): Message {
  return [
    'DATA_BOUNDS_STRING_LENGTH',
    'Length must be less than or equal to ' + String(maximum) + '. Actual length: ' + String(length),
    {
      length,
      maximum
    }
  ]
}

export function dataTypeMaxProperties (maximum: number, length: number): Message {
  return [
    'DATA_BOUNDS_PROPERTY_COUNT',
    'Object must have less than ' + String(maximum) + ' properties. Property count: ' + String(length),
    {
      length,
      maximum
    }
  ]
}

export function dataTypeMinimum (minimum: number, exclusive: boolean, sValue: string, value: number): Message {
  return [
    'DATA_BOUNDS_NUMERIC_RANGE',
    'Value must be greater than ' + (exclusive ? '' : ' or equal to') + String(minimum) + '. Received: ' + sValue,
    {
      exclusive,
      minimum,
      sValue,
      value
    }
  ]
}

export function dataTypeMinItems (minimum: number, length: number): Message {
  return [
    'DATA_BOUNDS_ARRAY_LENGTH',
    'Array must contain at least ' + String(minimum) + ' items. Item count: ' + String(length),
    {
      length,
      minimum
    }
  ]
}

export function dataTypeMinLength (maximum: number, length: number): Message {
  return [
    'DATA_BOUNDS_STRING_LENGTH',
    'Length must be greater than or equal to ' + String(maximum) + '. Actual length: ' + String(length),
    {
      length,
      maximum
    }
  ]
}

export function dataTypeMinProperties (minimum: number, length: number): Message {
  return [
    'DATA_BOUNDS_PROPERTY_COUNT',
    'Object must have at least ' + String(minimum) + ' properties. Property count: ' + String(length),
    {
      length,
      minimum
    }
  ]
}

export function dataTypeMultipleOf (multipleOf: number, sValue: string, value: number): Message {
  return [
    'DATA_RANGE_EXCEEDED',
    'Expected a multiple of ' + String(multipleOf) + '. Received: ' + sValue,
    {
      multipleOf,
      sValue,
      value
    }
  ]
}

export function dataTypePropertyMissing (properties: string[]): Message {
  return [
    'DATA_OBJECT_PROPERTY_MISSING_REQUIRED',
    'One or more required properties missing: ' + properties.join(', '),
    {
      properties
    }
  ]
}

export function dataTypePropertyNotAllowed (): Message {
  return [
    'DATA_OBJECT_PROPERTY_NOT_ALLOWED',
    'Property not allowed',
    {}
  ]
}

export function dataTypeReadOnly (readOnlyProperties: string[]): Message {
  return [
    'DATA_READ_ONLY',
    'Cannot write to read-only properties: ' + readOnlyProperties.join(', '),
    {
      readOnlyProperties
    }
  ]
}

export function dataTypeUnique (index: number): Message {
  return [
    'DATA_ARRAY_NOT_UNIQUE',
    'Array items must be unique. Value is not unique at index: ' + String(index),
    {
      index
    }
  ]
}

export function dataTypeWriteOnly (writeOnlyProperties: string[]): Message {
  return [
    'DATA_WRITE_ONLY',
    'Cannot read from write-only properties: ' + writeOnlyProperties.join(', '),
    {
      writeOnlyProperties
    }
  ]
}

export function definitionInvalid (isOpenAPI: boolean): Message {
  return [
    'DEFINITION_INVALID',
    'Your ' + (isOpenAPI ? 'OpenAPI' : 'Swagger') + ' document is not valid. Please validate prior to use.',
    {}
  ]
}

export function invalidInput (explanation: string): Message {
  return [
    'INVALID_INPUT',
    'Invalid input. ' + explanation,
    {}
  ]
}

export function operationMissingRequiredParameters (at: string, names: string[]): Message {
  return [
    'OPERATION_REQUEST_MISSING_REQUIRED_PARAMETERS',
    at === 'body' ? 'Missing required body' : 'One or more required ' + at + ' parameters are missing: ' + names.join(', '),
    {
      in: at,
      names
    }
  ]
}

export function operationRequestBodyNotAllowed (): Message {
  return [
    'OPERATION_REQUEST_BODY_NOT_ALLOWED',
    'This operation does not allow a request body.',
    {}
  ]
}

export function operationRequestContentTypeNotProvided (): Message {
  return [
    'OPERATION_REQUEST_CONTENT_TYPE_NOT_PROVIDED',
    'The "content-type" header must be included when sending a request body.',
    {}
  ]
}

export function operationRequestContentTypeNotValid (contentType: string, allowedTypes: string[]): Message {
  return [
    'OPERATION_REQUEST_CONTENT_TYPE_INVALID',
    'The specified content type cannot be processed by this operation: ' + contentType + '. Try one of: ' + allowedTypes.join(', '),
    {
      contentType,
      allowedTypes
    }
  ]
}

export function operationResponseCodeInvalid (code: string, allowedCodes: string[]): Message {
  return [
    'OPERATION_RESPONSE_CODE_INVALID',
    'The response code is not valid for this operation: ' + code + (allowedCodes.length > 0 ? '. Use one of: ' + allowedCodes.join(', ') : ''),
    {
      allowedCodes,
      code
    }
  ]
}

export function operationResponseContentTypeInvalid (code: string, contentType: string, allowedTypes: string): Message {
  return [
    'OPERATION_RESPONSE_CONTENT_TYPE_INVALID',
    'The response content-type is not valid for this operation\'s ' + code + ' response code: ' + contentType + (allowedTypes.length > 0 ? '. Use one of: ' + allowedTypes.join(', ') : '. No content types are allowed.'),
    {
      allowedTypes,
      code,
      contentType
    }
  ]
}

// TODO: how is parameterParseEmptyValue being used vs parameterParseNoValue? Do I need both?
export function parameterParseEmptyValue (): Message {
  return [
    'PARAMETER_PARSE_EMPTY_VALUE',
    'Empty value not allowed.',
    {}
  ]
}

export function parameterParseNoSchema (): Message {
  return [
    'PARAMETER_PARSE_SCHEMA_MISSING',
    'Unable to parse value without a schema',
    {}
  ]
}

export function parameterParseNoValue (): Message {
  return [
    'PARAMETER_PARSE_VALUE_MISSING',
    'Unable to parse because there is no value to parse',
    {}
  ]
}

export function parameterParseStyle (style: string, type: string, explode: boolean): Message {
  return [
    'PARAMETER_PARSE_STYLE',
    ucFirst(type) + ' value is incomplete or improperly formatted for ' + (explode ? 'exploded ' : '') + style + ' style.',
    {
      explode,
      style,
      type
    }
  ]
}

export function parameterParseInvalidInput (value: any, expectedType: string): Message {
  const actualType = typeof value
  return [
    'PARAMETER_PARSE_INVALID_INPUT',
    'Input is not of the expected type "' + expectedType + '". Actual type: "' + actualType + '". Actual value ' + smart(value),
    {
      actualType,
      expectedType,
      value
    }
  ]
}

export function schemaDiscriminatorUnmapped (key: string, name: string): Message {
  return [
    'SCHEMA_DISCRIMINATOR_UNMAPPED',
    'Discriminator property "' + key + '" as "' + name + '" did not map to a schema.',
    {
      key,
      name
    }
  ]
}

export function schemaIndeterminate (operation: string): Message {
  return [
    'SCHEMA_INDETERMINATE',
    'Unable to determine schema for operation: ' + operation,
    {
      operation
    }
  ]
}

export function schemaIndeterminateType (operation: string): Message {
  return [
    'SCHEMA_INDETERMINATE_TYPE',
    'Unable to perform operation (' + operation + ') because the schema has no type.',
    {
      operation
    }
  ]
}

export function schemaPopulateNotSchema (): Message {
  return [
    'SCHEMA_POPULATE_NOT_SCHEMA',
    'Cannot populate "not" schemas.',
    {}
  ]
}

export function schemaPopulateNoDiscriminator (mode: 'anyOf' | 'oneOf'): Message {
  return [
    'SCHEMA_POPULATE_NO_DISCRIMINATOR',
    'Unable to populate ' + mode + ' without a discriminator',
    {
      mode
    }
  ]
}

export function schemaShouldNotValidate (): Message {
  return [
    'SCHEMA_VALIDATE_NOT',
    'Value should not validate against the schema',
    {}
  ]
}

export function unexpected (error: Error | any): Message {
  return [
    'ERROR_UNEXPECTED',
    'Unexpected error: ' + String(error.message ?? error),
    {
      error
    }
  ]
}
