import { ComponentDefinition } from '../component-registry'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics } from './'
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

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v2.0#operation-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#operation-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#operation-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#operation-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#operation-object'
})

export const Component = class Operation extends EnforcerComponent<Definition, Object> implements Object {
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

export function validator (data: Data<Definition, Object>): SchemaObject {
  const { components, options, key: method } = data

  return {
    type: 'object',
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'callbacks',
        versions: ['3.x.x'],
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: Callback.Component
          }
        }
      },
      {
        name: 'consumes',
        versions: ['2.x'],
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
          allowsRef: false,
          component: ExternalDocumentation.Component
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
            allowsRef: true,
            component: Parameter.Component
          }
        }
      },
      {
        name: 'produces',
        versions: ['2.x'],
        schema: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      {
        name: 'requestBody',
        versions: ['3.x.x'],
        schema: {
          type: 'component',
          allowsRef: true,
          before: ({ exception }) => {
            switch (method.toLowerCase()) {
              case 'get':
                exception.message('OPRBDY', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET')
                break
              case 'delete':
                exception.message('OPRBDY', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE')
                break
              case 'trace':
                exception.message('OPRBDY', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE')
                break
            }
            return true
          },
          component: RequestBody.Component
        }
      },
      {
        name: 'responses',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Responses.Component
        }
      },
      {
        name: 'schemes',
        versions: ['2.x'],
        schema: {
          type: 'string',
          enum: () => ['http', 'https', 'ws', 'wss']
        }
      },
      {
        name: 'security',
        schema: {
          type: 'component',
          allowsRef: false,
          component: SecurityRequirement.Component
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

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}