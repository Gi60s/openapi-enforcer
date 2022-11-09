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
  IXml2,
  IXml2Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IXml2Definition, IXml2> | null = null

export class Xml extends EnforcerComponent implements IXml2 {
  [extension: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean

  constructor (definition: IXml2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#xml-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchema (_data: ISchemaProcessor): ISchema.IDefinition<IXml2Definition, IXml2> {
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

    const result: ISchema.IDefinition<IXml2Definition, IXml2> = {
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
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IXml2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
