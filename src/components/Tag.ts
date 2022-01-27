import { OASComponent, componentValidate } from './'
import { ComponentSchema, Version } from './helpers/builder-validator-types'
import { DefinitionException } from '../DefinitionException'
import { ExternalDocumentation } from './ExternalDocumentation'
import { Tag as Definition } from './helpers/definition-types'

let tagSchema: ComponentSchema<Definition>

export class Tag extends OASComponent {
  extensions!: Record<string, any>
  name!: string
  description?: string
  externalDocs?: ExternalDocumentation

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

  static get schema (): ComponentSchema<Definition, typeof Tag> {
    if (tagSchema === undefined) {
      tagSchema = new ComponentSchema({
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
      })
    }
    return tagSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
