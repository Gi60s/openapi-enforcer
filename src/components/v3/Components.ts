import {
  OASComponent,
  Dereferenced,
  Referencable,
  Version,
  DefinitionException,
  ComponentSchema
} from '../index'
import { Callback } from './Callback'
import { Example } from './Example'
import { Header } from './Header'
import { Link } from './Link'
import { Parameter } from './Parameter'
import { RequestBody } from './RequestBody'
import { Response } from './Response'
import { Schema } from './Schema'
import { SecurityScheme } from './SecurityScheme'
import { Components3 as Definition } from '../helpers/DefinitionTypes'

let schemaComponent: ComponentSchema<Definition>

export class Components<HasReference=Dereferenced> extends OASComponent {
  extensions!: Record<string, any>
  callbacks?: Record<string, Referencable<HasReference, Callback>>
  examples?: Record<string, Referencable<HasReference, Example>>
  headers?: Record<string, Referencable<HasReference, Header<HasReference>>>
  links?: Record<string, Referencable<HasReference, Link>>
  parameters?: Record<string, Referencable<HasReference, Parameter<HasReference>>>
  requestBodies?: Record<string, Referencable<HasReference, RequestBody>>
  responses?: Record<string, Referencable<HasReference, Response<HasReference>>>
  schemas?: Record<string, Referencable<HasReference, Schema>>
  securitySchemes?: Record<string, Referencable<HasReference, SecurityScheme>>

  constructor (definition: Definition, version?: Version) {
    super(Components, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#components-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#components-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#components-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#components-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    if (schemaComponent === undefined) {
      schemaComponent = {
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'callbacks',
            schema: {
              type: 'object',
              allowsSchemaExtensions: true,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Callback
                }
              }
            }
          }, {
            name: 'examples',
            schema: {
              type: 'object',
              allowsSchemaExtensions: true,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Example
                }
              }
            }
          }, {
            name: 'headers',
            schema: {
              type: 'object',
              allowsSchemaExtensions: true,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Header
                }
              }
            }
          }, {
            name: 'links',
            schema: {
              type: 'object',
              allowsSchemaExtensions: true,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Link
                }
              }
            }
          }, {
            name: 'parameters',
            schema: {
              type: 'object',
              allowsSchemaExtensions: true,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Parameter
                }
              }
            }
          }, {
            name: 'requestBodies',
            schema: {
              type: 'object',
              allowsSchemaExtensions: true,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: RequestBody
                }
              }
            }
          }, {
            name: 'responses',
            schema: {
              type: 'object',
              allowsSchemaExtensions: true,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Response
                }
              }
            }
          }, {
            name: 'schemas',
            schema: {
              type: 'object',
              allowsSchemaExtensions: true,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: Schema
                }
              }
            }
          }, {
            name: 'securitySchemes',
            schema: {
              type: 'object',
              allowsSchemaExtensions: true,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: true,
                  component: SecurityScheme
                }
              }
            }
          }
        ],

        validator: {
          // TODO: put this after function into the Swagger security definitions too
          // https://spec.openapis.org/oas/v2.0#security-requirement-object
          after (data) {
            const { metadata } = data.root
            const { definition } = data.context
            const { securitySchemes } = definition

            if (typeof securitySchemes === 'object' && securitySchemes !== null) {
              Object.keys(securitySchemes).forEach((key: string) => {
                metadata.securitySchemes[key] = data.context.children.securitySchemes.context.children[key]
              })
            }
          }
        }
      }
    }
    return schemaComponent
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
