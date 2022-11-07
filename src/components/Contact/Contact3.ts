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
  IContact3,
  IContact3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { after } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IContact3Definition, IContact3> | null = null

export class Contact extends EnforcerComponent implements IContact3 {
  [extension: `x-${string}`]: any
  name?: string
  url?: string
  email?: string

  constructor (definition: IContact3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#contact-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#contact-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#contact-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#contact-object'
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<IContact3Definition, IContact3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const name: ISchema.IProperty<ISchema.IString> = {
      name: 'name',
      schema: {
        type: 'string'
      }
    }

    const url: ISchema.IProperty<ISchema.IString> = {
      name: 'url',
      schema: {
        type: 'string'
      }
    }

    const email: ISchema.IProperty<ISchema.IString> = {
      name: 'email',
      schema: {
        type: 'string'
      }
    }

    const schema: ISchema.IDefinition<IContact3Definition, IContact3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        name,
        url,
        email
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    schema.after = after
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: IContact3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
