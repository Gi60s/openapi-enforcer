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
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ILicenseSchemaProcessor } from '../IInternalTypes'
import {
  ILicense2,
  ILicense2Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<ILicense2Definition, ILicense2> | null = null

export class License extends EnforcerComponent<ILicense2Definition, ILicense2> implements ILicense2 {
  [extension: `x${string}`]: any

  constructor (definition: ILicense2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#license-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: ILicenseSchemaProcessor): ISchema.ISchemaDefinition<ILicense2Definition, ILicense2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const name: ISchema.IProperty<ISchema.IString> = {
      name: 'name',
      required: true,
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

    const result: ISchema.ISchemaDefinition<ILicense2Definition, ILicense2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        name,
        url
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: ILicense2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get name (): string {
    return this.getProperty('name')
  }

  set name (value: string) {
    this.setProperty('name', value)
  }

  get url (): string | undefined {
    return this.getProperty('url')
  }

  set url (value: string | undefined) {
    this.setProperty('url', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
