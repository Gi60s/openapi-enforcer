import { OASComponent, initializeData, Data, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { no, yes } from '../util'
import * as E from '../Exception/methods'
import * as Callback from './Callback'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Parameter from './Parameter'
import * as Reference from './Reference'
import * as RequestBody from './RequestBody'
import * as Responses from './Responses'
import * as SecurityRequirement from './SecurityRequirement'
import * as Server from './Server'

export interface Definition {
  [extension: string]: any
  callbacks?: Record<string, Callback.Definition | Reference.Definition> // v3
  consumes?: string[] // v2
  deprecated?: boolean
  description?: string
  externalDocs?: ExternalDocumentation.Definition
  operationId?: string
  parameters?: Parameter.Definition[]
  produces?: string[] // v2
  requestBody?: RequestBody.Definition | Reference.Definition // v3
  responses: Responses.Definition
  schemes?: string[] // v2
  security?: SecurityRequirement.Definition[]
  servers?: Server.Definition[] // v3
  summary?: string
  tags?: string[]
}

export class Operation extends OASComponent {
  readonly [extension: string]: any
  readonly callbacks?: Record<string, Callback.Callback | Reference.Reference> // v3
  readonly consumes?: string[] // v2
  readonly deprecated?: boolean
  readonly description?: string
  readonly externalDocs?: ExternalDocumentation.ExternalDocumentation
  readonly operationId?: string
  readonly parameters?: Parameter.Parameter[]
  readonly produces?: string[] // v2
  readonly requestBody?: RequestBody.RequestBody | Reference.Reference // v3
  readonly responses!: Responses.Responses
  readonly schemes?: string[] // v2
  readonly security?: SecurityRequirement.SecurityRequirement[]
  readonly servers?: Server.Server[] // v3
  readonly summary?: string
  readonly tags?: string[]

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Operation object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#operation-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#operation-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#operation-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#operation-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#operation-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'callbacks',
          versions: ['3.x.x'],
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Callback.Callback
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
            default: no
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
            component: ExternalDocumentation.ExternalDocumentation
          }
        },
        {
          name: 'operationId',
          schema: {
            type: 'string',
            after (data) {
              const { definition, exception, metadata } = data
              if (metadata.operationIdMap === undefined) metadata.operationIdMap = {}
              if (metadata.operationIdMap[definition] === undefined) metadata.operationIdMap[definition] = []
              metadata.operationIdMap[definition].push(data.component)

              // this exception method had a dynamic active property that will determine if this is an error or not
              exception.message(E.operationIdMustBeUnique(data.reference, definition, metadata.operationIdMap[definition]))
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
              component: Parameter.Parameter
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
            before: ({ component, exception }) => {
              const method = component.key
              switch (method.toLowerCase()) {
                case 'get':
                  exception.message(E.operationMethodShouldNotHaveBody('https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET', 'get'))
                  break
                case 'delete':
                  exception.message(E.operationMethodShouldNotHaveBody('https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE', 'delete'))
                  break
                case 'trace':
                  exception.message(E.operationMethodShouldNotHaveBody('https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE', 'trace'))
                  break
              }
              return true
            },
            component: RequestBody.RequestBody
          }
        },
        {
          name: 'responses',
          schema: {
            type: 'component',
            allowsRef: false,
            component: Responses.Responses
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
            component: SecurityRequirement.SecurityRequirement
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
          schema: {
            type: 'string',
            after ({ definition, exception, reference }) {
              if (definition.length >= 120) {
                exception.message(E.exceedsSummaryLength(reference, definition))
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

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
