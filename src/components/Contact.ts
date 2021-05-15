import { OASComponent, initializeData, SchemaObject, SpecMap, ValidateResult, Version } from './'
import { yes } from '../util'

export interface Definition {
  [extension: string]: any
  name?: string
  url?: string
  email?: string
}

export class Contact extends OASComponent {
  readonly [extension: string]: any
  readonly email?: string
  readonly name?: string
  readonly url?: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Contact object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#contact-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#contact-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#contact-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#contact-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#contact-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'name',
          schema: { type: 'string' }
        },
        {
          name: 'url',
          schema: { type: 'string' }
        },
        {
          name: 'email',
          schema: { type: 'string' }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
