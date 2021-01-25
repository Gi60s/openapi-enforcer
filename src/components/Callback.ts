import { EnforcerComponent, FactoryResult, Statics } from './'
import * as PathItem from './PathItem'
import { SchemaObject } from '../definition-validator'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: PathItem.Definition | any
}

export interface Object {
  [extension: string]: PathItem.Object | any
}

export function Factory (): FactoryResult<Definition, Object> {
  class Callback extends EnforcerComponent<Definition, Object> implements Object {
    readonly [extension: string]: PathItem.Object | any

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Callback,
    validator: function (data): SchemaObject {
      const { components } = data
      return {
        type: 'object',
        additionalProperties: {
          type: 'component',
          component: components.PathItem
        }
      }
    }
  }
}
