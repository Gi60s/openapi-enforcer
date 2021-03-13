import { ComponentDefinition } from '../component-registry'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'
import * as ServerVariable from './ServerVariable'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  description?: string
  url: string
  variables?: {
    [name: string]: ServerVariable.Definition
  }
}

export interface Object {
  [extension: string]: any
  readonly description?: string
  readonly url: string
  readonly variables?: {
    [name: string]: ServerVariable.Object
  }
}

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#server-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#server-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#server-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#server-object'
})

export const Component = class Server extends EnforcerComponent<Definition, Object> implements Object {
  readonly description?: string
  readonly url: string
  readonly variables?: {
    [name: string]: ServerVariable.Object
  }

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
        name: 'url',
        schema: {
          type: 'string'
        }
      },
      {
        name: 'description',
        schema: {
          type: 'string'
        }
      },
      {
        name: 'variables',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: false,
            component: ServerVariable.Component
          }
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
