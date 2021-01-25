import * as Validator from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics, v2, v3 } from './'
import * as Callback from './Callback'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Parameter from './Parameter'
import * as RequestBody from './RequestBody'
import * as Responses from './Responses'
import * as SecurityRequirement from './SecurityRequirement'
import * as Server from './Server'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  callbacks?: { // v3
    [key: string]: Callback.Definition
  }
  consumes?: string[] // v2
  deprecated?: boolean
  description?: string
  externalDocs?: ExternalDocumentation.Definition
  operationId?: string
  parameters?: Parameter.Definition[]
  produces?: string[] // v2
  requestBody?: RequestBody.Definition // v3
  responses: Responses.Definition
  schemes?: string[] // v2
  security?: SecurityRequirement.Definition[]
  servers?: Server.Definition[] // v3
  summary?: string
  tags?: string[]
}

export interface Object {
  [extension: string]: any
  callbacks?: { // v3
    [key: string]: Callback.Object
  }
  consumes?: string[] // v2
  deprecated?: boolean
  description?: string
  externalDocs?: ExternalDocumentation.Object
  operationId?: string
  parameters?: Parameter.Object[]
  produces?: string[] // v2
  requestBody?: RequestBody.Object // v3
  responses: Responses.Object
  schemes?: string[] // v2
  security?: SecurityRequirement.Object[]
  servers?: Server.Object[] // v3
  summary?: string
  tags?: string[]
}

export function Factory (): FactoryResult<Definition, Object> {
  class Operation extends EnforcerComponent<Definition, Object> implements Object {
    readonly callbacks?: { [key: string]: Callback.Object } // v3
    readonly consumes?: string[] // v2
    readonly deprecated?: boolean
    readonly description?: string
    readonly externalDocs?: ExternalDocumentation.Object
    readonly operationId?: string
    readonly parameters?: Parameter.Object[]
    readonly produces?: string[] // v2
    readonly requestBody?: RequestBody.Object // v3
    readonly responses: Responses.Object
    readonly schemes?: string[] // v2
    readonly security?: SecurityRequirement.Object[]
    readonly servers?: Server.Object[] // v3
    readonly summary?: string
    readonly tags?: string[]

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: Operation,
    validator: function (data): Validator.SchemaObject {
      const { components, options, key } = data
      const { major } = components
      const V3 = major === '3'
      function isV2 (): boolean { return !V3 }
      function isV3 (): boolean { return V3 }

      return {
        type: 'object',
        properties: [
          {
            name: 'callbacks',
            allowed: isV3,
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: (components as v3).Callback
              }
            }
          },
          {
            name: 'consumes',
            allowed: isV2,
            schema: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },
          {
            name: 'deprecated',
            schema: {
              type: 'boolean',
              default: () => false
            }
          },
          {
            name: 'description',
            schema: { type: 'string' }
          },
          {
            name: 'externalDocs',
            schema: {
              type: 'component',
              component: components.ExternalDocumentation
            }
          },
          {
            name: 'operationId',
            schema: {
              type: 'string',
              after ({ alert, definition, metadata }) {
                if (metadata.operationIdMap === undefined) metadata.operationIdMap = {}
                if (metadata.operationIdMap[definition] !== undefined) {
                  alert('error', 'OPR001', 'The operationId must be unique.')
                } else {
                  metadata.operationIdMap[definition] = data
                }
              }
            }
          },
          {
            name: 'parameters',
            schema: {
              type: 'array',
              items: {
                type: 'component',
                component: components.Parameter
              }
            }
          },
          {
            name: 'produces',
            allowed: isV2,
            schema: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },
          {
            name: 'requestBody',
            allowed: isV3,
            schema: {
              type: 'component',
              before: ({ alert }) => {
                // TODO: test that I'm getting the correct key here
                // @ts-expect-error
                if (options.requestBodyAllowedMethods[key] !== true) {
                  alert('error', 'OPR002', 'Request body is not allowed for method: ' + key)
                  return false
                }
                return true
              },
              component: (components as v3).RequestBody
            }
          },
          {
            name: 'responses',
            schema: {
              type: 'component',
              component: components.Responses
            }
          },
          {
            name: 'schemes',
            allowed: isV2,
            schema: {
              type: 'string',
              enum: () => ['http', 'https', 'ws', 'wss']
            }
          },
          {
            name: 'security',
            schema: {
              type: 'component',
              component: components.SecurityRequirement
            }
          },
          {
            name: 'servers',
            allowed: isV3,
            schema: {
              type: 'array',
              items: {
                type: 'component',
                component: (components as v3).Server
              }
            }
          },
          {
            name: 'summary',
            schema: {
              type: 'string',
              after ({ alert, definition }) {
                if (definition.length >= 120) {
                  alert('warn', 'OPR003', 'Summary should be less than 120 characters.')
                }
              }
            }
          },
          {
            name: 'tags',
            schema: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        ]
      }
    }
  }
}
