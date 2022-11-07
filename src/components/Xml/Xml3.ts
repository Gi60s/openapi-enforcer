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
  IXml3,
  IXml3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IXml3Definition, IXml3> | null = null

export class Xml extends EnforcerComponent implements IXml3 {
  [extension: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean

  constructor (definition: IXml3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#xml-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#xml-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#xml-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#xml-object'
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<IXml3Definition, IXml3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const name: ISchema.IProperty<ISchema.IString> = {
      name: 'name',
      schema: {
        type: 'string'
      }
    }

    const namespace: ISchema.IProperty<ISchema.IString> = {
      name: 'namespace',
      schema: {
        type: 'string'
      }
    }

    const prefix: ISchema.IProperty<ISchema.IString> = {
      name: 'prefix',
      schema: {
        type: 'string'
      }
    }

    const attribute: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'attribute',
      schema: {
        type: 'boolean'
      }
    }

    const wrapped: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'wrapped',
      schema: {
        type: 'boolean'
      }
    }

    const schema: ISchema.IDefinition<IXml3Definition, IXml3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        name,
        namespace,
        prefix,
        attribute,
        wrapped
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: IXml3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
