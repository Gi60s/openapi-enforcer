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

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v2.0#header-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#header-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#header-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#header-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#header-object'
})

export const Component = class Header extends EnforcerComponent<Definition, Object> implements Object {
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
        name: 'style',
        versions: ['3.x.x'],
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

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}