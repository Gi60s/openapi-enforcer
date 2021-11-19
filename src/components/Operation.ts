import {
  OASComponent,
  Data,
  Version,
  DefinitionException,
  ComponentSchema, ExtendedComponent, Dereferenced
} from './'
import * as E from '../DefinitionException/methods'
import { Callback } from './v3/Callback'
import { ExternalDocumentation } from './ExternalDocumentation'
import { RequestBody } from './v3/RequestBody'
import { Responses } from './Responses'
import { SecurityRequirement } from './SecurityRequirement'
import { Server } from './v3/Server'
import { Operation2 as Definition2, Operation3 as Definition3 } from './helpers/DefinitionTypes'

type Definition = Definition2 | Definition3

interface ComponentsMap {
  Parameter: ExtendedComponent
  Responses: ExtendedComponent
}

export function schemaGenerator (components: ComponentsMap): ComponentSchema<Definition> {
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
            schema: {
              type: 'component',
              allowsRef: true,
              component: Callback
            }
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
          component: ExternalDocumentation
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
            component: components.Parameter
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
          component: RequestBody
        }
      },
      {
        name: 'responses',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Responses
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
          component: SecurityRequirement
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
            component: Server
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Operation<HasReference=Dereferenced> extends OASComponent {
  extensions!: Record<string, any>
  deprecated?: boolean
  description?: string
  externalDocs?: ExternalDocumentation
  operationId?: string
  parameters?: any[] // overwritten by inheriting classes: Parameter.Parameter<HasReference>
  responses!: Responses
  security?: SecurityRequirement[]
  summary?: string
  tags?: string[]

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (Component: ExtendedComponent, definition: Definition2 | Definition3, version?: Version, data?: Data) {
    super(Component, definition, version, data)
  }

  static validate (definition: Definition, version?: Version, data?: Data): DefinitionException {
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
