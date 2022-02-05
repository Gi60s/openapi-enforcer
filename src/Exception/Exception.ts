import { ExceptionCore, Message, smart } from './ExceptionCore'

const codePrefix = 'OAE-E'

interface Adders {
  dataTypeEnum: (_enum: any[], value: any) => void
  dataTypeInvalid: (expectedType: string, actualValue: any) => void
  dataTypeMaximum: (maximum: number, exclusive: boolean, sValue: string, value: number) => void
  dataTypeMaxItems: (maximum: number, length: number) => void
  dataTypeMaxLength: (maximum: number, length: number) => void
  dataTypeMaxProperties: (maximum: number, length: number) => void
  dataTypeMinimum: (minimum: number, exclusive: boolean, sValue: string, value: number) => void
  dataTypeMinItems: (minimum: number, length: number) => void
  dataTypeMinLength: (maximum: number, length: number) => void
  dataTypeMinProperties: (minimum: number, length: number) => void
  dataTypeMultipleOf: (multipleOf: number, sValue: string, value: number) => void
  dataTypeMissingProperties: (properties: string[]) => void
  dataTypePropertiesNotAllowed: (properties: string[]) => void
  dataTypeReadOnly: (readOnlyProperties: string[]) => void
  dataTypeUnique: (indexes: number[], values: any[]) => void
  dataTypeWriteOnly: (writeOnlyProperties: string[]) => void

  definitionInvalid: (isOpenAPI: boolean) => void
  invalidInput: (explanation: string) => void

  operationMissingRequiredParameters: (at: string, names: string[]) => void
  operationRequestBodyNotAllowed: (method: string, path: string) => void
  operationRequestContentTypeNotProvided: () => void
  operationRequestContentTypeNotValid: (contentType: string, allowedTypes: string[]) => void
  operationResponseCodeInvalid: (code: string, allowedCodes: string[]) => void
  operationResponseContentTypeInvalid: (code: string, contentType: string, allowedTypes: string[]) => void

  // TODO: how is parameterParseEmptyValue being used vs parameterParseNoValue? Do I need both?
  parameterParseEmptyValue: () => void
  parameterParseNoSchema: () => void
  parameterParseNoValue: () => void
  parameterParseStyle: (style: string, type: string, explode: boolean) => void
  parameterParseInvalidInput: (value: any, expectedType: string) => void

  schemaDiscriminatorUnmapped: (key: string, name: string) => void
  schemaIndeterminate: (operation: string) => void
  schemaIndeterminateType: (operation: string) => void
  schemaPopulateNotSchema: () => void
  schemaPopulateNoDiscriminator: (mode: 'anyOf' | 'oneOf') => void
  schemaShouldNotValidate: () => void

  unexpected: (error: Error | any) => void
}

export class Exception extends ExceptionCore {
  add: Adders = {
    dataTypeEnum: (_enum: any[], value: any) => {
      this.message({
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
      this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTINVD',
        level: 'error',
        message: 'Expected ' + smart(expectedType) + '. Received: ' + smart(actualValue),
        metadata: {
          actualValue,
          expectedType
        },
        reference: ''
      })
    },

    dataTypeMaxItems: (maxItems: number, itemCount: number) => {
      this.message({
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
      this.message({
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
      this.message({
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
      this.message({
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
      this.message({
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
      this.message({
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
      this.message({
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
      this.message({
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
      this.message({
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
      this.message({
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

    dataTypePropertiesNotAllowed: (propertiesNotAllowed: string[]) => {
      this.message({
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
      this.message({
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
      this.message({
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

    dataTypeUnique: (indexes: number[], notUniqueValues: any[]) => {
      this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'DTARUN',
        level: 'error',
        message: 'Array values must be unique, but ' +
          (notUniqueValues.length === 1 ? 'value at index ' : 'values at indexes ') +
          smart(indexes) + ' are not unique.',
        metadata: {
          indexes,
          notUniqueValues
        },
        reference: ''
      })
    },

    definitionInvalid: (isOpenAPI: boolean) => {
      this.message({
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

    invalidInput: (explanation: string) => {
      this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'INVINP',
        level: 'error',
        message: 'Invalid input. ' + explanation,
        metadata: {},
        reference: ''
      })
    },

    operationMissingRequiredParameters: (at: string, names: string[]) => {
      this.message({
        alternateLevels: ['error', 'warn', 'info', 'ignore'],
        code: codePrefix + 'OPRMRP',
        level: 'error',
        message: at === 'body' ? 'Missing required body' : 'One or more required ' + at + ' parameters are missing: ' + smart(names),
        metadata: {
          at,
          parameterNames: names
        },
        reference: ''
      })
    },

    operationRequestBodyNotAllowed: (method: string, path: string) => {
      this.message({
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
    },
    operationRequestContentTypeNotValid: (contentType: string, allowedTypes: string[]) => {
    },
    operationResponseCodeInvalid: (code: string, allowedCodes: string[]) => {
    },
    operationResponseContentTypeInvalid: (code: string, contentType: string, allowedTypes: string[]) => {
    },
    parameterParseEmptyValue: () => {
    },
    parameterParseInvalidInput: (value: any, expectedType: string) => {
    },
    parameterParseNoSchema: () => {
    },
    parameterParseNoValue: () => {
    },
    parameterParseStyle: (style: string, type: string, explode: boolean) => {
    },
    schemaDiscriminatorUnmapped: (key: string, name: string) => {
    },
    schemaIndeterminate: (operation: string) => {
    },
    schemaIndeterminateType: (operation: string) => {
    },
    schemaPopulateNoDiscriminator: (mode: 'anyOf' | 'oneOf') => {
    },
    schemaPopulateNotSchema: () => {
    },
    schemaShouldNotValidate: () => {
    },
    unexpected: (error: any) => {
    }
  }
}

const e = new Exception()
e.add.dataTypeEnum()
