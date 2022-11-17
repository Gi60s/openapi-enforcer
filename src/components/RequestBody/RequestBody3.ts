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
import { IRequestBodySchemaProcessor } from '../IInternalTypes'
import {
  IMediaType3,
  IMediaType3Definition,
  IRequestBody3,
  IRequestBody3Definition,
  MediaType3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IRequestBody3Definition, IRequestBody3> | null = null

export class RequestBody extends EnforcerComponent implements IRequestBody3 {
  [extension: `x-${string}`]: any
  description?: string
  content?: Record<string, IMediaType3>
  required?: boolean

  constructor (definition: IRequestBody3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#request-body-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#request-body-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#request-body-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#request-body-object'
  }

  static getSchema (_data: IRequestBodySchemaProcessor): ISchema.IDefinition<IRequestBody3Definition, IRequestBody3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const content: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IMediaType3Definition, IMediaType3>>> = {
      name: 'content',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: MediaType3
        }
      }
    }

    const required: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'required',
      schema: {
        type: 'boolean'
      }
    }

    const result: ISchema.IDefinition<IRequestBody3Definition, IRequestBody3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        description,
        content,
        required
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IRequestBody3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
