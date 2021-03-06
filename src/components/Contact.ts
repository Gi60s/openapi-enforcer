import * as Validator from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  name?: string
  url?: string
  email?: string
}

export interface Object {
  [extension: string]: any
  readonly name?: string
  readonly url?: string
  readonly email?: string
}

export function Factory (): FactoryResult<Definition, Object> {
  class Contact extends EnforcerComponent<Definition, Object> implements Object {
    readonly name?: string
    readonly url?: string
    readonly email?: string

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    name: 'Contact',
    alertCodes: {},
    component: Contact,
    validator: function (): Validator.SchemaObject {
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'name',
            schema: { type: 'string' }
          },
          {
            name: 'url',
            schema: { type: 'string' }
          },
          {
            name: 'email',
            schema: { type: 'string' }
          }
        ]
      }
    }
  }
}
