import { OASComponent, initializeData, SchemaObject, SpecMap, Exception, Version } from './'
import { lookupLocation } from '../loader'
import { addExceptionLocation, adjustExceptionLevel, yes } from '../util'
import * as E from '../Exception/methods'
import rx from '../rx'

export interface Definition {
  [extension: string]: any
  name?: string
  url?: string
  email?: string
}

export class Contact extends OASComponent {
  readonly [extension: string]: any
  readonly email?: string
  readonly name?: string
  readonly url?: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Contact object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#contact-object',
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#contact-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#contact-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#contact-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#contact-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'name',
          schema: { type: 'string' }
        },
        {
          name: 'url',
          schema: {
            type: 'string',
            after (data, def) {
              const { definition, exception, reference } = data
              if (!rx.url.test(definition)) {
                const invalidUrl = E.invalidUrl(reference, definition)
                adjustExceptionLevel(def, invalidUrl)
                addExceptionLocation(invalidUrl, lookupLocation(def, 'url', 'value'))
                exception.message(invalidUrl)
              }
            }
          }
        },
        {
          name: 'email',
          schema: {
            type: 'string',
            after (data, def) {
              const { definition, exception, reference } = data
              if (!rx.email.test(definition)) {
                const invalidEmail = E.invalidEmail(reference, definition)
                adjustExceptionLevel(def, invalidEmail)
                addExceptionLocation(invalidEmail, lookupLocation(def, 'email', 'value'))
                exception.message(invalidEmail)
              }
            }
          }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
