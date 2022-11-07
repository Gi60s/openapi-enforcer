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
  ICallback3,
  ICallback3Definition,
  IPathItem3,
  IPathItem3Definition,
  PathItem3
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<ICallback3Definition, ICallback3> | null = null

export class Callback extends EnforcerComponent implements ICallback3 {
  [extension: `x-${string}`]: any
  [key: string]: IPathItem3
  constructor (definition: ICallback3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#callback-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#callback-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#callback-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#callback-object'
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<ICallback3Definition, ICallback3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const additionalProperties: ISchema.IComponent<IPathItem3Definition, IPathItem3> = {
      type: 'component',
      allowsRef: false,
      component: PathItem3
    }

    const schema: ISchema.IDefinition<ICallback3Definition, ICallback3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>

    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: ICallback3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
