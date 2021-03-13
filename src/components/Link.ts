import { ComponentDefinition } from '../component-registry'
import * as Server from './Server'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: { [key: string]: any } // TODO: update with Parameters.Definition
  requestBody?: any
  server?: Server.Definition
}

export interface Object {
  [extension: string]: any
  readonly description?: string
  readonly operationId?: string
  readonly operationRef?: string
  readonly parameters?: { [key: string]: any }
  readonly requestBody?: any
  readonly server?: Server.Object
}

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#link-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#link-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#link-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#link-object'
})

export const Component = class Link extends EnforcerComponent<Definition, Object> implements Object {
  readonly description?: string
  readonly operationId?: string
  readonly operationRef?: string
  readonly parameters?: { [key: string]: any }
  readonly requestBody?: any
  readonly server?: Server.Object

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    after ({ alert, built }) {
      if ('operationRef' in built && 'operationId' in built) {
        alert('error', 'LNK001', 'Must not define both operationId and operationRef')
      }
    },
    properties: [
      {
        name: 'description',
        schema: { type: 'string' }
      },
      {
        name: 'operationRef',
        schema: { type: 'string' }
      },
      {
        name: 'operationId',
        schema: { type: 'string' }
      },
      {
        name: 'parameters',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            // Read about Runtime Expression Syntax at https://swagger.io/docs/specification/links/
            type: 'string'
          }
        }
      },
      {
        name: 'requestBody',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            // Read about Runtime Expression Syntax at https://swagger.io/docs/specification/links/
            type: 'string'
          }
        }
      },
      {
        name: 'server',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Server.Component
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