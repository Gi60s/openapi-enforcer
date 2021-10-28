import { OASComponent, ComponentSchema, Exception, Version } from './index'
import * as E from '../Exception/methods'
import rx from '../utils/rx'
import { Contact as Definition } from './helpers/DefinitionTypes'

const contactSchema: ComponentSchema<Definition> = {
  allowsSchemaExtensions: true,
  properties: [
    {
      name: 'name',
      schema: { type: 'string' }
    },
    {
      name: 'url',
      schema: {
        type: 'string'
      }
    },
    {
      name: 'email',
      schema: {
        type: 'string'
      }
    }
  ],
  validator: {
    after (data): void {
      const { exception, definition } = data.context
      const { reference } = data.component
      const { email, url } = definition

      if (typeof url === 'string') {
        if (!rx.url.test(url)) {
          const invalidUrl = E.invalidUrl(url, {
            definition,
            locations: [{ node: definition, key: 'url', type: 'value' }],
            reference
          })
          exception.at('url').message(invalidUrl)
        }
      }

      if (typeof email === 'string') {
        if (!rx.email.test(email)) {
          // TODO: working here - how does exception level adjustment work now?
          const invalidEmail = E.invalidEmail(email, {
            definition,
            locations: [{ node: definition, key: 'email', type: 'value' }],
            reference
          })
          exception.message(invalidEmail)
        }
      }
    }
  }
}

export class Contact extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly email?: string
  readonly name?: string
  readonly url?: string

  constructor (definition: Definition, version?: Version) {
    super(Contact, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#contact-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#contact-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#contact-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#contact-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#contact-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return contactSchema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
