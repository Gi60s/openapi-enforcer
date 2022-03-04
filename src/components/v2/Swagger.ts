import {
  OASComponent,
  LoaderOptions,
  loadRoot, componentValidate
} from '../index'
import { DefinitionException } from '../../Exception'
import { Result } from '../../utils/Result'
import rx from '../../utils/rx'
import { Definitions } from './Definitions'
import { ExternalDocumentation } from '../ExternalDocumentation'
import { Info } from '../Info'
import { Operation } from './Operation'
import { Parameter } from './Parameter'
import { Paths } from './Paths'
import { Response } from './Response'
import { SecurityScheme } from './SecurityScheme'
import { SecurityRequirement } from '../SecurityRequirement'
import { Tag } from '../Tag'
import { Swagger as Definition } from '../helpers/definition-types'
import { ComponentSchema, ValidatorData } from '../helpers/builder-validator-types'
import {
  SwaggerGetOperationResult,
  SwaggerMakeRequestInput,
  SwaggerMakeRequestOptions, SwaggerMakeRequestResult
} from '../helpers/function-interfaces'

const rxHostParts = /^(?:(https?|wss?):\/\/)?(.+?)(\/.+)?$/
const rxPathTemplating = /[{}]/

let swaggerSchema: ComponentSchema<Definition>

export class Swagger extends OASComponent<Definition, typeof Swagger> {
  extensions!: Record<string, any>
  basePath?: string
  consumes?: string[]
  definitions?: Definitions
  externalDocs?: ExternalDocumentation
  host?: string
  info!: Info
  parameters?: Record<string, Parameter>
  paths!: Paths
  produces?: string[]
  responses?: Record<string, Response>
  security?: SecurityRequirement[]
  securityDefinitions?: Record<string, SecurityScheme>
  schemes?: string[]
  swagger!: '2.0'
  tags?: Tag[]

  constructor (definition: Definition) {
    super(Swagger, definition, '2.0', arguments[2])
  }

  getOperation (method: string, path: string): Result<SwaggerGetOperationResult> {

  }

  getOperationById (operationId: string): Operation | undefined {

  }

  makeRequest (req: SwaggerMakeRequestInput, options?: SwaggerMakeRequestOptions): Result<SwaggerMakeRequestResult> {

  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#swagger-object'
  }

  static async load (path: string, options?: LoaderOptions): Promise<Result<Swagger>> {
    return await loadRoot<Swagger>(Swagger, path, options)
  }

  static get schema (): ComponentSchema<Definition> {
    if (swaggerSchema === undefined) {
      swaggerSchema = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'basePath',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'consumes',
            schema: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },
          {
            name: 'definitions',
            schema: {
              type: 'component',
              allowsRef: false,
              component: Definitions
            }
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
            name: 'host',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'info',
            required: true,
            schema: {
              type: 'component',
              allowsRef: false,
              component: Info
            }
          },
          {
            name: 'parameters',
            schema: {
              type: 'object',
              allowsSchemaExtensions: false,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: false,
                  component: Parameter
                }
              }
            }
          },
          {
            name: 'paths',
            required: true,
            schema: {
              type: 'component',
              allowsRef: false,
              component: Paths
            }
          },
          {
            name: 'produces',
            schema: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },
          {
            name: 'responses',
            schema: {
              type: 'object',
              allowsSchemaExtensions: false,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: false,
                  component: Response
                }
              }
            }
          },
          {
            name: 'schemes',
            schema: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['http', 'https', 'ws', 'wss']
              }
            }
          },
          {
            name: 'security',
            schema: {
              type: 'array',
              items: {
                type: 'component',
                allowsRef: false,
                component: SecurityRequirement
              }
            }
          },
          {
            name: 'securityDefinitions',
            schema: {
              type: 'object',
              allowsSchemaExtensions: false,
              additionalProperties: {
                schema: {
                  type: 'component',
                  allowsRef: false,
                  component: SecurityScheme
                }
              }
            }
          },
          {
            name: 'swagger',
            required: true,
            schema: {
              type: 'string',
              enum: ['2.0']
            }
          },
          {
            name: 'tags',
            schema: {
              type: 'array',
              items: {
                type: 'component',
                allowsRef: false,
                component: Tag
              }
            }
          }
        ],
        validator: {
          after (data: ValidatorData) {
            const { built, definition, exception } = data.context

            if (built.basePath !== undefined) {
              const basePath = built.basePath
              if (basePath[0] !== '/') {
                exception.add.swaggerBasePathInvalid(data, { key: 'basePath', type: 'value' }, basePath)
              }
              if (rxPathTemplating.test(basePath)) {
                exception.add.swaggerBasePathTemplating(data, { key: 'basePath', type: 'value' }, basePath)
              }
            }

            if (built.consumes !== undefined) {
              built.consumes.forEach((consumes: string) => {
                if (!rx.mediaType.test(consumes)) {
                  exception.add.invalidMediaType(data, { node: definition.consumes, key: consumes, type: 'value' }, consumes)
                }
              })
            }

            if (built.host !== undefined) {
              const host = built.host
              const match = rxHostParts.exec(host)
              if (match !== undefined && match !== null) {
                if (match[1] !== undefined) {
                  exception.add.swaggerHostHasScheme(data, { key: 'host', type: 'value' }, host, match[1])
                }
                if (match[3] !== undefined) {
                  exception.add.swaggerHostHasSubPath(data, { key: 'host', type: 'value' }, host, match[3])
                }
              }
              if (rxPathTemplating.test(host)) {
                exception.add.swaggerHostDoesNotSupportPathTemplating(data, { key: 'host', type: 'value' }, host)
              }
            }

            if (built.produces !== undefined) {
              built.produces.forEach((produces: string) => {
                if (!rx.mediaType.test(produces)) {
                  exception.add.invalidMediaType(data, { node: definition.produces, key: produces, type: 'value' }, produces)
                }
              })
            }
          }
        }
      })
    }
    return swaggerSchema
  }

  static validate (definition: Definition): DefinitionException {
    return componentValidate(this, definition, '2.0', arguments[2])
  }
}
