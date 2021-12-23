import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { OASComponent, componentValidate } from '../index'
import { ServerVariable } from './ServerVariable'
import { Server3 as Definition } from '../helpers/definition-types'

let schemaServer: ComponentSchema<Definition>

export class Server extends OASComponent {
  extensions!: Record<string, any>
  description?: string
  url!: string
  variables?: Record<string, ServerVariable>

  constructor (definition: Definition, version?: Version) {
    super(Server, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#server-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#server-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#server-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    if (schemaServer === undefined) {
      schemaServer = {
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'url',
            required: true,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'description',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'variables',
            schema: {
              type: 'object',
              allowsSchemaExtensions: false,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: false,
                  component: ServerVariable
                }
              }
            }
          }
        ]
      }
    }
    return schemaServer
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
