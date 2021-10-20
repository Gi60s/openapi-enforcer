import {
  OASComponent,
  Dereferenced,
  Referencable,
  Version,
  Exception,
  ComponentSchema
} from './'
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

const schemaComponent: ComponentSchema<Definition> = {
  allowsSchemaExtensions: true,
  properties: [
    {
      name: 'callbacks',
      schema: {
        type: 'object',
        allowsSchemaExtensions: true,
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
        allowsSchemaExtensions: true,
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
        allowsSchemaExtensions: true,
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
        allowsSchemaExtensions: true,
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
        allowsSchemaExtensions: true,
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
        allowsSchemaExtensions: true,
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
        allowsSchemaExtensions: true,
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
        allowsSchemaExtensions: true,
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
        allowsSchemaExtensions: true,
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: SecurityScheme.SecurityScheme
        }
      }
    }
  ],

  validator: {
    // TODO: put this after function into the Swagger security definitions too
    // https://spec.openapis.org/oas/v2.0#security-requirement-object
    after (data) {
      const { metadata } = data.root
      const { definition } = data.context
      const { securitySchemes } = definition

      if (typeof securitySchemes === 'object' && securitySchemes !== null) {
        Object.keys(securitySchemes).forEach((key: string) => {
          metadata.securitySchemes[key] = data.context.children.securitySchemes.context.children[key]
        })
      }
    }
  }
}

export class Components<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly callbacks?: Record<string, Referencable<HasReference, Callback.Callback>>
  readonly examples?: Record<string, Referencable<HasReference, Example.Example>>
  readonly headers?: Record<string, Referencable<HasReference, Header.Header<HasReference>>>
  readonly links?: Record<string, Referencable<HasReference, Link.Link>>
  readonly parameters?: Record<string, Referencable<HasReference, Parameter.Parameter<HasReference>>>
  readonly requestBodies?: Record<string, Referencable<HasReference, RequestBody.RequestBody>>
  readonly responses?: Record<string, Referencable<HasReference, Response.Response<HasReference>>>
  readonly schemas?: Record<string, Referencable<HasReference, Schema.Schema>>
  readonly securitySchemes?: Record<string, Referencable<HasReference, SecurityScheme.SecurityScheme>>

  constructor (definition: Definition, version?: Version) {
    super(Components, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#components-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#components-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#components-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#components-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return schemaComponent
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
