import { ComponentDefinition } from '../component-registry'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface Object {
  [extension: string]: any
  readonly name?: string
  readonly namespace?: string
  readonly prefix?: string
  readonly attribute?: boolean
  readonly wrapped?: boolean
}

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v2.0#xml-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#xml-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#xml-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#xml-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#xml-object'
})

export const Component = class Xml extends EnforcerComponent<Definition, Object> implements Object {
  readonly name?: string
  readonly namespace?: string
  readonly prefix?: string
  readonly attribute?: boolean
  readonly wrapped?: boolean

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
        name: 'namespace',
        schema: { type: 'string' }
      },
      {
        name: 'prefix',
        schema: { type: 'string' }
      },
      {
        name: 'attribute',
        schema: { type: 'boolean' }
      },
      {
        name: 'wrapped',
        schema: { type: 'boolean' }
      }
    ]
  }
}

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}