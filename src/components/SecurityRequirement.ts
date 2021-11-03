import { OASComponent, Version, DefinitionException, ComponentSchema } from './'
import * as E from '../DefinitionException/methods'
import { SecurityRequirement as Definition } from './helpers/DefinitionTypes'

const securityRequirementSchema: ComponentSchema<Definition> = {
  allowsSchemaExtensions: false,
  additionalProperties: {
    type: 'array',
    items: {
      type: 'string'
    }
  },
  validator: {
    after (data) {
      const { built, exception, definition, key } = data.context
      const { reference } = data.component
      const { major, metadata, lastly } = data.root

      lastly.push(() => {
        Object.keys(built).forEach(name => {
          // if no associated security scheme then produce an error
          const scheme = metadata.securitySchemes?.[key]?.context.built
          if (scheme === undefined) {
            const securitySchemeMissingReference = E.securitySchemeMissingReference(major, {
              definition,
              locations: [{ node: definition, key: name, type: 'value' }],
              reference
            })
            exception.message(securitySchemeMissingReference)

            // if security scheme is not oauth2 or openIdConnect then the value must be an empty array
          } else if (['oauth2', 'openIdConnect'].includes(scheme.type) && built[name].length > 0) {
            const securityRequirementNotEmptyArray = E.securityRequirementNotEmptyArray(major, {
              definition,
              locations: [{ node: definition, key: name, type: 'value' }],
              reference
            })
            exception.message(securityRequirementNotEmptyArray)
          }
        })
      })
    }
  }
}

export class SecurityRequirement extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly [name: string]: string[]

  constructor (definition: Definition, version?: Version) {
    super(SecurityRequirement, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#security-requirement-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-requirement-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-requirement-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-requirement-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-requirement-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return securityRequirementSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
