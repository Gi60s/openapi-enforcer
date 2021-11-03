import { OASComponent, Version, DefinitionException, ComponentSchema } from '../index'
import * as E from '../../DefinitionException/methods'
import { ServerVariable3 as Definition } from '../helpers/DefinitionTypes'

export class ServerVariable extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly enum?: string[]
  readonly default!: string
  readonly description?: string

  constructor (definition: Definition, version?: Version) {
    super(ServerVariable, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#server-variable-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#server-variable-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#server-variable-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-variable-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return {
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
          const { built, definition, exception } = data.context

          if (built.enum !== undefined) {
            if (built.enum.length === 0) {
              const enumMissingValues = E.enumMissingValues({
                definition,
                locations: [{ node: definition, key: 'enum', type: 'value' }]
              })
              exception.message(enumMissingValues)
            }
          }
        }
      }
    }
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
