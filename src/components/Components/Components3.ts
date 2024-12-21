import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import { OASComponent, componentValidate } from '../index'
import { Callback } from '../v3/Callback'
import { Example } from '../v3/Example'
import { Header } from './Header'
import { Link } from '../v3/Link'
import { Parameter } from '../v3/Parameter'
import { RequestBody } from '../v3/RequestBody'
import { Response } from '../v3/Response'
import { Schema } from '../v3/Schema'
import { SecurityScheme } from '../v3/SecurityScheme'
import { Components3 as Definition } from '../helpers/definition-types'
import { IComponents3 } from './IComponents'

let schemaComponent: ComponentSchema<Definition>

export class Components extends OASComponent implements IComponents3 {
  extensions!: Record<string, any>
  callbacks?: Record<string, Callback>
  examples?: Record<string, Example>
  headers?: Record<string, Header>
  links?: Record<string, Link>
  parameters?: Record<string, Parameter>
  requestBodies?: Record<string, RequestBody>
  responses?: Record<string, Response>
  schemas?: Record<string, Schema>
  securitySchemes?: Record<string, SecurityScheme>

  constructor (definition: Definition, version?: Version) {
    super(Components, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#components-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#components-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#components-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#components-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (schemaComponent === undefined) {
      schemaComponent = new ComponentSchema<Definition>({
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
      })
    }
    return schemaComponent
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
