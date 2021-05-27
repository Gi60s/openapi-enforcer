import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { yes } from '../util'
import * as E from '../Exception/methods'
import * as Operation from './Operation'
import * as Parameter from './Parameter'
import * as Reference from './Reference'
import * as Server from './Server'

const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']

export interface Definition {
  [extension: string]: any
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

export class PathItem extends OASComponent {
  readonly [extension: string]: any
  delete?: Operation.Operation
  description?: string
  get?: Operation.Operation
  head?: Operation.Operation
  options?: Operation.Operation
  parameters?: Array<Parameter.Parameter | Reference.Reference>
  patch?: Operation.Operation
  put?: Operation.Operation
  post?: Operation.Operation
  trace?: Operation.Operation
  servers?: Server.Server[]
  summary?: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing PathItem object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#path-item-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#path-item-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#path-item-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#path-item-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#path-item-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      after ({ definition, exception, reference, key }, def) {
        const length = methods.length
        let hasMethod = false
        for (let i = 0; i < length; i++) {
          if (methods[i] in definition) {
            hasMethod = true
            break
          }
        }
        if (!hasMethod) exception.message(E.pathMissingMethods(def['x-enforcer'], reference, key))
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
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
