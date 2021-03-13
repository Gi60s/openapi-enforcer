import { ComponentDefinition } from '../component-registry'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

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

export const versions = {
  '2.0': 'http://spec.openapis.org/oas/v2.0#contact-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#contact-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#contact-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#contact-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#contact-object'
}

export const Component = class Contact extends EnforcerComponent<Definition, Object> implements Object {
  readonly name?: string
  readonly url?: string
  readonly email?: string

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
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

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}
