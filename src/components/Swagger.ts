import {
  OASComponent,
  Exception,
  LoaderOptions,
  loadRoot, Dereferenced, ComponentSchema
} from './'
import { Result } from '../Result'
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

const rxHostParts = /^(?:(https?|wss?):\/\/)?(.+?)(\/.+)?$/
const rxPathTemplating = /[{}]/

export interface Definition {
  [key: `x-${string}`]: any
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

const schemaSwagger: ComponentSchema<Definition> = {
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
        type: 'string'
      }
    },
    {
      name: 'info',
      required: true,
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
        allowsSchemaExtensions: false,
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: Parameter.Parameter
        }
      }
    },
    {
      name: 'paths',
      required: true,
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
          component: SecurityRequirement.SecurityRequirement
        }
      }
    },
    {
      name: 'securityDefinitions',
      schema: {
        type: 'object',
        allowsSchemaExtensions: false,
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: SecurityScheme.SecurityScheme
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
          component: Tag.Tag
        }
      }
    }
  ],
  validator: {
    after (data) {
      const { built, definition, exception } = data.context
      const { reference } = data.component

      if (built.basePath !== undefined) {
        const basePath = built.basePath
        if (basePath[0] !== '/') {
          const swaggerBasePathInvalid = E.swaggerBasePathInvalid(basePath, {
            definition,
            locations: [{ node: definition, key: 'basePath', type: 'value' }],
            reference
          })
          exception.message(swaggerBasePathInvalid)
        }
        if (rxPathTemplating.test(basePath)) {
          const swaggerBasePathTemplating = E.swaggerBasePathTemplating(basePath, {
            definition,
            locations: [{ node: definition, key: 'basePath', type: 'value' }],
            reference
          })
          exception.message(swaggerBasePathTemplating)
        }
      }

      if (built.consumes !== undefined) {
        built.consumes.forEach(consumes => {
          if (!rx.mediaType.test(consumes)) {
            const invalidMediaType = E.invalidMediaType(consumes, {
              definition,
              locations: [{ node: definition.consumes, key: consumes, type: 'value' }],
              reference
            })
            exception.message(invalidMediaType)
          }
        })
      }

      if (built.host !== undefined) {
        const host = built.host
        const match = rxHostParts.exec(host)
        if (match !== undefined && match !== null) {
          if (match[1] !== undefined) {
            const swaggerHostHasScheme = E.swaggerHostHasScheme(host, match[1], {
              definition,
              locations: [{ node: definition, key: 'host', type: 'value' }],
              reference
            })
            exception.message(swaggerHostHasScheme)
          }
          if (match[3] !== undefined) {
            const swaggerHostHasSubPath = E.swaggerHostHasSubPath(host, match[3], {
              definition,
              locations: [{ node: definition, key: 'host', type: 'value' }],
              reference
            })
            exception.message(swaggerHostHasSubPath)
          }
        }
        if (rxPathTemplating.test(host)) {
          const swaggerHostDoesNotSupportPathTemplating = E.swaggerHostDoesNotSupportPathTemplating(host, {
            definition,
            locations: [{ node: definition, key: 'host', type: 'value' }],
            reference
          })
          exception.message(swaggerHostDoesNotSupportPathTemplating)
        }
      }

      if (built.produces !== undefined) {
        built.produces.forEach(produces => {
          if (!rx.mediaType.test(produces)) {
            const invalidMediaType = E.invalidMediaType(produces, {
              definition,
              locations: [{ node: definition.consumes, key: produces, type: 'value' }],
              reference
            })
            exception.message(invalidMediaType)
          }
        })
      }
    }
  }
}

export class Swagger<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly basePath?: string
  readonly consumes?: string[]
  readonly definitions?: Definitions.Definitions<HasReference>
  readonly externalDocs?: ExternalDocumentation.ExternalDocumentation
  readonly host?: string
  readonly info!: Info.Info
  readonly parameters?: Record<string, Parameter.Parameter<HasReference>>
  readonly paths!: Paths.Paths<HasReference>
  readonly produces?: string[]
  readonly responses?: Record<string, Response.Response<HasReference>>
  readonly security?: SecurityRequirement.SecurityRequirement[]
  readonly securityDefinitions?: Record<string, SecurityScheme.SecurityScheme>
  readonly schemes?: string[]
  readonly swagger!: '2.0'
  readonly tags?: Tag.Tag[]

  constructor (definition: Definition) {
    super(Swagger, definition, '2.0', arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#swagger-object'
  }

  static async load (path: string, options?: LoaderOptions): Promise<Result<Swagger>> {
    return await loadRoot<Swagger>(Swagger, path, options)
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return schemaSwagger
  }

  static validate (definition: Definition): Exception {
    return super.validate(definition, '2.0', arguments[2])
  }
}
