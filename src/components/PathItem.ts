import {
  OASComponent,
  Dereferenced,
  Version,
  Exception,
  Referencable,
  ComponentSchema
} from './'
import * as E from '../Exception/methods'
import * as Operation from './Operation'
import * as Parameter from './Parameter'
import * as Reference from './Reference'
import * as Server from './Server'

const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']

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

const schemaPathItem: ComponentSchema<Definition> = {
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
        component: Operation.Operation
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
        component: Operation.Operation
      }
    },
    {
      name: 'head',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation.Operation
      }
    },
    {
      name: 'options',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation.Operation
      }
    },
    {
      name: 'patch',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation.Operation
      }
    },
    {
      name: 'put',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation.Operation
      }
    },
    {
      name: 'post',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation.Operation
      }
    },
    {
      name: 'trace',
      versions: ['3.x.x'],
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation.Operation
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

export class PathItem<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  delete?: Operation.Operation<HasReference>
  description?: string
  get?: Operation.Operation<HasReference>
  head?: Operation.Operation<HasReference>
  options?: Operation.Operation<HasReference>
  parameters?: Array<Referencable<HasReference, Parameter.Parameter<HasReference>>>
  patch?: Operation.Operation<HasReference>
  put?: Operation.Operation<HasReference>
  post?: Operation.Operation<HasReference>
  trace?: Operation.Operation<HasReference>
  servers?: Server.Server[]
  summary?: string

  constructor (definition: Definition, version?: Version) {
    super(PathItem, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#path-item-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#path-item-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#path-item-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#path-item-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#path-item-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return schemaPathItem
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
