import { ComponentDefinition } from '../component-registry'
import * as Operation from './Operation'
import * as Parameter from './Parameter'
import * as Server from './Server'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'

const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']

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

export const versions = {
  '2.0': 'http://spec.openapis.org/oas/v2.0#path-item-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#path-item-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#path-item-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#path-item-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#path-item-object'
}

export const Component = class PathItem extends EnforcerComponent<Definition, Object> implements Object {
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

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    after ({ definition, exception }) {
      const length = methods.length
      let hasMethod = false
      for (let i = 0; i < length; i++) {
        if (methods[i] in definition) {
          hasMethod = true
          break
        }
      }
      if (!hasMethod) exception.message('NOMTHD')
    },
    properties: [
      {
        name: 'parameters',
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: true,
            component: Parameter.Component
          }
        }
      },
      {
        name: 'delete',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation.Component
        }
      },
      {
        name: 'description',
        versions: ['3.x.x'],
        schema: {
          type: 'string'
        }
      },
      {
        name: 'get',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation.Component
        }
      },
      {
        name: 'head',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation.Component
        }
      },
      {
        name: 'options',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation.Component
        }
      },
      {
        name: 'patch',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation.Component
        }
      },
      {
        name: 'put',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation.Component
        }
      },
      {
        name: 'post',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation.Component
        }
      },
      {
        name: 'trace',
        versions: ['3.x.x'],
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation.Component
        }
      },
      {
        name: 'servers',
        versions: ['3.x.x'],
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: false,
            component: Server.Component
          }
        }
      },
      {
        name: 'summary',
        versions: ['3.x.x'],
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