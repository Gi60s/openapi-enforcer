import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { yes } from '../util'
import * as E from '../Exception/methods'

export interface Definition {
  [extension: string]: any
  enum?: string[]
  default: string
  description?: string
}

export class ServerVariable extends OASComponent {
  readonly [extension: string]: any
  readonly enum?: string[]
  readonly default!: string
  readonly description?: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing ServerVariable object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#server-variable-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#server-variable-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#server-variable-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#server-variable-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'enum',
          schema: {
            type: 'array',
            items: {
              type: 'string'
            },
            after (data) {
              const { built, exception } = data
              if (built.length === 0) {
                exception.message(E.enumMissingValues())
              }
            }
          }
        },
        {
          name: 'default',
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
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
