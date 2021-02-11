import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  name: string
  url?: string
}

export interface Object {
  [extension: string]: any
  readonly name: string
  readonly url?: string
}

export function Factory (): FactoryResult<Definition, Object> {
  class License extends EnforcerComponent<Definition, Object> implements Object {
    readonly name!: string
    readonly url?: string

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: License,
    validator: function (): SchemaObject {
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        required: () => ['name'],
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
