import { ComponentDefinition } from '../component-registry'
import * as Contact from './Contact'
import * as License from './License'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

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

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v2.0#info-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#info-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#info-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#info-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#info-object'
})

export const Component = class Info extends EnforcerComponent<Definition, Object> implements Object {
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

export function validator (data: Data<Definition, Object>): SchemaObject {
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
          component: Contact.Component
        }
      },
      {
        name: 'license',
        schema: {
          type: 'component',
          allowsRef: false,
          component: License.Component
        }
      },
      {
        name: 'version',
        schema: { type: 'string' }
      }
    ]
  }
}

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}