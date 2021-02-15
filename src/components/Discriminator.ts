import * as Schema from './Schema'
import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

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

export function Factory (): FactoryResult<Definition, Object> {
  class Discriminator extends EnforcerComponent<Definition, Object> implements Object {
    readonly propertyName: string
    readonly mapping: {
      readonly [key: string]: Schema.Object3
    }

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Discriminator,
    validator: function (data): SchemaObject {
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
  }
}
