import { ComponentDefinition } from '../component-registry'
import * as MediaType from './MediaType'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  description?: string
  content: MediaType.Definition
  required?: boolean
}

export interface Object {
  [extension: string]: any
  description?: string
  content: MediaType.Object
  required?: boolean
}

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#request-body-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#request-body-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#request-body-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#request-body-object'
})

export const Component = class RequestBody extends EnforcerComponent<Definition, Object> implements Object {
  description?: string
  content: MediaType.Object
  required?: boolean

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    required: () => ['content'],
    properties: [
      {
        name: 'description',
        schema: { type: 'string' }
      },
      {
        name: 'content',
        schema: {
          type: 'object',
          allowsSchemaExtensions: true,
          additionalProperties: {
            type: 'component',
            allowsRef: false,
            component: MediaType.Component
          }
        }
      },
      {
        name: 'required',
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