import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { yes } from '../util'

export interface Definition {
  [extension: string]: any
  description?: string
  url: string
}

export class ExternalDocumentation extends OASComponent {
  readonly [extension: string]: any
  readonly description?: string
  readonly url!: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing ExternalDocumentation object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v3.0.0#external-documentation-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#external-documentation-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#external-documentation-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#external-documentation-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#external-documentation-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'description',
          schema: { type: 'string' }
        },
        {
          name: 'url',
          required: yes,
          schema: { type: 'string' }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
