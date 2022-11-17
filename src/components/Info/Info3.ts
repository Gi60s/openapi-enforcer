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
import { IInfoSchemaProcessor } from '../IInternalTypes'
import {
  Contact3,
  IContact3,
  IContact3Definition,
  IInfo3,
  IInfo3Definition,
  ILicense3,
  ILicense3Definition,
  License3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IInfo3Definition, IInfo3> | null = null

export class Info extends EnforcerComponent implements IInfo3 {
  [extension: `x-${string}`]: any
  title!: string
  description?: string
  termsOfService?: string
  contact?: IContact3
  license?: ILicense3
  version!: string

  constructor (definition: IInfo3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#info-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#info-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#info-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#info-object'
  }

  static getSchema (_data: IInfoSchemaProcessor): ISchema.IDefinition<IInfo3Definition, IInfo3> {
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

    const contact: ISchema.IProperty<ISchema.IComponent<IContact3Definition, IContact3>> = {
      name: 'contact',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Contact3
      }
    }

    const license: ISchema.IProperty<ISchema.IComponent<ILicense3Definition, ILicense3>> = {
      name: 'license',
      schema: {
        type: 'component',
        allowsRef: false,
        component: License3
      }
    }

    const version: ISchema.IProperty<ISchema.IString> = {
      name: 'version',
      required: true,
      schema: {
        type: 'string'
      }
    }

    const result: ISchema.IDefinition<IInfo3Definition, IInfo3> = {
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

  static validate (definition: IInfo3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
