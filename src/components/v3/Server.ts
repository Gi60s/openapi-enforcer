import { OASComponent, Version, Exception, ComponentSchema } from '../index'
import { ServerVariable } from './ServerVariable'
import { Server3 as Definition } from '../helpers/DefinitionTypes'

const schemaServer: ComponentSchema<Definition> = {
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
          type: 'component',
          allowsRef: false,
          component: ServerVariable
        }
      }
    }
  ]
}

export class Server extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly description?: string
  readonly url!: string
  readonly variables?: Record<string, ServerVariable>

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
    return schemaServer
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
