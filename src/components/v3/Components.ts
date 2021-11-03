import {
  OASComponent,
  Dereferenced,
  Referencable,
  Version,
  DefinitionException,
  ComponentSchema
} from '../index'
import { Callback } from './Callback'
import { Example } from './Example'
import { Header } from './Header'
import { Link } from './Link'
import { Parameter } from './Parameter'
import { RequestBody } from './RequestBody'
import { Response } from './Response'
import { Schema } from './Schema'
import { SecurityScheme } from './SecurityScheme'
import { Components3 as Definition } from '../helpers/DefinitionTypes'

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
          component: Callback
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
          component: Example
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
          component: Header
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
          component: Link
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
          component: Parameter
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
          component: RequestBody
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
          component: Response
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
          component: Schema
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
          component: SecurityScheme
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
  readonly callbacks?: Record<string, Referencable<HasReference, Callback>>
  readonly examples?: Record<string, Referencable<HasReference, Example>>
  readonly headers?: Record<string, Referencable<HasReference, Header<HasReference>>>
  readonly links?: Record<string, Referencable<HasReference, Link>>
  readonly parameters?: Record<string, Referencable<HasReference, Parameter<HasReference>>>
  readonly requestBodies?: Record<string, Referencable<HasReference, RequestBody>>
  readonly responses?: Record<string, Referencable<HasReference, Response<HasReference>>>
  readonly schemas?: Record<string, Referencable<HasReference, Schema>>
  readonly securitySchemes?: Record<string, Referencable<HasReference, SecurityScheme>>

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

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
