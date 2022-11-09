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
  IResponse3,
  IResponse3Definition,
  IResponses3,
  IResponses3Definition,
  Response3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IResponses3Definition, IResponses3> | null = null

export class Responses extends EnforcerComponent implements IResponses3 {
  [extension: `x-${string}`]: any
  [key: number]: IResponse3
  default?: IResponse3

  constructor (definition: IResponses3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#responses-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#responses-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#responses-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#responses-object'
  }

  static getSchema (_data: ISchemaProcessor): ISchema.IDefinition<IResponses3Definition, IResponses3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const additionalProperties: ISchema.IComponent<IResponse3Definition, IResponse3> = {
      type: 'component',
      allowsRef: true,
      component: Response3
    }

    const _default: ISchema.IProperty<ISchema.IComponent<IResponse3Definition, IResponse3>> = {
      name: 'default',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Response3
      }
    }

    const result: ISchema.IDefinition<IResponses3Definition, IResponses3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties,
      properties: [
        _default
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IResponses3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
