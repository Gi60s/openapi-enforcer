import {
  OASComponent,
  LoaderOptions,
  normalizeLoaderOptions,
  Version,
  DefinitionException,
  loadRoot, Dereferenced, ComponentSchema
} from '../index'
import * as E from '../../DefinitionException/methods'
import { Components } from './Components'
import { ExternalDocumentation } from '../ExternalDocumentation'
import { Info } from '../Info'
import { Paths } from './Paths'
import { SecurityRequirement } from '../SecurityRequirement'
import { Server } from './Server'
import { Tag } from '../Tag'
import { Result } from '../../utils/Result'
import { base as rootDataTypes } from '../helpers/DataTypes'
import { OpenAPI3 as Definition } from '../helpers/DefinitionTypes'

const rxVersion = /^\d+\.\d+\.\d+$/

const openapiSchema: ComponentSchema<Definition> = {
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
  validator: {
    before (data) {
      const { definition, exception } = data.context
      const { reference } = data.component

      if (definition.openapi !== undefined) {
        const openapiVersion = definition.openapi
        if (!rxVersion.test(openapiVersion)) {
          const invalidSemanticVersionNumber = E.invalidSemanticVersionNumber(openapiVersion, {
            definition,
            locations: [{ node: definition, key: 'openapi', type: 'value' }],
            reference
          })
          exception.at('openapi').message(invalidSemanticVersionNumber)
          return false
        }
        if (openapiVersion.split('.')[0] !== '3') {
          const invalidOpenApiVersionNumber = E.invalidOpenApiVersionNumber(openapiVersion, {
            definition,
            locations: [{ node: definition, key: 'openapi', type: 'value' }],
            reference
          })
          exception.at('openapi').message(invalidOpenApiVersionNumber)
          return false
        }
      }

      return true
    }
  }
}

export class OpenAPI<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly components?: Components<HasReference>
  readonly externalDocs?: ExternalDocumentation
  readonly info!: Info
  readonly openapi!: string
  readonly paths!: Paths<HasReference>
  readonly security?: SecurityRequirement[]
  readonly servers?: Server[]
  readonly tags?: Tag[]

  constructor (definition: Definition, version?: Version) {
    super(OpenAPI, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#openapi-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#openapi-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#openapi-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#openapi-object'
  }

  // data types that apply to everything
  static dataType = rootDataTypes

  static async load (path: string, options?: LoaderOptions): Promise<Result<OpenAPI>> {
    options = normalizeLoaderOptions(options)
    if (options.dereference === true) {
      return await loadRoot<OpenAPI<Dereferenced>>(OpenAPI, path, options)
    }
    return await loadRoot<OpenAPI>(OpenAPI, path, options)
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return openapiSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
