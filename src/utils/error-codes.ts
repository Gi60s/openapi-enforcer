import { smart, ucFirst } from './util'

type Message = [string, string, Record<string, any>]

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

export function operationResponseContentTypeInvalid (code: string, contentType: string, allowedTypes: string[]): Message {
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
