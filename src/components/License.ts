import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { yes } from '../util'

export interface Definition {
  [key: `x-${string}`]: any
  name: string
  url?: string
}

export class License extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly name!: string
  readonly url?: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', License, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#license-object',
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#license-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#license-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#license-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#license-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'name',
          required: yes,
          schema: { type: 'string' }
        },
        {
          name: 'url',
          schema: { type: 'string' }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
