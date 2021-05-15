import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { yes } from '../util'
import * as E from '../Exception/methods'
import * as Components from './Components'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Info from './Info'
import * as Paths from './Paths'
import * as SecurityRequirement from './SecurityRequirement'
import * as Server from './Server'
import * as Tag from './Tag'

const rxVersion = /^\d+\.\d+\.\d+$/

export interface Definition {
  [extension: string]: any
  components?: Components.Definition
  externalDocs?: ExternalDocumentation.Definition
  info: Info.Definition
  openapi: string
  paths: Paths.Definition
  security?: SecurityRequirement.Definition[]
  servers?: Server.Definition[]
  tags?: Tag.Definition[]
}

export class OpenAPI extends OASComponent {
  readonly [extension: string]: any
  readonly components?: Components.Components
  readonly externalDocs?: ExternalDocumentation.ExternalDocumentation
  readonly info!: Info.Info
  readonly openapi!: string
  readonly paths!: Paths.Paths
  readonly security?: SecurityRequirement.SecurityRequirement[]
  readonly servers?: Server.Server[]
  readonly tags?: Tag.Tag[]

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing OpenAPI object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#openapi-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#openapi-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#openapi-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#openapi-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'components',
          schema: {
            type: 'component',
            allowsRef: false,
            component: Components.Components
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
          name: 'info',
          required: yes,
          schema: {
            type: 'component',
            allowsRef: false,
            component: Info.Info
          }
        },
        {
          name: 'openapi',
          required: yes,
          schema: {
            type: 'string',
            before: ({ definition, exception, reference }) => {
              if (!rxVersion.test(definition)) {
                exception.message(E.invalidSemanticVersionNumber(reference))
                return false
              }
              if (definition.split('.')[0] !== '3') {
                exception.message(E.invalidOpenApiVersionNumber(reference, definition))
                return false
              }
              return true
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
          name: 'servers',
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

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
