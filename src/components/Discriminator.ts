import { ComponentDefinition } from '../component-registry'
import * as Schema from './Schema'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  propertyName: string
  mapping: {
    [key: string]: string
  }
}

export interface Object {
  [extension: string]: any
  propertyName: string
  mapping: {
    [key: string]: Schema.Object3
  }
}

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#discriminator-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#discriminator-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#discriminator-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#discriminator-object'
})

export const Component = class Discriminator extends EnforcerComponent<Definition, Object> implements Object {
  readonly propertyName: string
  readonly mapping: {
    readonly [key: string]: Schema.Object3
  }

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  const { components } = data
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    required: () => ['propertyName'],
    properties: [
      {
        name: 'propertyName',
        schema: { type: 'string' }
      },
      {
        name: 'mapping',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: false,
            component: components.Schema,
            after () {
              // TODO: attempt lookup of mapping reference
            }
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