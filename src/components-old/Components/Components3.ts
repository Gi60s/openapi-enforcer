import { Callback } from '../Callback/Callback3'
import { Example } from '../Example/Example3'
import { Header } from './Header/Header3'
import { Link } from '../Link/Link3'
import { Parameter } from '../Parameter/Parameter3'
import { RequestBody } from '../RequestBody/RequestBody3'
import { Response } from '../Response/Response3'
import { Schema } from '../Schema/Schema3'
import { SecurityScheme } from '../SecurityScheme/SecurityScheme3'
import { IComponents3, IComponents3Definition } from './IComponents'
import { IComponentClass, IComponentSpec, IVersion } from '../IComponent'
import { buildComponentFromDefinition, EnforcerComponent, validateComponentDefinition } from '../Component'
import { ISchemaProcessor } from '../ISchemaProcessor'
import { IComponentSchemaDefinition, IComponentSchemaObject } from '../IComponentSchema'
import { ExceptionStore } from '../../Exception/ExceptionStore'

const schema: IComponentSchemaDefinition<IComponents3Definition, IComponents3> = {
  type: 'object',
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

  // TODO: put this after function into the Swagger security definitions too
  // https://spec.openapis.org/oas/v2.0#security-requirement-object
  after ({ cmp, context, root }) {
    const { metadata } = root
    const { definition } = cmp
    const { securitySchemes } = definition

    if (typeof securitySchemes === 'object' && securitySchemes !== null) {
      Object.keys(securitySchemes).forEach((key: string) => {
        metadata.securitySchemes[key] = context.children.securitySchemes.context.children[key]
      })
    }
  }
}

export class Components extends EnforcerComponent implements IComponents3 {
  callbacks?: Record<string, Callback>
  examples?: Record<string, Example>
  headers?: Record<string, Header>
  links?: Record<string, Link>
  parameters?: Record<string, Parameter>
  requestBodies?: Record<string, RequestBody>
  responses?: Record<string, Response>
  schemas?: Record<string, Schema>
  securitySchemes?: Record<string, SecurityScheme>

  constructor (definition: IComponents3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#components-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#components-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#components-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#components-object'
  }

  static getSchema (data: ISchemaProcessor): IComponentSchemaDefinition<IComponents3Definition, IComponents3> {
    return schema
  }

  static validate (definition: IComponents3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }
}
