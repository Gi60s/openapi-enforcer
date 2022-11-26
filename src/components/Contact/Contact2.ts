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
import { IContactSchemaProcessor } from '../IInternalTypes'
import {
  IContact2,
  IContact2Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { after } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IContact2Definition, IContact2> | null = null

export class Contact extends EnforcerComponent<IContact2Definition, IContact2> implements IContact2 {
  [extension: `x${string}`]: any

  constructor (definition: IContact2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#contact-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: IContactSchemaProcessor): ISchema.ISchemaDefinition<IContact2Definition, IContact2> {
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

    const result: ISchema.ISchemaDefinition<IContact2Definition, IContact2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        name,
        url,
        email
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.after = after
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IContact2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get name (): string | undefined {
    return this.getProperty('name')
  }

  set name (value: string | undefined) {
    this.setProperty('name', value)
  }

  get url (): string | undefined {
    return this.getProperty('url')
  }

  set url (value: string | undefined) {
    this.setProperty('url', value)
  }

  get email (): string | undefined {
    return this.getProperty('email')
  }

  set email (value: string | undefined) {
    this.setProperty('email', value)
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
