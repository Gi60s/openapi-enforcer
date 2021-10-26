import {
  Data,
  OASComponent,
  Dereferenced,
  Version,
  Exception,
  Referencable,
  ComponentSchema, ExtendedComponent
} from './'
import * as E from '../Exception/methods'
import * as Operation from './Operation'
import * as Parameter from './Parameter'
import * as Reference from './Reference'
import * as Server from './Server'

export const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']

export interface Definition {
  [key: `x-${string}`]: any
  delete?: Operation.Definition
  description?: string
  get?: Operation.Definition
  head?: Operation.Definition
  options?: Operation.Definition
  parameters?: Array<Parameter.Definition | Reference.Definition>
  patch?: Operation.Definition
  put?: Operation.Definition
  post?: Operation.Definition
  trace?: Operation.Definition
  servers?: Server.Definition[]
  summary?: string
}

export function schemaGenerator (Operation: ExtendedComponent, methods: string[], data: Data): ComponentSchema {
  return {
    allowsSchemaExtensions: true,
    validator: {
      after (data) {
        const {
          built,
          definition,
          exception,
          key
        } = data.context
        const { reference } = data.component

        const length = methods.length
        let hasMethod = false
        for (let i = 0; i < length; i++) {
          if (methods[i] in built) {
            hasMethod = true
            break
          }
        }
        if (!hasMethod) {
          const pathMissingMethods = E.pathMissingMethods(key, {
            definition,
            locations: [{ node: definition }],
            reference
          })
          exception.message(pathMissingMethods)
        }
      }
    },
    properties: [
      {
        name: 'parameters',
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: true,
            component: Parameter.Parameter
          }
        }
      },
      {
        name: 'delete',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation
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
          component: Operation
        }
      },
      {
        name: 'head',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation
        }
      },
      {
        name: 'options',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation
        }
      },
      {
        name: 'patch',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation
        }
      },
      {
        name: 'put',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation
        }
      },
      {
        name: 'post',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation
        }
      },
      {
        name: 'trace',
        versions: ['3.x.x'],
        schema: {
          type: 'component',
          allowsRef: false,
          component: Operation
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
            component: Server.Server
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

export class PathItem<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  delete?: Operation.Operation<HasReference>
  get?: Operation.Operation<HasReference>
  head?: Operation.Operation<HasReference>
  options?: Operation.Operation<HasReference>
  parameters?: Array<Referencable<HasReference, Parameter.Parameter<HasReference>>>
  patch?: Operation.Operation<HasReference>
  put?: Operation.Operation<HasReference>
  post?: Operation.Operation<HasReference>

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (Component: ExtendedComponent, definition: Definition, version?: Version, data?: Data) {
    super(Component, definition, version, data)
  }

  static validate (definition: Definition, version?: Version, data?: Data): Exception {
    return super.validate(definition, version, data)
  }
}
