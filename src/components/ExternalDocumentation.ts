import { componentValidate, OASComponent } from './index'
import { ComponentSchema, Version } from './helpers/builder-validator-types'
import { DefinitionException } from '../DefinitionException'
import rx from '../utils/rx'
import * as E from '../DefinitionException/methods'
import { ExternalDocumentation as Definition } from './helpers/definition-types'

const externalDocumentationSchema: ComponentSchema<Definition> = {
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
      const { built, definition, exception } = data.context
      const { reference } = data.component

      const url = built.url
      if (url !== undefined) {
        if (!rx.url.test(url)) {
          const invalidUrl = E.invalidUrl(url, {
            definition: url,
            locations: [{ node: definition, key: 'url', type: 'value' }],
            reference
          })
          exception.message(invalidUrl)
        }
      }
    }
  }
}

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

  static schemaGenerator (): ComponentSchema<Definition> {
    return externalDocumentationSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
