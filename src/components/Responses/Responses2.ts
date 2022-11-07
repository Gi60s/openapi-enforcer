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
  IResponse2,
  IResponse2Definition,
  IResponses2,
  IResponses2Definition,
  Response2
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IResponses2Definition, IResponses2> | null = null

export class Responses extends EnforcerComponent implements IResponses2 {
  [extension: `x-${string}`]: any
  [key: number]: IResponse2
  default?: IResponse2

  constructor (definition: IResponses2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#responses-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<IResponses2Definition, IResponses2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const additionalProperties: ISchema.IComponent<IResponse2Definition, IResponse2> = {
      type: 'component',
      allowsRef: true,
      component: Response2
    }

    const _default: ISchema.IProperty<ISchema.IComponent<IResponse2Definition, IResponse2>> = {
      name: 'default',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Response2
      }
    }

    const schema: ISchema.IDefinition<IResponses2Definition, IResponses2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties,
      properties: [
        _default
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: IResponses2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
