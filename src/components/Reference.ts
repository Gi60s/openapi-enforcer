import { SchemaObject } from '../definition-validator'
import { AnyComponent, EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  $ref: string
}

export interface Object<Component=AnyComponent> {
  $ref: string
  component: Component
}

export function Factory (): FactoryResult<Definition, Object> {
  class ReferenceObject extends EnforcerComponent<Definition, Object> implements Object {
    readonly $ref: string
    readonly component: AnyComponent

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: ReferenceObject,
    validator: function (data): SchemaObject {
      return {
        type: 'object',
        allowsSchemaExtensions: false,
        properties: [
          {
            name: '$ref',
            schema: {
              type: 'string'
            }
          }
        ]
      }
    }
  }
}
