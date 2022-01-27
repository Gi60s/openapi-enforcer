import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { OASComponent, componentValidate } from '../index'
import * as E from '../../DefinitionException/methods'
import { ServerVariable3 as Definition } from '../helpers/definition-types'

let serverVariableSchema: ComponentSchema<Definition>

export class ServerVariable extends OASComponent {
  extensions!: Record<string, any>
  enum?: string[]
  default!: string
  description?: string

  constructor (definition: Definition, version?: Version) {
    super(ServerVariable, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#server-variable-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#server-variable-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#server-variable-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-variable-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (serverVariableSchema === undefined) {
      serverVariableSchema = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'enum',
            schema: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },
          {
            name: 'default',
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
          }
        ],
        validator: {
          after (data) {
            const { built, exception } = data.context

            if (built.enum !== undefined) {
              if (built.enum.length === 0) {
                const enumMissingValues = E.enumMissingValues(data, { key: 'enum', type: 'value' })
                exception.message(enumMissingValues)
              }
            }
          }
        }
      })
    }
    return serverVariableSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
