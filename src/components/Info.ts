import * as Contact from './Contact'
import * as License from './License'
import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: Contact.Definition
  license?: License.Definition
  version: string
}

export interface Object {
  [extension: string]: any
  readonly title: string
  readonly description?: string
  readonly termsOfService?: string
  readonly contact?: Contact.Object
  readonly license?: License.Object
  readonly version: string
}

export function Factory (): FactoryResult<Definition, Object> {
  class Info extends EnforcerComponent<Definition, Object> implements Object {
    readonly title!: string
    readonly description?: string
    readonly termsOfService?: string
    readonly contact?: Contact.Object
    readonly license?: License.Object
    readonly version!: string

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Info,
    validator: function (data): SchemaObject {
      const { components } = data
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        required: () => ['title', 'version'],
        properties: [
          {
            name: 'title',
            schema: { type: 'string' }
          },
          {
            name: 'description',
            schema: { type: 'string' }
          },
          {
            name: 'termsOfService',
            schema: { type: 'string' }
          },
          {
            name: 'contact',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Contact
            }
          },
          {
            name: 'license',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.License
            }
          },
          {
            name: 'version',
            schema: { type: 'string' }
          }
        ]
      }
    }
  }
}
