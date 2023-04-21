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
import { EnforcerComponent, SetProperty, GetProperty } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import { validate } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IContact3Definition, I.IContact3> | null = null

interface IValidatorsMap {
  name: ISchema.IProperty<ISchema.IString>
  url: ISchema.IProperty<ISchema.IString>
  email: ISchema.IProperty<ISchema.IString>
}

export class Contact extends EnforcerComponent<I.IContact3Definition> implements I.IContact3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IContact3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'CONTACT3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#contact-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#contact-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#contact-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#contact-object'
  }

  static getSchemaDefinition (_data: I.IContactSchemaProcessor): ISchema.ISchemaDefinition<I.IContact3Definition, I.IContact3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IContact3Definition, I.IContact3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.name,
        validators.url,
        validators.email
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.validate = (data) => {
      validate(data)
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IContact3Definition> | Contact | undefined): Contact {
    return new Contact(Object.assign({}, definition) as I.IContact3Definition)
  }

  static async createAsync (definition?: Partial<I.IContact3Definition> | Contact | string | undefined): Promise<Contact> {
    if (definition instanceof Contact) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IContact3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IContact3Definition>> (definition?: T | undefined): I.IContact3Definition & T {
    return Object.assign({}, definition) as I.IContact3Definition & T
  }

  static validate (definition: I.IContact3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IContact3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get name (): string | undefined {
    return this[GetProperty]('name')
  }

  set name (value: string | undefined) {
    this[SetProperty]('name', value)
  }

  get url (): string | undefined {
    return this[GetProperty]('url')
  }

  set url (value: string | undefined) {
    this[SetProperty]('url', value)
  }

  get email (): string | undefined {
    return this[GetProperty]('email')
  }

  set email (value: string | undefined) {
    this[SetProperty]('email', value)
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    name: {
      name: 'name',
      schema: {
        type: 'string'
      }
    },
    url: {
      name: 'url',
      schema: {
        type: 'string'
      }
    },
    email: {
      name: 'email',
      schema: {
        type: 'string'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
