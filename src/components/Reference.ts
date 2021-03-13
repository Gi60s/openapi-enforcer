import { ComponentDefinition } from '../component-registry'
import { Data, SchemaObject } from '../definition-validator'
import { AnyComponent, EnforcerComponent, Statics } from './'

export interface Class extends Statics<Definition, Object<AnyComponent>> {
  new (definition: Definition): Object<AnyComponent>
}

export interface Definition {
  $ref: string
}

export interface Object<Component> {
  $ref: string
}

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v2.0#reference-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#reference-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#reference-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#reference-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#reference-object'
})

export const Component = class ReferenceObject extends EnforcerComponent<Definition, Object<AnyComponent>> implements Object<AnyComponent> {
  readonly $ref: string

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: false,
    build ({ definition, component }) {
      const built = Object.create(component)
      built.$ref = (definition as Definition).$ref
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

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}
