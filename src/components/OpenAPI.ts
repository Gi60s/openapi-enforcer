import { ComponentDefinition } from '../component-registry'
import { EnforcerComponent, Statics, v3 } from './'
import * as Components from './Components'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Info from './Info'
import * as Paths from './Paths'
import * as SecurityRequirement from './SecurityRequirement'
import * as Server from './Server'
import * as Tag from './Tag'
import { Data, SchemaObject } from '../definition-validator'

const rxVersion = /^\d+\.\d+\.\d+$/

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  components?: Components.Definition
  externalDocs: ExternalDocumentation.Definition
  info: Info.Definition
  openapi: string
  paths: Paths.Definition
  security?: SecurityRequirement.Definition[]
  servers?: Server.Definition[]
  tags?: Tag.Definition[]
}

export interface Object {
  [extension: string]: any
  components?: Components.Object
  externalDocs: ExternalDocumentation.Object
  info: Info.Object
  openapi: string
  paths: Paths.Object
  security?: SecurityRequirement.Object[]
  servers?: Server.Object[]
  tags?: Tag.Object[]
}

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#openapi-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#openapi-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#openapi-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#openapi-object'
})

export const Component = class OpenAPI extends EnforcerComponent<Definition, Object> implements Object {
  readonly [extension: string]: any
  readonly components?: Components.Object
  readonly externalDocs: ExternalDocumentation.Object
  readonly info: Info.Object
  readonly openapi: string
  readonly paths: Paths.Object
  readonly security?: SecurityRequirement.Object[]
  readonly servers?: Server.Object[]
  readonly tags?: Tag.Object[]

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    required: () => ['openapi', 'info', 'paths'],
    properties: [
      {
        name: 'components',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Components.Component
        }
      },
      {
        name: 'externalDocs',
        schema: {
          type: 'component',
          allowsRef: false,
          component: ExternalDocumentation.Component
        }
      },
      {
        name: 'info',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Info.Component
        }
      },
      {
        name: 'openapi',
        schema: {
          type: 'string',
          before: (data) => {
            const value = data.definition
            if (!rxVersion.test(value)) {
              data.alert('error', 'OPN001', 'Value must be a semantic version number')
              return false
            }
            if (value.split('.')[0] !== '3') {
              data.alert('error', 'OPN002', 'OpenAPI specification version not supported: ' + value)
              return false
            }
            return true
          }
        }
      },
      {
        name: 'paths',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Paths.Component
        }
      },
      {
        name: 'security',
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: false,
            component: SecurityRequirement.Component
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
            component: Server.Component
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
            component: Tag.Component
          }
        }
      }
    ]
  }
}

export const register: ComponentDefinition = {
  component: Component,
  validator,
  versions
}
