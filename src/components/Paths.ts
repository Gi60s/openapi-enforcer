import * as Validator from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'
import * as PathItem from './PathItem'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [pathOrExtension: string]: PathItem.Definition | any
}

export interface Object {
  [pathOrExtension: string]: PathItem.Object | any
}

export function Factory (): FactoryResult<Definition, Object> {
  class Paths extends EnforcerComponent<Definition, Object> implements Object {
    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  // TODO: validate that extensions are not validated against the PathItem component
  return {
    component: Paths,
    validator: function (data): Validator.SchemaObject {
      const { components } = data
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: components.PathItem,
          after (data) {
            // TODO: add path validation from https://github.com/byu-oit/openapi-enforcer/blob/master/src/enforcers/Paths.js
          }
        }
      }
    }
  }
}
