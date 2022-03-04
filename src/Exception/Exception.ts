import { ExceptionBase, Message, smart } from './ExceptionBase'
import { ucFirst } from '../utils/util'

const codePrefix = 'OAE-E'

interface Adders {

  dataTypeEnum: (_enum: any[], value: any) => Message
  dataTypeInvalid: (expectedType: string, actualValue: any) => Message
  dataTypeMaximum: (maximum: number, exclusive: boolean, sValue: string, value: number) => Message
  dataTypeMaxItems: (maximum: number, length: number) => Message
  dataTypeMaxLength: (maximum: number, length: number) => Message
  dataTypeMaxProperties: (maximum: number, length: number) => Message
  dataTypeMinimum: (minimum: number, exclusive: boolean, sValue: string, value: number) => Message
  dataTypeMinItems: (minimum: number, length: number) => Message
  dataTypeMinLength: (maximum: number, length: number) => Message
  dataTypeMinProperties: (minimum: number, length: number) => Message
  dataTypeMultipleOf: (multipleOf: number, sValue: string, value: number) => Message
  dataTypeMissingProperties: (properties: string[]) => Message
  dataTypeNotAllOf: (exceptions: Exception[]) => Message
  dataTypeNotOneOf: (exceptions: Exception[]) => Message
  dataTypePropertiesNotAllowed: (properties: string[]) => Message
  dataTypeReadOnly: (readOnlyProperties: string[]) => Message
  dataTypeUnique: (indexes: number[], values: any[]) => Message
  dataTypeWriteOnly: (writeOnlyProperties: string[]) => Message

  detailedError: (exception: Exception) => Message

  definitionInvalid: (isOpenAPI: boolean) => Message
  invalidInput: (explanation: string) => Message

  operationMissingRequiredParameters: (at: string, names: string[]) => Message
  operationRequestBodyNotAllowed: (method: string, path: string) => Message
  operationRequestContentTypeNotProvided: () => Message
  operationRequestContentTypeNotValid: (contentType: string, allowedTypes: string[]) => Message
  operationResponseCodeInvalid: (code: string, allowedCodes: string[]) => Message
  operationResponseContentTypeInvalid: (code: string, contentType: string, allowedTypes: string[]) => Message

  // TODO: how is parameterParseEmptyValue being used vs parameterParseNoValue? Do I need both?
  parameterParseEmptyValue: () => Message
  parameterParseNoSchema: () => Message
  parameterParseNoValue: () => Message
  parameterParseStyle: (style: string, type: string, explode: boolean) => Message
  parameterParseInvalidInput: (value: any, expectedType: string) => Message

  schemaAdditionalProperties: (properties: string[]) => Message
  schemaDiscriminatorUnmapped: (key: string, name: string) => Message
  schemaIndeterminate: (operation: string) => Message
  schemaIndeterminateType: (operation: string) => Message
  schemaPopulateNotSchema: () => Message
  schemaPopulateNoDiscriminator: (mode: 'anyOf' | 'oneOf') => Message
  schemaShouldNotValidate: () => Message

  unexpected: (error: Error | any) => Message
}

export class Exception extends ExceptionBase<Exception> {
  at (key: string | number): Exception {
    return super.at(key) as Exception
  }

  add: Adders = {

    dataTypeEnum: (_enum: any[], value: any) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTENNM',
        level: 'error',
        message: 'Value ' + smart(value) + ' did not meet enum requirements.',
        metadata: {
          enum: _enum,
          value
        },
        reference: ''
      })
    },

    dataTypeInvalid: (expectedType: string, actualValue: any) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTINVD',
        level: 'error',
        message: 'Expected ' + expectedType + '. Received: ' + smart(actualValue),
        metadata: {
          actualValue,
          expectedType
        },
        reference: ''
      })
    },

    dataTypeMaxItems: (maxItems: number, itemCount: number) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTARLN',
        level: 'error',
        message: 'Array must contain ' + smart(maxItems) + ' or fewer items. Item count: ' + smart(itemCount),
        metadata: {
          bound: 'maximum',
          itemCount,
          maxItems
        },
        reference: ''
      })
    },

    dataTypeMinItems: (minItems: number, itemCount: number) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTARLN',
        level: 'error',
        message: 'Array must contain ' + smart(minItems) + ' or more items. Item count: ' + smart(itemCount),
        metadata: {
          bound: 'minimum',
          itemCount,
          minItems
        },
        reference: ''
      })
    },

    dataTypeMaxLength: (maximum: number, length: number) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTVALE',
        level: 'error',
        message: 'Length must be less than or equal to ' + smart(maximum) + '. Actual length: ' + smart(length),
        metadata: {
          bound: 'maximum',
          length,
          maximum
        },
        reference: ''
      })
    },

    dataTypeMinLength: (maximum: number, length: number) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTVALE',
        level: 'error',
        message: 'Length must be greater than or equal to ' + smart(maximum) + '. Actual length: ' + smart(length),
        metadata: {
          bound: 'minimum',
          length,
          maximum
        },
        reference: ''
      })
    },

    dataTypeMaxProperties: (maxProperties: number, length: number) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTPRCO',
        level: 'error',
        message: 'Object must have ' + smart(maxProperties) + ' or fewer properties. Actual count: ' + smart(length),
        metadata: {
          bound: 'maximum',
          length,
          maxProperties
        },
        reference: ''
      })
    },

    dataTypeMinProperties: (minProperties: number, length: number) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTPRCO',
        level: 'error',
        message: 'Object must have ' + smart(minProperties) + ' or more properties. Actual count: ' + smart(length),
        metadata: {
          bound: 'minimum',
          length,
          minProperties
        },
        reference: ''
      })
    },

    dataTypeMaximum: (maximum: number, exclusive: boolean, sValue: string, value: number) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTNURA',
        level: 'error',
        message: 'Value must be less than ' + (exclusive ? '' : 'or equal to ') + smart(maximum) + '. Received: ' + smart(sValue),
        metadata: {
          bound: 'maximum',
          exclusive,
          numericValue: value,
          value: sValue
        },
        reference: ''
      })
    },

    dataTypeMinimum: (minimum: number, exclusive: boolean, sValue: string, value: number) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTNURA',
        level: 'error',
        message: 'Value must be greater than ' + (exclusive ? '' : 'or equal to ') + smart(minimum) + '. Received: ' + smart(sValue),
        metadata: {
          bound: 'minimum',
          exclusive,
          numericValue: value,
          value: sValue
        },
        reference: ''
      })
    },

    dataTypeMultipleOf: (multipleOf: number, sValue: string, value: number) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTMUOF',
        level: 'error',
        message: 'Expected a multiple of ' + smart(multipleOf) + '. Received: ' + smart(sValue),
        metadata: {
          multipleOf,
          numericValue: value,
          value: sValue
        },
        reference: ''
      })
    },

    dataTypeMissingProperties: (requiredProperties: string[]) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTMIPR',
        level: 'error',
        message: requiredProperties.length === 1
          ? 'Missing a required property: ' + smart(requiredProperties[1])
          : 'Missing required properties: ' + smart(requiredProperties),
        metadata: {
          requiredProperties
        },
        reference: ''
      })
    },

    dataTypeNotAllOf: (exceptions: Exception[]) => {
      const exception = new Exception('')
      exceptions.forEach((e, i) => {
        exception.data.at[i] = e
      })
      return this.message({
        alternateLevels: ['error'],
        code: codePrefix + 'DTNOAO',
        level: 'error',
        message: 'Value not valid for all criteria',
        metadata: {
          exceptions
        },
        reference: '',
        exception
      })
    },

    dataTypeNotOneOf: (exceptions: Exception[]) => {
      const exception = new Exception('')
      exceptions.forEach((e, i) => {
        exception.data.at[i] = e
      })
      return this.message({
        alternateLevels: ['error'],
        code: codePrefix + 'DTNOOO',
        level: 'error',
        message: 'Value not valid for any criteria',
        metadata: {
          exceptions
        },
        reference: '',
        exception
      })
    },

    dataTypePropertiesNotAllowed: (propertiesNotAllowed: string[]) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTPRNA',
        level: 'error',
        message: propertiesNotAllowed.length === 1
          ? 'Property not allowed: ' + smart(propertiesNotAllowed[1])
          : 'Properties not allowed: ' + smart(propertiesNotAllowed),
        metadata: {
          propertiesNotAllowed
        },
        reference: ''
      })
    },

    dataTypeReadOnly: (readOnlyProperties: string[]) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTPRRO',
        level: 'error',
        message: readOnlyProperties.length === 1
          ? 'Property is read only: ' + smart(readOnlyProperties[1])
          : 'Properties are read only: ' + smart(readOnlyProperties),
        metadata: {
          readOnlyProperties
        },
        reference: ''
      })
    },

    dataTypeWriteOnly: (writeOnlyProperties: string[]) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTPRWO',
        level: 'error',
        message: writeOnlyProperties.length === 1
          ? 'Property is write only: ' + smart(writeOnlyProperties[1])
          : 'Properties are write only: ' + smart(writeOnlyProperties),
        metadata: {
          writeOnlyProperties
        },
        reference: ''
      })
    },

    dataTypeUnique: (indexes: number[], value: any) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTARUN',
        level: 'error',
        message: 'Array values must be unique, but values at indexes ' +
          smart(indexes) + ' are the same value.',
        metadata: {
          indexes,
          value
        },
        reference: ''
      })
    },

    definitionInvalid: (isOpenAPI: boolean) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DENOVA',
        level: 'error',
        message: 'Your ' + (isOpenAPI ? 'OpenAPI' : 'Swagger') + ' document is not valid. Please validate prior to use.',
        metadata: {
          isOpenAPI
        },
        reference: ''
      })
    },

    detailedError: (exception: Exception) => {
      return this.message({
        alternateLevels: ['error'],
        code: codePrefix + 'DETERR',
        level: 'error',
        message: exception.header ?? 'An error exists',
        metadata: {
          exception
        },
        reference: '',
        exception
      })
    },

    invalidInput: (explanation: string) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'INVINP',
        level: 'error',
        message: 'Invalid input. ' + explanation,
        metadata: {},
        reference: ''
      })
    },

    operationMissingRequiredParameters: (at: string, names: string[]) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'OPRMRP',
        level: 'error',
        message: at === 'body'
          ? 'Missing required body'
          : 'Missing required ' + at + ' parameter' + (names.length > 1 ? 's' : '') + ': ' + smart(names),
        metadata: {
          at,
          parameterNames: names
        },
        reference: ''
      })
    },

    operationRequestBodyNotAllowed: (method: string, path: string) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'OPRBNA',
        level: 'error',
        message: 'This operation does not allow a request body: ' + method.toUpperCase() + ' ' + path,
        metadata: {
          method,
          path
        },
        reference: ''
      })
    },

    operationRequestContentTypeNotProvided: () => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'OPRCNP',
        level: 'warn',
        message: 'The "content-type" header was not specified so the first defined content-type was used.',
        metadata: {},
        reference: ''
      })
    },

    operationRequestContentTypeNotValid: (contentType: string, allowedTypes: string[]) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'OPRCNV',
        level: 'error',
        message: 'The specified content type cannot be produced by this operation: ' + smart(contentType) + '. Try one of: ' + smart(allowedTypes),
        metadata: {
          allowedTypes,
          contentType
        },
        reference: ''
      })
    },

    operationResponseCodeInvalid: (code: string, allowedCodes: string[]) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'OPRCNV',
        level: 'error',
        message: 'The response code for this operation is not provided in the OpenAPI document: ' + smart(code) + (allowedCodes.length > 0 ? '. Use one of: ' + smart(allowedCodes) : ''),
        metadata: {
          allowedCodes,
          code
        },
        reference: ''
      })
    },

    operationResponseContentTypeInvalid: (code: string, contentType: string, allowedTypes: string[]) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'OPRTNV',
        level: 'error',
        message: 'The response content-type for this operation is not provided in the OpenAPI document for response code ' + smart(code) + ': ' + smart(contentType) + (allowedTypes.length > 0 ? '. Use one of: ' + smart(allowedTypes) : '. No content types are specified.'),
        metadata: {
          allowedTypes,
          code,
          contentType
        },
        reference: ''
      })
    },

    parameterParseEmptyValue: () => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'PAPAEV',
        level: 'error',
        message: 'Empty values not allowed for this parameter.',
        metadata: {},
        reference: ''
      })
    },

    parameterParseInvalidInput: (value: any, expectedType: string) => {
      const actualType = typeof value
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'PAPAIV',
        level: 'error',
        message: 'Input is not of the expected type ' + smart(expectedType) + '. Actual type: ' + smart(actualType) + '". Actual value ' + smart(value),
        metadata: {},
        reference: ''
      })
    },

    parameterParseNoSchema: () => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'PAPANS',
        level: 'error',
        message: 'Unable to parse value without a schema.',
        metadata: {},
        reference: ''
      })
    },

    parameterParseNoValue: () => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'PAPANV',
        level: 'error',
        message: 'Unable to parse because there is no value to parse.',
        metadata: {},
        reference: ''
      })
    },

    parameterParseStyle: (style: string, type: string, explode: boolean) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'PAPAST',
        level: 'error',
        message: ucFirst(type) + ' value is incomplete or improperly formatted for ' + (explode ? 'exploded ' : '') + style + ' style.',
        metadata: {
          explode,
          style,
          type
        },
        reference: ''
      })
    },

    schemaAdditionalProperties: (properties: string[]) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'SCIGPR',
        level: 'ignore',
        message: properties.length === 1
          ? 'Value contains an additional property that is not defined in the schema: ' + smart(properties[0])
          : 'Value contains additional properties that are not defined in the schema: ' + smart(properties),
        metadata: {
          properties
        },
        reference: ''
      })
    },

    schemaDiscriminatorUnmapped: (key: string, name: string) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'SCDIUM',
        level: 'error',
        message: 'Discriminator property ' + smart(key) + ' as ' + smart(name) + ' did not map to a schema.',
        metadata: {
          key,
          name
        },
        reference: ''
      })
    },

    schemaIndeterminate: (operation: string) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'SCINDE',
        level: 'error',
        message: 'Unable to determine schema for operation: ' + operation,
        metadata: {
          operation
        },
        reference: ''
      })
    },

    schemaIndeterminateType: (operation: string) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'SCINDT',
        level: 'error',
        message: 'Unable to perform operation ' + smart(operation) + ' because the schema has no type.',
        metadata: {
          operation
        },
        reference: ''
      })
    },

    schemaPopulateNoDiscriminator: (mode: 'anyOf' | 'oneOf') => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'SCPPND',
        level: 'error',
        message: 'Unable to populate ' + mode + ' without a discriminator',
        metadata: {
          mode
        },
        reference: ''
      })
    },

    schemaPopulateNotSchema: () => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'SCPPNT',
        level: 'error',
        message: 'Cannot populate "not" schemas.',
        metadata: {},
        reference: ''
      })
    },

    schemaShouldNotValidate: () => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'SCVLNO',
        level: 'error',
        message: 'Value should not validate against the schema',
        metadata: {},
        reference: ''
      })
    },

    unexpected: (error: any) => {
      return this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'UNEXPT',
        level: 'error',
        message: 'Unexpected error: ' + String(error !== null && typeof error === 'object' ? error.message ?? error : error),
        metadata: {
          error
        },
        reference: ''
      })
    }
  }
}
