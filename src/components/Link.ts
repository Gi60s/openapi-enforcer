import { OASComponent, Version, Exception, ComponentSchema } from './'
import * as E from '../Exception/methods'
import * as Parameter from './Parameter'
import * as Server from './Server'

export interface Definition {
  [key: `x-${string}`]: any
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: Record<string, Parameter.Definition>
  requestBody?: any
  server?: Server.Definition
}

const linkSchema: ComponentSchema<Definition> = {
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
          type: 'string'
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
          type: 'string'
        }
      }
    },
    {
      name: 'server',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Server.Server
      }
    }
  ]
}

export class Link extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly description?: string
  readonly operationId?: string
  readonly operationRef?: string
  readonly parameters?: Record<string, string>
  readonly requestBody?: any
  readonly server?: Server.Server

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
    return linkSchema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}