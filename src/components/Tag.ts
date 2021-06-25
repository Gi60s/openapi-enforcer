import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { yes } from '../util'
import * as ExternalDocumentation from './ExternalDocumentation'

export interface Definition {
  [key: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: ExternalDocumentation.Definition
}

export class Tag extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly name!: string
  readonly description?: string
  readonly externalDocs?: ExternalDocumentation.ExternalDocumentation

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', Tag, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#tag-object',
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#tag-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#tag-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#tag-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#tag-object'
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
          name: 'description',
          schema: { type: 'string' }
        },
        {
          name: 'externalDocs',
          schema: {
            type: 'component',
            allowsRef: false,
            component: ExternalDocumentation.ExternalDocumentation
          }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
