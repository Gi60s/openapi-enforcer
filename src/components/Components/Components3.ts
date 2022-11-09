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
  Example3,
  Header3,
  ICallback3,
  ICallback3Definition,
  IComponents3,
  IComponents3Definition,
  IExample3,
  IExample3Definition,
  IHeader3,
  IHeader3Definition,
  ILink3,
  ILink3Definition,
  IParameter3,
  IParameter3Definition,
  IRequestBody3,
  IRequestBody3Definition,
  IResponse3,
  IResponse3Definition,
  ISchema3,
  ISchema3Definition,
  ISecurityScheme3,
  ISecurityScheme3Definition,
  Link3,
  Parameter3,
  RequestBody3,
  Response3,
  Schema3,
  SecurityScheme3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IComponents3Definition, IComponents3> | null = null

export class Components extends EnforcerComponent implements IComponents3 {
  [extension: `x-${string}`]: any
  schemas?: Record<string, ISchema3>
  responses?: Record<string, IResponse3>
  parameters?: Record<string, IParameter3>
  examples?: Record<string, IExample3>
  requestBodies?: Record<string, IRequestBody3>
  headers?: Record<string, IHeader3>
  securitySchemes?: Record<string, ISecurityScheme3>
  links?: Record<string, ILink3>
  callbacks?: Record<string, ICallback3>

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

  static getSchema (_data: ISchemaProcessor): ISchema.IDefinition<IComponents3Definition, IComponents3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const schemas: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISchema3Definition, ISchema3>>> = {
      name: 'schemas',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Schema3
        }
      }
    }

    const responses: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IResponse3Definition, IResponse3>>> = {
      name: 'responses',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Response3
        }
      }
    }

    const parameters: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IParameter3Definition, IParameter3>>> = {
      name: 'parameters',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Parameter3
        }
      }
    }

    const examples: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IExample3Definition, IExample3>>> = {
      name: 'examples',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Example3
        }
      }
    }

    const requestBodies: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IRequestBody3Definition, IRequestBody3>>> = {
      name: 'requestBodies',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: RequestBody3
        }
      }
    }

    const headers: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IHeader3Definition, IHeader3>>> = {
      name: 'headers',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Header3
        }
      }
    }

    const securitySchemes: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISecurityScheme3Definition, ISecurityScheme3>>> = {
      name: 'securitySchemes',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: SecurityScheme3
        }
      }
    }

    const links: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ILink3Definition, ILink3>>> = {
      name: 'links',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Link3
        }
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

    const result: ISchema.IDefinition<IComponents3Definition, IComponents3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        schemas,
        responses,
        parameters,
        examples,
        requestBodies,
        headers,
        securitySchemes,
        links,
        callbacks
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IComponents3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
