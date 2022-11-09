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
  Contact2,
  IContact2,
  IContact2Definition,
  IInfo2,
  IInfo2Definition,
  ILicense2,
  ILicense2Definition,
  License2
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IInfo2Definition, IInfo2> | null = null

export class Info extends EnforcerComponent implements IInfo2 {
  [extension: `x-${string}`]: any
  title!: string
  description?: string
  termsOfService?: string
  contact?: IContact2
  license?: ILicense2
  version!: string

  constructor (definition: IInfo2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#info-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchema (_data: ISchemaProcessor): ISchema.IDefinition<IInfo2Definition, IInfo2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const title: ISchema.IProperty<ISchema.IString> = {
      name: 'title',
      required: true,
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

    const termsOfService: ISchema.IProperty<ISchema.IString> = {
      name: 'termsOfService',
      schema: {
        type: 'string'
      }
    }

    const contact: ISchema.IProperty<ISchema.IComponent<IContact2Definition, IContact2>> = {
      name: 'contact',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Contact2
      }
    }

    const license: ISchema.IProperty<ISchema.IComponent<ILicense2Definition, ILicense2>> = {
      name: 'license',
      schema: {
        type: 'component',
        allowsRef: false,
        component: License2
      }
    }

    const version: ISchema.IProperty<ISchema.IString> = {
      name: 'version',
      required: true,
      schema: {
        type: 'string'
      }
    }

    const result: ISchema.IDefinition<IInfo2Definition, IInfo2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        title,
        description,
        termsOfService,
        contact,
        license,
        version
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IInfo2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
