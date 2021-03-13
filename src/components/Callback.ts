import { ComponentDefinition } from '../component-registry'
import { EnforcerComponent, Statics } from './'
import * as PathItem from './PathItem'
import { Data, SchemaObject } from '../definition-validator'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: PathItem.Definition | any
}

export interface Object {
  [extension: string]: PathItem.Object | any
}

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#callback-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#callback-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#callback-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#callback-object'
})

export const Component = class Callback extends EnforcerComponent<Definition, Object> implements Object {
  readonly [extension: string]: PathItem.Object | any

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    additionalProperties: {
      type: 'component',
      allowsRef: false,
      component: PathItem.Component
    }
  }
}

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}