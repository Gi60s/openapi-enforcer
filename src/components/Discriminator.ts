import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import * as Schema from './Schema'
import { no, yes } from '../util'

export interface Definition {
  [extension: string]: any
  propertyName: string
  mapping?: Record<string, string>
}

export class Discriminator extends OASComponent {
  readonly [extension: string]: any
  readonly propertyName!: string
  readonly mapping?: Record<string, Schema.Schema>

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Discriminator object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#discriminator-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#discriminator-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#discriminator-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#discriminator-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'propertyName',
          required: () => true,
          schema: { type: 'string' }
        },
        {
          name: 'mapping',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: false,
              component: Schema.Schema,
              after () {
                // TODO: attempt lookup of mapping reference
              }
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
