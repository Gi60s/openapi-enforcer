import { Exception } from './'
import { ExceptionMessageData } from './types'
import { smart } from '../util'

export function $refNotAllowed (reference: string): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'DVCREF',
    message: 'Reference not allowed here.',
    metadata: {},
    reference
  }
}

export function defaultRequiredConflict (): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'DEFREQ',
    message: 'Setting a "default" value and setting "required" to true means the "default" value will never be used.',
    metadata: {},
    reference: ''
  }
}

export function encodingNameNotMatched (reference: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'MEDNAM',
    message: 'Encoding name must match a property name in the media type\'s schema',
    metadata: {},
    reference
  }
}

export function enumMissingValues (): ExceptionMessageData {
  return {
    level: 'error',
    code: 'SEENUM',
    message: 'Enum should not be an empty array',
    metadata: {},
    reference: ''
  }
}

export function enumNotMet (reference: string, acceptableValues: any[], invalidValue: any): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DVENUM',
    message: acceptableValues.length > 1
      ? 'Value must be one of: ' + acceptableValues.map(v => smart(v)).join(', ') + '. Received: ' + smart(invalidValue)
      : 'Value must equal: ' + smart(acceptableValues[0]) + '. Received: ' + smart(invalidValue),
    metadata: {
      acceptableValues,
      invalidValue
    },
    reference
  }
}

export function exampleExamplesConflict (reference: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'EXPCFL',
    message: 'Properties "example" and "examples" are mutually exclusive',
    metadata: {},
    reference
  }
}

export function exampleNotSerializable (example: any, schema: any, exception: Exception): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'EXSCNS',
    message: 'Example could not be serialized and therefore cannot be validated against the schema',
    metadata: {
      exception,
      example,
      schema
    },
    reference: ''
  }
}

export function exampleNotValid (example: any, schema: any, exception: Exception): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'EXSCNV',
    message: 'Example is not valid when compared against the schema',
    metadata: {
      exception,
      example,
      schema
    },
    reference: ''
  }
}

export function exampleValueExternalConflict (reference: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'EXVCNF',
    message: 'Cannot have both "externalValue" and "value" properties',
    metadata: {},
    reference
  }
}

export function exampleWithoutSchema (): ExceptionMessageData {
  return {
    level: 'opinion',
    code: 'EXVCNF',
    message: 'An example is great, but you should add a schema. A schema can provide more detailed information than an example',
    metadata: {},
    reference: ''
  }
}

export function exceedsNumberBounds (reference: string, boundBy: 'maximum' | 'minimum', allowEqual: boolean, boundValue: any, invalidValue: number): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DVNBND',
    message: 'Value must be ' +
      (boundBy === 'maximum' ? 'less than' : 'greater than') +
      (allowEqual ? ' or equal to' : '') +
      smart(boundValue) + '. Received: ' + smart(invalidValue),
    metadata: {
      allowEqual,
      boundBy,
      boundValue,
      invalidValue
    },
    reference
  }
}

export function exceedsStringLengthBounds (reference: string, boundBy: 'maxLength' | 'minLength', boundValue: number, invalidValue: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DVSBND',
    message: 'Value must have length ' +
      (boundBy === 'maxLength' ? 'less than' : 'greater than') +
      ' or equal to' + String(boundValue) +
      '. Received: ' + String(invalidValue) + ' (length of ' + String(invalidValue.length) + ')',
    metadata: {
      boundBy,
      boundValue,
      invalidValue
    },
    reference
  }
}

export function exceedsSummaryLength (reference: string, summary: string): ExceptionMessageData {
  const length = summary.length
  return {
    level: 'warn',
    code: 'DVSLEN', // previously OPRSUM
    message: 'Summary should be less than 120 characters. Current length: ' + String(length),
    metadata: {
      length: length,
      summary
    },
    reference
  }
}

export function extensionNotAllowed (reference: string): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'DVOEXT',
    message: 'Schema extensions not allowed here',
    metadata: {},
    reference
  }
}

export function invalidCookieExplode (reference: string, parameterName: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'COOKXP',
    message: 'Cookies do not support exploded values for schemas of type array or object',
    metadata: {
      parameterName
    },
    reference
  }
}

export function invalidEmail (reference: string, invalidValue: any): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'DVIEML',
    message: 'Value does not appear to be a valid email address: ' + smart(invalidValue),
    metadata: {
      invalidValue
    },
    reference
  }
}

export function invalidMaxMin (minimum: any, maximum: any, minProperty: string, maxProperty: string): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'MEDTYP',
    message: 'Property ' + minProperty + ' (' + smart(minimum) + ') must be less than ' + maxProperty + ' (' + smart(maximum) + ')',
    metadata: {
      maximum,
      maxProperty,
      minimum,
      minProperty
    },
    reference: ''
  }
}

export function invalidMediaType (reference: string, mediaType: string): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'MEDTYP',
    message: 'Media type appears invalid: ' + mediaType,
    metadata: {
      mediaType
    },
    reference
  }
}

export function invalidOpenApiVersionNumber (reference: string, version: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'OAIVER',
    message: 'OpenAPI specification version not supported: ' + version,
    metadata: {
      version
    },
    reference
  }
}

export function invalidResponseCode (code: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'RESCOD',
    message: 'Invalid response code: ' + code,
    metadata: {
      code
    },
    reference: ''
  }
}

export function invalidResponseLinkKey (reference: string, key: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'RESLKY',
    message: 'Invalid key used for link value: ' + key,
    metadata: {
      key
    },
    reference
  }
}

export function invalidSemanticVersionNumber (reference: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'OAISVN',
    message: 'Value must be a semantic version number',
    metadata: {},
    reference
  }
}

export function invalidStyle (reference: string, style: string, type: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'STYSCH',
    message: 'Style ' + style + ' is incompatible with schema type: ' + type,
    metadata: {
      style,
      type
    },
    reference
  }
}

export function invalidType (reference: string, expectedType: string, invalidValue: any): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DVTYPE',
    message: 'Invalid type. Expected ' + expectedType + '. Received: ' + smart(invalidValue),
    metadata: {
      expectedType,
      invalidValue
    },
    reference
  }
}

export function invalidUrl (reference: string, invalidValue: any): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'DVIURL',
    message: 'Value does not appear to be a valid URL: ' + smart(invalidValue),
    metadata: {
      invalidValue
    },
    reference
  }
}

export function invalidValue (reference: string, expected: string, value: any): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DTNVAL',
    message: 'Value is not valid. Expected ' + expected + '. Received: ' + smart(value),
    metadata: {
      expected,
      value
    },
    reference
  }
}

export function invalidValueFormat (reference: string, expected: string, format: string, value: any): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DTFRMT',
    message: 'Expected ' + expected + ' of the format ' + format + '. Received: ' + smart(value),
    metadata: {
      expected,
      format,
      value
    },
    reference
  }
}

export function invalidVersionForComponent (reference: string, componentName: string, version: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DVVERS',
    message: componentName + ' object is not supported by OpenAPI specification version ' + version,
    metadata: {
      componentName,
      version
    },
    reference
  }
}

export function linkOperationConflict (reference: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'LNKCFL',
    message: 'Must not define both operationId and operationRef',
    metadata: {},
    reference
  }
}

export function loaderNotAvailable (path: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'LOADNA',
    message: 'No defined loaders were able to load the path: ' + path,
    metadata: { path },
    reference: ''
  }
}

export function missingRequiredProperties (reference: string, properties: string[]): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DVPREQ',
    message: properties.length === 1
      ? 'Missing required property: ' + properties[0]
      : 'Missing required properties: ' + properties.join(', '),
    metadata: {
      properties
    },
    reference
  }
}

export function mustNotBeNull (reference: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DVPREQ',
    message: 'Value must not be null.',
    metadata: {},
    reference
  }
}

export function noPathsDefined (): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'PTHSND',
    message: 'No paths defined',
    metadata: {},
    reference: ''
  }
}

export function notMultipleOf (reference: string, multipleOf: number, value: any): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DTMULT',
    message: 'Expected a multiple of ' + String(multipleOf) + '. Received: ' + smart(value),
    metadata: {
      multipleOf,
      value
    },
    reference
  }
}

export function operationMethodShouldNotHaveBody (reference: string, method: string): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'OPRBDY',
    message: 'Including a request body with a ' + method.toUpperCase() + ' request is against the REST specification. Additionally, some of your network infrastructure may not support a body in this method',
    metadata: {
      method
    },
    reference
  }
}

export function operationIdMustBeUnique (reference: string, operationId: string, conflicts: any[]): ExceptionMessageData {
  return {
    get active (): boolean {
      return conflicts.length > 1
    },
    level: 'error',
    code: 'OPRIID',
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
    reference
  }
}

export function pathEndingsInconsistent (pathsWithTrailingSlash: string[], pathsWithoutTrailingSlash: string[]): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'PTHINC',
    message: 'Path endings are inconsistent. Some paths end with a slash and some do not.',
    metadata: {
      pathsWithTrailingSlash,
      pathsWithoutTrailingSlash
    },
    reference: ''
  }
}

export function pathMissingMethods (reference: string, path: string): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'NOMTHD',
    message: 'No methods defined for path: ' + path,
    metadata: {
      path
    },
    reference
  }
}

export function pathParameterMustBeRequired (reference: string, parameterName: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'PATREQ',
    message: 'Path parameters must be marked as required. Parameter: ' + parameterName,
    metadata: {
      parameterName
    },
    reference
  }
}

export function propertyNotAllowed (reference: string, propertyName: string, reason: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'DVPNAL',
    message: 'Property "' + propertyName + '" not allowed.' + (reason.length > 0 ? ' ' + reason : ''),
    metadata: {
      propertyName,
      reason
    },
    reference
  }
}

export function randomPasswordWarning (): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'DTRPAS',
    message: 'It may not be safe to use this random value as a password',
    metadata: {},
    reference: ''
  }
}

export function refInfiniteLoop (): ExceptionMessageData {
  return {
    message: 'Unresolvable infinite loop',
    code: 'REFPIL',
    level: 'error',
    metadata: {},
    reference: ''
  }
}

export function refInvalidStart (): ExceptionMessageData {
  return {
    message: 'References must start with #/',
    code: 'REFINS',
    level: 'error',
    metadata: {},
    reference: ''
  }
}

export function refNotResolved (ref: string, from: string): ExceptionMessageData {
  return {
    message: 'Cannot resolve reference "' + ref + '" from "' + from + '"',
    code: 'REFTNF',
    level: 'error',
    metadata: { ref, from },
    reference: ''
  }
}

export function responseBodyNotAllowed (type: 'schema' | 'content'): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'RESNBD',
    message: 'A 204 response must not contain a body but this response has a defined ' + type,
    metadata: {
      type
    },
    reference: ''
  }
}

export function responseRequired (reference: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'RESNOV',
    message: 'Responses object must define at least one response',
    metadata: {},
    reference
  }
}

export function responseShouldIncludeLocationHeader (): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'RESPHD',
    message: 'A 201 response for a POST request should return a location header and this is not documented in your OpenAPI document',
    metadata: {},
    reference: 'https://tools.ietf.org/html/rfc7231#section-4.3.3'
  }
}

export function responsesShouldIncludeSuccess (reference: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'RESNOS',
    message: 'Responses object should define at least one success (200 level) response or a default response',
    metadata: {},
    reference
  }
}

export function securityRequirementNotEmptyArray (reference: string, major: number): ExceptionMessageData {
  return {
    level: 'error',
    code: 'SSNEAR',
    message: 'Security requirement value must be an empty array unless associated security scheme type is ' +
      (major === 2 ? 'oauth2' : 'either oauth2 or openIdConnect'),
    metadata: {},
    reference
  }
}

export function securitySchemeMissingReference (reference: string, major: number): ExceptionMessageData {
  return {
    level: 'error',
    code: 'SSNAME',
    message: 'Security scheme name must have an associated reference at ' +
      (major === 2 ? 'Swagger > SecurityDefinitions' : 'OpenAPI > Components > SecuritySchemes'),
    metadata: {},
    reference
  }
}

export function securitySchemeNotUrl (reference: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'SSOURL',
    message: 'Value must be a URL',
    metadata: {},
    reference
  }
}

export function swaggerBasePathInvalid (reference: string, basePath: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'SWGBPT',
    message: 'The base path must start with a forward slash: ' + basePath,
    metadata: {
      basePath
    },
    reference
  }
}

export function swaggerBasePathTemplating (reference: string, basePath: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'SWGBPT',
    message: 'The base path does not support path templating: ' + basePath,
    metadata: {
      basePath
    },
    reference
  }
}

export function swaggerHostDoesNotSupportPathTemplating (reference: string, host: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'SWGHPT',
    message: 'The host does not support path templating: ' + host,
    metadata: {
      host
    },
    reference
  }
}

export function swaggerHostHasScheme (reference: string, host: string, scheme: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'SWGHPR',
    message: 'The host must not include the scheme: ' + scheme,
    metadata: {
      host,
      scheme
    },
    reference
  }
}

export function swaggerHostHasSubPath (reference: string, host: string, subPath: string): ExceptionMessageData {
  return {
    level: 'error',
    code: 'SWGHBP',
    message: 'The host must not include sub path: ' + subPath,
    metadata: {
      host,
      subPath
    },
    reference
  }
}

export function unknownTypeFormat (type: string, format: string): ExceptionMessageData {
  return {
    level: 'warn',
    code: 'SWGHBP',
    message: 'Non-standard format "' + format + '" used for type "' + type + '"',
    metadata: {
      format,
      type
    },
    reference: ''
  }
}
