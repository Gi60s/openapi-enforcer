import * as Callback from './Callback'
import * as Example from './Example'
import * as Header from './Header'
import * as Link from './Link'
import * as Parameter from './Parameter'
import * as RequestBody from './RequestBody'
import * as Response from './Response'
import * as Schema from './Schema'
import * as SecurityScheme from './SecurityScheme'
import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics, v3 } from './'

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

export function Factory (): FactoryResult<Definition, Object> {
  class Components extends EnforcerComponent<Definition, Object> implements Object {
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

  return {
    component: Components,
    validator: function (data): SchemaObject {
      const components = data.components as v3
      return {
        type: 'object',
        properties: [
          {
            name: 'callbacks',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.Callback
              }
            }
          }, {
            name: 'examples',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.Example
              }
            }
          }, {
            name: 'headers',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.Header
              }
            }
          }, {
            name: 'links',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.Link
              }
            }
          }, {
            name: 'parameters',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.Parameter
              }
            }
          }, {
            name: 'requestBodies',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.RequestBody
              }
            }
          }, {
            name: 'responses',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.Response
              }
            }
          }, {
            name: 'schemas',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.Schema
              }
            }
          }, {
            name: 'securitySchemes',
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'component',
                component: components.SecurityScheme
              }
            }
          }
        ]
      }
    }
  }
}
