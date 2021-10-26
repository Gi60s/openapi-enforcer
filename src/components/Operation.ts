import {
  OASComponent,
  Dereferenced,
  Data,
  Version,
  Exception,
  ComponentSchema, ExtendedComponent
} from './'
import * as E from '../Exception/methods'
import * as Callback from './v3/Callback'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Parameter from './Parameter'
import * as RequestBody from './RequestBody'
import * as Responses from './Responses'
import * as SecurityRequirement from './SecurityRequirement'
import * as Server from './Server'
import { Definition as Definition2 } from './v2/Operation'
import { Definition as Definition3 } from './v3/Operation'

export interface Definition {
  [key: `x-${string}`]: any
  deprecated?: boolean
  description?: string
  externalDocs?: ExternalDocumentation.Definition
  operationId?: string
  parameters?: Parameter.Definition[]
  responses: Responses.Definition
  security?: SecurityRequirement.Definition[]
  summary?: string
  tags?: string[]
}

export class Operation<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly deprecated?: boolean
  readonly description?: string
  readonly externalDocs?: ExternalDocumentation.ExternalDocumentation
  readonly operationId?: string
  readonly parameters?: Array<Parameter.Parameter<HasReference>>
  readonly responses!: Responses.Responses
  readonly security?: SecurityRequirement.SecurityRequirement[]
  readonly summary?: string
  readonly tags?: string[]

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (Component: ExtendedComponent, definition: Definition2 | Definition3, version?: Version, data?: Data) {
    super(Component, definition, version, data)
  }

  static schemaGenerator (): ComponentSchema<Definition2 | Definition3> {
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
          if ('requestBody' in definition) {
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

  static validate (definition: Definition, version?: Version, data?: Data): Exception {
    return super.validate(definition, version, data)
  }
}

function storeOperationDataInMetadataMap (data: Data<Definition>): void {
  const { metadata } = data.root
  const { key } = data.context
  if (metadata.operationIdMap === undefined) metadata.operationIdMap = {}
  if (metadata.operationIdMap[key] === undefined) metadata.operationIdMap[key] = []
  metadata.operationIdMap[key].push(data)
}
