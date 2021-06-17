import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { addExceptionLocation, adjustExceptionLevel, no } from '../util'
import { OpenAPI } from './OpenAPI'
import { Swagger } from './Swagger'
import * as E from '../Exception/methods'
import { lookupLocation } from '../loader'

export interface Definition {
  [name: string]: string[]
}

export class SecurityRequirement extends OASComponent {
  [name: string]: string[] | any

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing SecurityRequirement object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#security-requirement-object',
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-requirement-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-requirement-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-requirement-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-requirement-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: no,
      additionalProperties: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      after (data, def) {
        const { built, exception, definition, key, metadata, root, major } = data

        const rootComponent = root.component
        if (rootComponent instanceof OpenAPI || rootComponent instanceof Swagger) {
          rootComponent.on('after-validate', () => {
            Object.keys(built).forEach(name => {
              // if no associated security scheme then produce an error
              const scheme = metadata.securitySchemes?.[key]?.built
              if (scheme === undefined) {
                const securitySchemeMissingReference = E.securitySchemeMissingReference(data.reference, major)
                addExceptionLocation(securitySchemeMissingReference, lookupLocation(definition, name, 'value'))
                exception.message(securitySchemeMissingReference)

                // if security scheme is not oauth2 or openIdConnect then the value must be an empty array
              } else if (['oauth2', 'openIdConnect'].includes(scheme.type) && built[name].length > 0) {
                const securityRequirementNotEmptyArray = E.securityRequirementNotEmptyArray(data.reference, major)
                addExceptionLocation(securityRequirementNotEmptyArray, lookupLocation(definition, name, 'value'))
                exception.message(securityRequirementNotEmptyArray)
              }
            })
          })
        }
      }
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
