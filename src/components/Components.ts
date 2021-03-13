import { ComponentDefinition } from '../component-registry'
import * as Callback from './Callback'
import * as Example from './Example'
import * as Header from './Header'
import * as Link from './Link'
import * as Parameter from './Parameter'
import * as RequestBody from './RequestBody'
import * as Response from './Response'
import * as Schema from './Schema'
import * as SecurityScheme from './SecurityScheme'
import { Data, SchemaObject } from '../definition-validator'
import { EnforcerComponent, Statics, v3 } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  callbacks?: { [key: string]: Callback.Definition }
  examples?: { [key: string]: Example.Definition }
  headers?: { [key: string]: Header.Definition }
  links?: { [key: string]: Link.Definition }
  parameters?: { [key: string]: Parameter.Definition }
  requestBodies?: { [key: string]: RequestBody.Definition }
  responses?: { [key: string]: Response.Definition }
  schemas?: { [key: string]: Schema.Definition }
  securitySchemes?: { [key: string]: SecurityScheme.Definition }
}

export interface Object {
  [extension: string]: any
  readonly callbacks?: { [key: string]: Callback.Object }
  readonly examples?: { [key: string]: Example.Object }
  readonly headers?: { [key: string]: Header.Object }
  readonly links?: { [key: string]: Link.Object }
  readonly parameters?: { [key: string]: Parameter.Object }
  readonly requestBodies?: { [key: string]: RequestBody.Object }
  readonly responses?: { [key: string]: Response.Object }
  readonly schemas?: { [key: string]: Schema.Object }
  readonly securitySchemes?: { [key: string]: SecurityScheme.Object }
}

export const versions = Object.freeze({
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#components-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#components-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#components-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#components-object'
})

export const Component = class Components extends EnforcerComponent<Definition, Object> implements Object {
  readonly callbacks?: { [key: string]: Callback.Object }
  readonly examples?: { [key: string]: Example.Object }
  readonly headers?: { [key: string]: Header.Object }
  readonly links?: { [key: string]: Link.Object }
  readonly parameters?: { [key: string]: Parameter.Object }
  readonly requestBodies?: { [key: string]: RequestBody.Object }
  readonly responses?: { [key: string]: Response.Object }
  readonly schemas?: { [key: string]: Schema.Object }
  readonly securitySchemes?: { [key: string]: SecurityScheme.Object }

  // constructor (definition: Definition) {
  //   super(definition)
  // }
}

export function validator (data: Data<Definition, Object>): SchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'callbacks',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: Callback.Component
          }
        }
      }, {
        name: 'examples',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: Example.Component
          }
        }
      }, {
        name: 'headers',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: Header.Component
          }
        }
      }, {
        name: 'links',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: Link.Component
          }
        }
      }, {
        name: 'parameters',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: Parameter.Component
          }
        }
      }, {
        name: 'requestBodies',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: RequestBody.Component
          }
        }
      }, {
        name: 'responses',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: Response.Component
          }
        }
      }, {
        name: 'schemas',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: Schema.Component
          }
        }
      }, {
        name: 'securitySchemes',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: SecurityScheme.Component
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