import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { OASComponent, componentValidate } from '../index'
import * as E from '../../DefinitionException/methods'
import { Server } from './Server'
import { Link3 as Definition } from '../helpers/definition-types'

let linkSchema: ComponentSchema<Definition>

export class Link extends OASComponent {
  extensions!: Record<string, any>
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: Record<string, string>
  requestBody?: any
  server?: Server

  constructor (definition: Definition, version?: Version) {
    super(Link, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#link-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#link-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#link-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#link-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    if (linkSchema === undefined) {
      linkSchema = {
        allowsSchemaExtensions: true,
        validator: {
          after (data) {
            const { built, definition, exception } = data.context
            const { reference } = data.component

            if (built.operationRef !== undefined && built.operationId !== undefined) {
              const linkOperationConflict = E.linkOperationConflict({
                definition,
                locations: [
                  { node: definition, key: 'operationRef', type: 'key' },
                  { node: definition, key: 'operationId', type: 'key' }
                ],
                reference
              })
              exception.message(linkOperationConflict)
            }
          }
        },
        properties: [
          {
            name: 'description',
            schema: { type: 'string' }
          },
          {
            name: 'operationRef',
            schema: { type: 'string' }
          },
          {
            name: 'operationId',
            schema: { type: 'string' }
          },
          {
            name: 'parameters',
            schema: {
              type: 'object',
              allowsSchemaExtensions: false,
              additionalProperties: {
                // Read about Runtime Expression Syntax at https://swagger.io/docs/specification/links/
                schema: {
                  type: 'string'
                }
              }
            }
          },
          {
            name: 'requestBody',
            schema: {
              type: 'object',
              allowsSchemaExtensions: false,
              additionalProperties: {
                // Read about Runtime Expression Syntax at https://swagger.io/docs/specification/links/
                schema: {
                  type: 'string'
                }
              }
            }
          },
          {
            name: 'server',
            schema: {
              type: 'component',
              allowsRef: false,
              component: Server
            }
          }
        ]
      }
    }
    return linkSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
