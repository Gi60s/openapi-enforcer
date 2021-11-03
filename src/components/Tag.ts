import { OASComponent, Version, DefinitionException, ComponentSchema } from './'
import { ExternalDocumentation } from './ExternalDocumentation'
import { Tag as Definition } from './helpers/DefinitionTypes'

const schemaTag: ComponentSchema<Definition> = {
  allowsSchemaExtensions: true,
  properties: [
    {
      name: 'name',
      required: true,
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
        component: ExternalDocumentation
      }
    }
  ]
}

export class Tag extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly name!: string
  readonly description?: string
  readonly externalDocs?: ExternalDocumentation

  constructor (definition: Definition, version?: Version) {
    super(Tag, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#tag-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#tag-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#tag-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#tag-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#tag-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return schemaTag
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
