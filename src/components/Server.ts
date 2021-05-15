import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { no, yes } from '../util'
import * as ServerVariable from './ServerVariable'

export interface Definition {
  [extension: string]: any
  description?: string
  url: string
  variables?: Record<string, ServerVariable.Definition>
}

export class Server extends OASComponent {
  readonly [extension: string]: any
  readonly description?: string
  readonly url!: string
  readonly variables?: Record<string, ServerVariable.ServerVariable>

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Server object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#server-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#server-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#server-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#server-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'url',
          required: yes,
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
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: false,
              component: ServerVariable.ServerVariable
            }
          }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
