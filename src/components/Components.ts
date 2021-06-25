import { OASComponent, initializeData, Data, SchemaObject, SpecMap, Version, Exception } from './'
import { yes } from '../util'
import * as Callback from './Callback'
import * as Example from './Example'
import * as Header from './Header'
import * as Link from './Link'
import * as Parameter from './Parameter'
import * as Reference from './Reference'
import * as RequestBody from './RequestBody'
import * as Response from './Response'
import * as Schema from './Schema'
import * as SecurityScheme from './SecurityScheme'

export interface Definition {
  [key: `x-${string}`]: any
  callbacks?: Record<string, Callback.Definition | Reference.Definition>
  examples?: Record<string, Example.Definition | Reference.Definition>
  headers?: Record<string, Header.Definition | Reference.Definition>
  links?: Record<string, Link.Definition | Reference.Definition>
  parameters?: Record<string, Parameter.Definition | Reference.Definition>
  requestBodies?: Record<string, RequestBody.Definition | Reference.Definition>
  responses?: Record<string, Response.Definition | Reference.Definition>
  schemas?: Record<string, Schema.Definition | Reference.Definition>
  securitySchemes?: Record<string, SecurityScheme.Definition | Reference.Definition>
}

export class Components extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly callbacks?: Record<string, Callback.Callback | Reference.Reference>
  readonly examples?: Record<string, Example.Example | Reference.Reference>
  readonly headers?: Record<string, Header.Header | Reference.Reference>
  readonly links?: Record<string, Link.Link | Reference.Reference>
  readonly parameters?: Record<string, Parameter.Parameter | Reference.Reference>
  readonly requestBodies?: Record<string, RequestBody.RequestBody | Reference.Reference>
  readonly responses?: Record<string, Response.Response | Reference.Reference>
  readonly schemas?: Record<string, Schema.Schema | Reference.Reference>
  readonly securitySchemes?: Record<string, SecurityScheme.SecurityScheme | Reference.Reference>

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Components object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#components-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#components-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#components-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#components-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'callbacks',
          schema: {
            type: 'object',
            allowsSchemaExtensions: yes,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Callback.Callback
            }
          }
        }, {
          name: 'examples',
          schema: {
            type: 'object',
            allowsSchemaExtensions: yes,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Example.Example
            }
          }
        }, {
          name: 'headers',
          schema: {
            type: 'object',
            allowsSchemaExtensions: yes,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Header.Header
            }
          }
        }, {
          name: 'links',
          schema: {
            type: 'object',
            allowsSchemaExtensions: yes,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Link.Link
            }
          }
        }, {
          name: 'parameters',
          schema: {
            type: 'object',
            allowsSchemaExtensions: yes,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Parameter.Parameter
            }
          }
        }, {
          name: 'requestBodies',
          schema: {
            type: 'object',
            allowsSchemaExtensions: yes,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: RequestBody.RequestBody
            }
          }
        }, {
          name: 'responses',
          schema: {
            type: 'object',
            allowsSchemaExtensions: yes,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Response.Response
            }
          }
        }, {
          name: 'schemas',
          schema: {
            type: 'object',
            allowsSchemaExtensions: yes,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: Schema.Schema
            }
          }
        }, {
          name: 'securitySchemes',
          schema: {
            type: 'object',
            allowsSchemaExtensions: yes,
            additionalProperties: {
              type: 'component',
              allowsRef: true,
              component: SecurityScheme.SecurityScheme,
              // TODO: put this after function into the Swagger security definitions too
              // https://spec.openapis.org/oas/v2.0#security-requirement-object
              after (data: Data) {
                const { key, metadata } = data
                if (metadata.securitySchemes === undefined) metadata.securitySchemes = {}
                metadata.securitySchemes[key] = data
              }
            }
          }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
