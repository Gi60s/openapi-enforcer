import * as MediaType from './MediaType'
import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics, v3 } from './'

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

export function Factory (): FactoryResult<Definition, Object> {
  class RequestBody extends EnforcerComponent<Definition, Object> implements Object {
    description?: string
    content: MediaType.Object
    required?: boolean

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    name: 'RequestBody',
    alertCodes: {},
    component: RequestBody,
    validator: function (data): SchemaObject {
      const { components } = data
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
                component: (components as v3).MediaType
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
  }
}
