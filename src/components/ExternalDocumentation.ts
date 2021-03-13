import { ComponentDefinition } from '../component-registry'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  description?: string
  url: string
}

export interface Object {
  [extension: string]: any
  readonly description?: string
  readonly url: string
}

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v3.0.0#external-documentation-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#external-documentation-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#external-documentation-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#external-documentation-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#external-documentation-object'
})

export const Component = class ExternalDocumentation extends EnforcerComponent<Definition, Object> implements Object {
  readonly description?: string
  readonly url!: string

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    required: () => ['url'],
    properties: [
      {
        name: 'description',
        schema: { type: 'string' }
      },
      {
        name: 'url',
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
