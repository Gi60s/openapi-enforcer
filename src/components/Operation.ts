import {
  OASComponent,
  Dereferenced,
  Data,
  Version,
  Exception,
  Referencable,
  ComponentSchema
} from './'
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
  [key: `x-${string}`]: any
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

export class Operation<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly callbacks?: Record<string, Referencable<HasReference, Callback.Callback>> // v3
  readonly consumes?: string[] // v2
  readonly deprecated?: boolean
  readonly description?: string
  readonly externalDocs?: ExternalDocumentation.ExternalDocumentation
  readonly operationId?: string
  readonly parameters?: Array<Parameter.Parameter<HasReference>>
  readonly produces?: string[] // v2
  readonly requestBody?: Referencable<HasReference, RequestBody.RequestBody> // v3
  readonly responses!: Responses.Responses
  readonly schemes?: string[] // v2
  readonly security?: SecurityRequirement.SecurityRequirement[]
  readonly servers?: Server.Server[] // v3
  readonly summary?: string
  readonly tags?: string[]

  constructor (definition: Definition, version?: Version) {
    super(Operation, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#operation-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#operation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#operation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#operation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#operation-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return {
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
            default: false
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
            type: 'string'
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
            enum: ['http', 'https', 'ws', 'wss']
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
            type: 'string'
          }
        },
        {
          name: 'tags',
          schema: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      ],
      builder: {
        after (data) {
          storeOperationDataInMetadataMap(data)
        }
      },
      validator: {
        before (data) {
          const success = true

          return success
        },
        after (data) {
          storeOperationDataInMetadataMap(data)

          const { definition, exception, key } = data.context
          const { reference } = data.component

          // check that if request body is specified that it is valid for the method
          if (definition.requestBody !== undefined) {
            const method = key.toLowerCase()
            if (method === 'get' || method === 'trace') {
              const operationMethodShouldNotHaveBody = E.operationMethodShouldNotHaveBody(method, {
                definition,
                locations: [{ node: definition, key: 'requestBody', type: 'key' }],
                reference: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/' + method.toUpperCase()
              })
              exception.at('requestBody').message(operationMethodShouldNotHaveBody)
            } else if (method === 'delete') {
              const operationMethodShouldNotHaveBody = E.operationMethodShouldNotHaveBody(method, {
                definition,
                locations: [{ node: definition, key: 'requestBody', type: 'key' }],
                reference: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE'
              })
              operationMethodShouldNotHaveBody.message = 'According to the REST specification it is not clear if the DELETE method should allow a body. Including a body here may cause problems.'
              exception.at('requestBody').message(operationMethodShouldNotHaveBody)
            }
          }

          // check that the summary length is valid
          if (definition.summary !== undefined) {
            if (definition.summary.length >= 120) {
              const exceedsSummaryLength = E.exceedsSummaryLength(definition.summary, {
                definition,
                locations: [{ node: definition, key: 'summary', type: 'value' }],
                reference
              })
              exception.message(exceedsSummaryLength)
            }
          }
        }
      }
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}

function storeOperationDataInMetadataMap (data: Data<Definition>): void {
  const { metadata } = data.root
  const { key } = data.context
  if (metadata.operationIdMap === undefined) metadata.operationIdMap = {}
  if (metadata.operationIdMap[key] === undefined) metadata.operationIdMap[key] = []
  metadata.operationIdMap[key].push(data)
}
