import * as Operation from './Operation'
import * as Parameter from './Parameter'
import * as Server from './Server'
import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics, v3 } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  delete?: Operation.Definition
  description?: string
  get?: Operation.Definition
  head?: Operation.Definition
  options?: Operation.Definition
  parameters: Parameter.Definition[]
  patch?: Operation.Definition
  put?: Operation.Definition
  post?: Operation.Definition
  trace?: Operation.Definition

  // TODO: update servers type
  servers?: Server.Definition[]
  summary?: string
}

export interface Object {
  readonly [extension: string]: any
  readonly delete?: Operation.Object
  readonly description?: string
  readonly get?: Operation.Object
  readonly head?: Operation.Object
  readonly options?: Operation.Object
  readonly parameters?: Parameter.Object[]
  readonly patch?: Operation.Object
  readonly post?: Operation.Object
  readonly put?: Operation.Object
  readonly trace?: Operation.Object
  readonly servers?: Server.Object[]
  readonly summary?: string
}

export function Factory (): FactoryResult<Definition, Object> {
  class PathItem extends EnforcerComponent<Definition, Object> implements Object {
    readonly delete?: Operation.Object
    readonly description?: string
    readonly get?: Operation.Object
    readonly head?: Operation.Object
    readonly options?: Operation.Object
    readonly parameters?: Parameter.Object[]
    readonly patch?: Operation.Object
    readonly post?: Operation.Object
    readonly put?: Operation.Object
    readonly trace?: Operation.Object
    readonly servers?: Server.Object[]
    readonly summary?: string

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    name: 'PathItem',
    alertCodes: {},
    component: PathItem,
    validator: function (data): SchemaObject {
      const { components } = data
      const major = components.major
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'parameters',
            schema: {
              type: 'array',
              items: {
                type: 'component',
                allowsRef: true,
                component: components.Parameter
              }
            }
          },
          {
            name: 'delete',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Operation
            }
          },
          {
            name: 'description',
            allowed: () => major === '3',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'get',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Operation
            }
          },
          {
            name: 'head',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Operation
            }
          },
          {
            name: 'options',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Operation
            }
          },
          {
            name: 'patch',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Operation
            }
          },
          {
            name: 'put',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Operation
            }
          },
          {
            name: 'post',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Operation
            }
          },
          {
            name: 'trace',
            allowed: () => major === '3',
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.Operation
            }
          },
          {
            name: 'servers',
            allowed: () => major === '3',
            schema: {
              type: 'array',
              items: {
                type: 'component',
                allowsRef: false,
                component: (components as v3).Server
              }
            }
          },
          {
            name: 'summary',
            allowed: () => major === '3',
            schema: {
              type: 'string'
            }
          }
        ]
      }
    }
  }
}
