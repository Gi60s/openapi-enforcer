import { OASComponent, initializeData, SchemaObject, SpecMap, ValidateResult } from './'
import * as Loader from '../loader'
import { addExceptionLocation, adjustExceptionLevel, no, yes } from '../util'
import * as E from '../Exception/methods'
import rx from '../rx'
import * as Definitions from './Definitions'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Info from './Info'
import * as Parameter from './Parameter'
import * as Paths from './Paths'
import * as Response from './Response'
import * as SecurityScheme from './SecurityScheme'
import * as SecurityRequirement from './SecurityRequirement'
import * as Tag from './Tag'
import { lookup } from '../loader'

const rxHostParts = /^(?:(https?|wss?):\/\/)?(.+?)(\/.+)?$/
const rxPathTemplating = /[{}]/

export interface Definition {
  [extension: string]: any
  basePath?: string
  consumes?: string[]
  definitions?: Definitions.Definition
  externalDocs?: ExternalDocumentation.Definition
  host?: string
  info: Info.Definition
  parameters?: Record<string, Parameter.Definition>
  paths: Paths.Definition
  produces?: string[]
  responses?: Record<string, Response.Definition2>
  security?: SecurityRequirement.Definition[]
  securityDefinitions?: Record<string, SecurityScheme.Definition>
  schemes?: string[]
  swagger: '2.0'
  tags?: Tag.Definition[]
}

export interface LoaderOptions extends Loader.Options {
  validate?: boolean
}

export class Swagger extends OASComponent {
  readonly [extension: string]: any
  basePath?: string
  consumes?: string[]
  definitions?: Definitions.Definitions
  externalDocs?: ExternalDocumentation.ExternalDocumentation
  host?: string
  info!: Info.Info
  parameters?: Record<string, Parameter.Parameter>
  paths!: Paths.Paths
  produces?: string[]
  responses?: Record<string, Response.Response>
  security?: SecurityRequirement.SecurityRequirement[]
  securityDefinitions?: Record<string, SecurityScheme.SecurityScheme>
  schemes?: string[]
  swagger!: '2.0'
  tags?: Tag.Tag[]

  constructor (definition: Definition) {
    const data = initializeData('constructing Swagger object', definition, '2.0', arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#swagger-object'
    }
  }

  static async load (path: string, options?: LoaderOptions): Promise<Definition> {
    const def = await Loader.load(path, options)
    if (options?.validate !== false) {
      const error = this.validate(def)
      if (error.hasException) throw Error(error.toString())
    }
    return def
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'basePath',
          schema: {
            type: 'string',
            after ({ exception, definition, reference }, def) {
              if (definition[0] !== '/') {
                const swaggerBasePathInvalid = E.swaggerBasePathInvalid(reference, definition)
                addExceptionLocation(swaggerBasePathInvalid, lookup(def, 'basePath', 'value'))
                exception.message(swaggerBasePathInvalid)
              }
              if (rxPathTemplating.test(definition)) {
                const swaggerBasePathTemplating = E.swaggerBasePathTemplating(reference, definition)
                addExceptionLocation(swaggerBasePathTemplating, lookup(def, 'basePath', 'value'))
                exception.message(swaggerBasePathTemplating)
              }
            }
          }
        },
        {
          name: 'consumes',
          schema: {
            type: 'array',
            items: {
              type: 'string',
              after ({ definition, exception, key, reference }, def) {
                if (!rx.mediaType.test(definition)) {
                  const invalidMediaType = E.invalidMediaType(reference, definition)
                  adjustExceptionLevel(def.consumes, invalidMediaType)
                  addExceptionLocation(invalidMediaType, lookup(def.consumes, key, 'value'))
                  exception.message(invalidMediaType)
                }
              }
            }
          }
        },
        {
          name: 'definitions',
          schema: {
            type: 'component',
            allowsRef: false,
            component: Definitions.Definitions
          }
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
          name: 'host',
          schema: {
            type: 'string',
            after ({ exception, definition, reference }, def) {
              const match = rxHostParts.exec(definition)
              if (match !== undefined && match !== null) {
                if (match[1] !== undefined) {
                  const swaggerHostHasScheme = E.swaggerHostHasScheme(reference, definition, match[1])
                  addExceptionLocation(swaggerHostHasScheme, lookup(def, 'host', 'value'))
                  exception.message(swaggerHostHasScheme)
                }
                if (match[3] !== undefined) {
                  const swaggerHostHasSubPath = E.swaggerHostHasSubPath(reference, definition, match[3])
                  addExceptionLocation(swaggerHostHasSubPath, lookup(def, 'host', 'value'))
                  exception.message(swaggerHostHasSubPath)
                }
              }
              if (rxPathTemplating.test(definition)) {
                const swaggerHostDoesNotSupportPathTemplating = E.swaggerHostDoesNotSupportPathTemplating(reference, definition)
                addExceptionLocation(swaggerHostDoesNotSupportPathTemplating, lookup(def, 'host', 'value'))
                exception.message(swaggerHostDoesNotSupportPathTemplating)
              }
            }
          }
        },
        {
          name: 'info',
          required: yes,
          schema: {
            type: 'component',
            allowsRef: false,
            component: Info.Info
          }
        },
        {
          name: 'parameters',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: false,
              component: Parameter.Parameter
            }
          }
        },
        {
          name: 'paths',
          required: yes,
          schema: {
            type: 'component',
            allowsRef: false,
            component: Paths.Paths
          }
        },
        {
          name: 'produces',
          schema: {
            type: 'array',
            items: {
              type: 'string',
              after ({ definition, exception, key, reference }, def) {
                if (!rx.mediaType.test(definition)) {
                  const invalidMediaType = E.invalidMediaType(reference, definition)
                  adjustExceptionLevel(def, invalidMediaType)
                  addExceptionLocation(invalidMediaType, lookup(def.produces, key))
                  exception.message(invalidMediaType)
                }
              }
            }
          }
        },
        {
          name: 'responses',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: false,
              component: Response.Response
            }
          }
        },
        {
          name: 'schemes',
          schema: {
            type: 'array',
            items: {
              type: 'string',
              enum: () => ['http', 'https', 'ws', 'wss']
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
              component: SecurityRequirement.SecurityRequirement
            }
          }
        },
        {
          name: 'securityDefinitions',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: false,
              component: SecurityScheme.SecurityScheme
            }
          }
        },
        {
          name: 'swagger',
          required: yes,
          schema: {
            type: 'string',
            enum: () => ['2.0']
          }
        },
        {
          name: 'tags',
          schema: {
            type: 'array',
            items: {
              type: 'component',
              allowsRef: false,
              component: Tag.Tag
            }
          }
        }
      ]
    }
  }

  static validate (definition: Definition): ValidateResult {
    return super.validate(definition, '2.0', arguments[2])
  }
}
