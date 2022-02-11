import { componentValidate, OASComponent } from './index'
import { ComponentSchema, Version } from './helpers/builder-validator-types'
import { DefinitionException } from '../Exception'
import rx from '../utils/rx'
import { ExternalDocumentation as Definition } from './helpers/definition-types'

let externalDocumentationSchema: ComponentSchema<Definition>

export class ExternalDocumentation extends OASComponent {
  extensions!: Record<string, any>
  description?: string
  url!: string

  constructor (definition: Definition, version?: Version) {
    super(ExternalDocumentation, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v3.0.0#external-documentation-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#external-documentation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#external-documentation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#external-documentation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#external-documentation-object'
  }

  static get schema (): ComponentSchema<Definition, typeof ExternalDocumentation> {
    if (externalDocumentationSchema === undefined) {
      externalDocumentationSchema = new ComponentSchema({
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'description',
            schema: { type: 'string' }
          },
          {
            name: 'url',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        validator: {
          after (data) {
            const { built, exception } = data.context

            const url = built.url
            if (url !== undefined) {
              if (!rx.url.test(url)) {
                exception.add.invalidUrl(data, { key: 'url', type: 'value' }, url)
              }
            }
          }
        }
      })
    }
    return externalDocumentationSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
