import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { no, yes } from '../util'
import * as E from '../Exception/methods'
import * as Parameter from './Parameter'
import * as Server from './Server'

export interface Definition {
  [extension: string]: any
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: Record<string, Parameter.Definition>
  requestBody?: any
  server?: Server.Definition
}

export class Link extends OASComponent {
  readonly [extension: string]: any
  readonly description?: string
  readonly operationId?: string
  readonly operationRef?: string
  readonly parameters?: Record<string, string>
  readonly requestBody?: any
  readonly server?: Server.Server

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Link object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#link-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#link-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#link-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#link-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      after ({ built, exception, reference }) {
        if ('operationRef' in built && 'operationId' in built) {
          exception.message(E.linkOperationConflict(reference))
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
            allowsSchemaExtensions: no,
            additionalProperties: {
              // Read about Runtime Expression Syntax at https://swagger.io/docs/specification/links/
              type: 'string'
            },
            build (data) {
              // TODO: build a parameter object
            }
          }
        },
        {
          name: 'requestBody',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
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
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
