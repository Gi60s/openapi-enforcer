import { OASComponent, Data, Version, Exception, ComponentSchema } from './'
import { addExceptionLocation, yes } from '../util'
import rx from '../rx'
import * as E from '../Exception/methods'
import { lookupLocation } from '../loader'

export interface Definition {
  [key: `x-${string}`]: any
  description?: string
  url: string
}

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
  readonly [key: `x-${string}`]: any
  readonly description?: string
  readonly url!: string

  constructor (definition: Definition, version?: Version) {
    super(ExternalDocumentation, definition, version, arguments[2])
  }

  static = {
    '2.0': 'https://spec.openapis.org/oas/v3.0.0#external-documentation-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#external-documentation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#external-documentation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#external-documentation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#external-documentation-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return externalDocumentationSchema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
