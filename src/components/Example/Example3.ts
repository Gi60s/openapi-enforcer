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
  IExample3,
  IExample3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IExample3Definition, IExample3> | null = null

export class Example extends EnforcerComponent implements IExample3 {
  [extension: `x-${string}`]: any
  summary?: string
  description?: string
  value?: any
  externalValue?: string

  constructor (definition: IExample3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#example-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#example-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#example-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#example-object'
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<IExample3Definition, IExample3> {
    if (cachedSchema !== null) {
      return cachedSchema
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

    const value: ISchema.IProperty<any> = {
      name: 'value',
      schema: {
        type: 'any'
      }
    }

    const externalValue: ISchema.IProperty<ISchema.IString> = {
      name: 'externalValue',
      schema: {
        type: 'string'
      }
    }

    const schema: ISchema.IDefinition<IExample3Definition, IExample3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        summary,
        description,
        value,
        externalValue
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: IExample3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
