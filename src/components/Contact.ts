import { componentValidate, OASComponent } from './index'
import { ComponentSchema, Version } from './helpers/builder-validator-types'
import { DefinitionException } from '../Exception'
import rx from '../utils/rx'
import { Contact as Definition } from './helpers/definition-types'

let contactSchema: ComponentSchema<Definition>

export class Contact extends OASComponent {
  extensions!: Record<string, any>
  email?: string
  name?: string
  url?: string

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

  static get schema (): ComponentSchema<Definition, typeof Contact> {
    if (contactSchema === undefined) {
      contactSchema = new ComponentSchema({
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
            const { email, url } = definition

            if (typeof url === 'string') {
              if (!rx.url.test(url)) {
                exception.at('url').add.invalidUrl(data, { key: 'url', type: 'value' }, url)
              }
            }

            if (typeof email === 'string') {
              if (!rx.email.test(email)) {
                exception.add.invalidEmail(data, { key: 'email', type: 'value' }, email)
              }
            }
          }
        }
      })
    }
    return contactSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
