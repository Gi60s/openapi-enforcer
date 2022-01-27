import { OASComponent, componentValidate } from './'
import * as E from '../DefinitionException/methods'
import { ComponentSchema, Version } from './helpers/builder-validator-types'
import { SecurityRequirement as Definition } from './helpers/definition-types'
import { DefinitionException } from '../DefinitionException'

let securityRequirementSchema: ComponentSchema<Definition>

export class SecurityRequirement extends OASComponent {
  extensions!: Record<string, any>
  name!: {
    [name: string]: string[]
  }

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

  static get schema (): ComponentSchema<Definition> {
    if (securityRequirementSchema === undefined) {
      securityRequirementSchema = new ComponentSchema({
        allowsSchemaExtensions: false,
        additionalProperties: {
          namespace: 'name',
          schema: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        validator: {
          after (data) {
            const { built, exception, key } = data.context
            const { major, metadata, lastly } = data.root

            lastly.push(() => {
              Object.keys(built).forEach(name => {
                // if no associated security scheme then produce an error
                const scheme = metadata.securitySchemes?.[key]?.context.built
                if (scheme === undefined) {
                  const securitySchemeMissingReference = E.securitySchemeMissingReference(data, { key: name, type: 'value' }, major)
                  exception.message(securitySchemeMissingReference)

                  // if security scheme is not oauth2 or openIdConnect then the value must be an empty array
                } else if (['oauth2', 'openIdConnect'].includes(scheme.type) && built[name].length > 0) {
                  const securityRequirementNotEmptyArray = E.securityRequirementNotEmptyArray(data, { key: name, type: 'value' }, major)
                  exception.message(securityRequirementNotEmptyArray)
                }
              })
            })
          }
        }
      })
    }
    return securityRequirementSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
