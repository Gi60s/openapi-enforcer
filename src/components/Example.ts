import { ComponentDefinition } from '../component-registry'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  description?: string
  externalValue?: string
  summary?: string
  value?: any
}

export interface Object {
  [extension: string]: any
  readonly description?: string
  readonly externalValue?: string
  readonly summary?: string
  readonly value?: any
}

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v3.0.0#example-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#example-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#example-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#example-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#example-object'
})

export const Component = class Example extends EnforcerComponent<Definition, Object> implements Object {
  readonly description?: string
  readonly externalValue?: string
  readonly summary?: string
  readonly value?: any

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: data.version.major === 3,
    after ({ alert, built }) {
      if ('value' in built && 'externalValue' in built) {
        alert('error', 'EXM001', 'Cannot have both "externalValue" and "value" properties')
      }
    },
    properties: [
      {
        name: 'summary',
        schema: { type: 'string' }
      },
      {
        name: 'description',
        schema: { type: 'string' }
      },
      {
        name: 'value',
        schema: {
          type: 'any'
        }
      },
      {
        name: 'externalValue',
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