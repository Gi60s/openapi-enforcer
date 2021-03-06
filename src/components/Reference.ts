import { SchemaObject } from '../definition-validator'
import { AnyComponent, EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object<AnyComponent>> {
  new (definition: Definition): Object<AnyComponent>
}

export interface Definition {
  $ref: string
}

export interface Object<Component> {
  $ref: string
  $component: Component
  [key: string]: any
}

export function Factory (): FactoryResult<Definition, Object<AnyComponent>> {
  class ReferenceObject extends EnforcerComponent<Definition, Object<AnyComponent>> implements Object<AnyComponent> {
    readonly $ref: string
    readonly $component: AnyComponent
    readonly [key: string]: any

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    name: 'Reference',
    alertCodes: {},
    component: ReferenceObject,
    validator: function (data): SchemaObject {
      return {
        type: 'object',
        allowsSchemaExtensions: false,
        build ({ definition }) {
          const component: AnyComponent = {} // TODO: actually lookup reference and get object
          const built = Object.create(component)
          built.$ref = (definition as Definition).$ref
          built.$component = component
          return built
        },
        required: () => ['$ref'],
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
