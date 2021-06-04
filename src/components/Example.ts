import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import * as E from '../Exception/methods'
import { lookup } from '../loader'
import { addExceptionLocation } from '../util'

export interface Definition {
  [extension: string]: any
  description?: string
  externalValue?: string
  summary?: string
  value?: any
}

export class Example extends OASComponent {
  readonly [extension: string]: any
  readonly description?: string
  readonly externalValue?: string
  readonly summary?: string
  readonly value?: any

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Example object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v3.0.0#example-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#example-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#example-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#example-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#example-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: (data) => data.major === 3,
      after ({ built, exception, reference }, def) {
        if ('value' in built && 'externalValue' in built) {
          const exampleValueExternalConflict = E.exampleValueExternalConflict(reference)
          addExceptionLocation(exampleValueExternalConflict, lookup(def, 'value', 'key'), lookup(def, 'externalValue', 'key'))
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
          schema: { type: 'string' }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
