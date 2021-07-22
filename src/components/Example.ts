import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import * as E from '../Exception/methods'
import { lookupLocation } from '../loader'
import { addExceptionLocation } from '../util'
import rx from '../rx'

export interface Definition {
  [key: `x-${string}`]: any
  description?: string
  externalValue?: string
  summary?: string
  value?: any
}

export class Example extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly description?: string
  readonly externalValue?: string
  readonly summary?: string
  readonly value?: any

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', Example, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      // there is an examples object in v2, but because it can be any value we're not handling it here
      // '2.0': 'https://spec.openapis.org/oas/v2.0#example-object',
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#example-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#example-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#example-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#example-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: (data) => data.major === 3,
      after ({ built, exception, reference }, def) {
        if ('value' in built && 'externalValue' in built) {
          const exampleValueExternalConflict = E.exampleValueExternalConflict(reference)
          addExceptionLocation(exampleValueExternalConflict, lookupLocation(def, 'value', 'key'), lookupLocation(def, 'externalValue', 'key'))
          exception.message(exampleValueExternalConflict)
        }
      },
      properties: [
        {
          name: 'summary',
          schema: { type: 'string' }
        },
        {
          name: 'description',
          schema: { type: 'string' }
        },
        {
          name: 'value',
          schema: {
            type: 'any'
          }
        },
        {
          name: 'externalValue',
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
