/*
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!   IMPORTANT   !!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *  A portion of this file has been created from a template. You can only edit
 *  content in some regions within this file. Look for a region that begins with
 *  // <!# Custom Content Begin: *** #!>
 *  and ends with
 *  // <!# Custom Content End: *** #!>
 *  where the *** is replaced by a string of some value. Within these custom
 *  content regions you can edit the file without worrying about a loss of your
 *  code.
 */

import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../IComponentSchema'
import { ISchemaProcessor } from '../ISchemaProcessor'
import {
  Callback3,
  ExternalDocumentation3,
  ICallback3,
  ICallback3Definition,
  IExternalDocumentation3,
  IExternalDocumentation3Definition,
  IOperation3,
  IOperation3Definition,
  IParameter3,
  IParameter3Definition,
  IRequestBody3,
  IRequestBody3Definition,
  IResponses3,
  IResponses3Definition,
  ISecurityRequirement3,
  ISecurityRequirement3Definition,
  IServer3,
  IServer3Definition,
  Parameter3,
  RequestBody3,
  Responses3,
  SecurityRequirement3,
  Server3
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { after } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IOperation3Definition, IOperation3> | null = null

export class Operation extends EnforcerComponent implements IOperation3 {
  [extension: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation3
  operationId?: string
  parameters?: IParameter3[]
  requestBody?: IRequestBody3
  responses!: IResponses3
  callbacks?: Record<string, ICallback3>
  deprecated?: boolean
  security?: ISecurityRequirement3[]
  servers?: IServer3[]

  constructor (definition: IOperation3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#operation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#operation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#operation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#operation-object'
  }

  static getSchema (_data: ISchemaProcessor): ISchema.IDefinition<IOperation3Definition, IOperation3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const tags: ISchema.IProperty<ISchema.IArray<ISchema.IString>> = {
      name: 'tags',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }

    const summary: ISchema.IProperty<ISchema.IString> = {
      name: 'summary',
      schema: {
        type: 'string'
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation3Definition, IExternalDocumentation3>> = {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation3
      }
    }

    const operationId: ISchema.IProperty<ISchema.IString> = {
      name: 'operationId',
      schema: {
        type: 'string'
      }
    }

    const parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IParameter3Definition, IParameter3>>> = {
      name: 'parameters',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Parameter3
        }
      }
    }

    const requestBody: ISchema.IProperty<ISchema.IComponent<IRequestBody3Definition, IRequestBody3>> = {
      name: 'requestBody',
      schema: {
        type: 'component',
        allowsRef: true,
        component: RequestBody3
      }
    }

    const responses: ISchema.IProperty<ISchema.IComponent<IResponses3Definition, IResponses3>> = {
      name: 'responses',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Responses3
      }
    }

    const callbacks: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ICallback3Definition, ICallback3>>> = {
      name: 'callbacks',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Callback3
        }
      }
    }

    const deprecated: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'deprecated',
      schema: {
        type: 'boolean'
      }
    }

    const security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISecurityRequirement3Definition, ISecurityRequirement3>>> = {
      name: 'security',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: SecurityRequirement3
        }
      }
    }

    const servers: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IServer3Definition, IServer3>>> = {
      name: 'servers',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: Server3
        }
      }
    }

    const result: ISchema.IDefinition<IOperation3Definition, IOperation3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        tags,
        summary,
        description,
        externalDocs,
        operationId,
        parameters,
        requestBody,
        responses,
        callbacks,
        deprecated,
        security,
        servers
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.after = after
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IOperation3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
