import { SchemaObject } from '../definition-validator'
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
  class Header extends EnforcerComponent<Definition, Object> implements Object {
    readonly name?: string
    readonly url?: string
    readonly email?: string

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Header,
    validator: function (data): SchemaObject {
      const { components } = data
      const major = components.major
      return {
        type: 'object',
        properties: [
          {
            name: 'style',
            allowed: () => major === '3',
            schema: {
              type: 'string',
              default: () => 'simple',
              enum: () => ['simple']
            }
          },
          {
            name: 'explode',
            schema: {
              type: 'boolean',
              default: () => false
            }
          },
          {
            name: 'required',
            schema: {
              type: 'boolean',
              default: () => false
            }
          }
        ]
      }
    }
  }
}
