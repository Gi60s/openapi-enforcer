import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { addExceptionLocation, yes } from '../util'
import rx from '../rx'
import * as E from '../Exception/methods'
import { lookupLocation } from '../loader'

export interface Definition {
  [key: `x-${string}`]: any
  description?: string
  url: string
}

export class ExternalDocumentation extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly description?: string
  readonly url!: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', ExternalDocumentation, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v3.0.0#external-documentation-object',
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#external-documentation-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#external-documentation-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#external-documentation-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#external-documentation-object'
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
          schema: {
            type: 'string',
            after ({ definition, exception, reference }, componentDef) {
              if (!rx.url.test(definition)) {
                const invalidUrl = E.invalidUrl(reference, definition)
                addExceptionLocation(invalidUrl, lookupLocation(componentDef, 'externalValue', 'value'))
                exception.message(invalidUrl)
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
