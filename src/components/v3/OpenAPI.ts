import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import { OASComponent, componentValidate, LoaderOptions, loadRoot, normalizeLoaderOptions } from '../index'
import { Components } from './Components'
import { ExternalDocumentation } from '../ExternalDocumentation'
import { Info } from '../Info'
import { Operation } from './Operation'
import { Paths } from './Paths'
import { SecurityRequirement } from '../SecurityRequirement'
import { Server } from './Server'
import { Tag } from '../Tag'
import { Result } from '../../utils/Result'
import { OpenAPI3 as Definition } from '../helpers/definition-types'
import {
  OpenAPIGetOperationResult,
  OpenAPIMakeRequestInput,
  OpenAPIMakeRequestOptions,
  OpenAPIMakeRequestOutput
} from '../helpers/function-interfaces'

const rxVersion = /^\d+\.\d+\.\d+$/
let openapiSchema: ComponentSchema<Definition>

export class OpenAPI extends OASComponent {
  extensions!: Record<string, any>
  components?: Components
  externalDocs?: ExternalDocumentation
  info!: Info
  openapi!: string
  paths!: Paths
  security?: SecurityRequirement[]
  servers!: Server[]
  tags?: Tag[]

  constructor (definition: Definition, version?: Version) {
    super(OpenAPI, definition, version, arguments[2])
  }

  getOperation (method: string, path: string): Result<OpenAPIGetOperationResult> {

  }

  getOperationById (operationId: string): Operation | undefined {
    return this.enforcer.metadata.operationIdMap[operationId] as Operation
  }

  makeRequest (req: OpenAPIMakeRequestInput, options?: OpenAPIMakeRequestOptions): Result<OpenAPIMakeRequestOutput> {

  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#openapi-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#openapi-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#openapi-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#openapi-object'
  }

  static async load (path: string, options?: LoaderOptions): Promise<Result<OpenAPI>> {
    options = normalizeLoaderOptions(options)
    return await loadRoot<OpenAPI>(OpenAPI, path, options)
  }

  static get schema (): ComponentSchema<Definition> {
    if (openapiSchema === undefined) {
      openapiSchema = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'components',
            schema: {
              type: 'component',
              allowsRef: false,
              component: Components
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
            name: 'info',
            required: true,
            schema: {
              type: 'component',
              allowsRef: false,
              component: Info
            }
          },
          {
            name: 'openapi',
            required: true,
            schema: {
              type: 'string'
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
            name: 'servers',
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
        builder: {
          after (data) {
            const { built } = data.context

            if (built.servers === undefined) built.servers = []
            if (built.servers.length === 0) built.servers.push({ url: '/' })
          }
        },
        validator: {
          before (data) {
            const { definition, exception } = data.context

            if (definition.openapi !== undefined) {
              const openapiVersion = definition.openapi
              if (!rxVersion.test(openapiVersion)) {
                exception.at('openapi').add.invalidSemanticVersionNumber(data, { key: 'openapi', type: 'value' }, openapiVersion)
                return false
              }
              if (openapiVersion.split('.')[0] !== '3') {
                exception.at('openapi').add.invalidOpenApiVersionNumber(data, { key: 'openapi', type: 'value' }, openapiVersion)
                return false
              }
            }

            return true
          }
        }
      })
    }
    return openapiSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
