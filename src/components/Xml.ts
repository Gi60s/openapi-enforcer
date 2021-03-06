import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface Object {
  [extension: string]: any
  readonly name?: string
  readonly namespace?: string
  readonly prefix?: string
  readonly attribute?: boolean
  readonly wrapped?: boolean
}

export function Factory (): FactoryResult<Definition, Object> {
  class Xml extends EnforcerComponent<Definition, Object> implements Object {
    readonly name?: string
    readonly namespace?: string
    readonly prefix?: string
    readonly attribute?: boolean
    readonly wrapped?: boolean

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    name: 'Xml',
    alertCodes: {},
    component: Xml,
    validator: function (): SchemaObject {
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'name',
            schema: { type: 'string' }
          },
          {
            name: 'namespace',
            schema: { type: 'string' }
          },
          {
            name: 'prefix',
            schema: { type: 'string' }
          },
          {
            name: 'attribute',
            schema: { type: 'boolean' }
          },
          {
            name: 'wrapped',
            schema: { type: 'boolean' }
          }
        ]
      }
    }
  }
}
