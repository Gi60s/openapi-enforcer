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

/* eslint-disable import/no-duplicates */
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Contact as ContactBase } from './Contact'
import { IContact3, IContact3Definition, IContact3SchemaProcessor, IContactValidatorsMap3 as IValidatorsMap } from './IContact'
// <!# Custom Content Begin: HEADER #!>
import { validate } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IContact3Definition, IContact3> | null = null

export class Contact extends ContactBase implements IContact3 {
  public extensions: Record<string, any> = {}
  public name?: string
  public url?: string
  public email?: string

  constructor (definition: IContact3Definition, version?: IVersion) {
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
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#contact-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IContact3SchemaProcessor): ISDSchemaDefinition<IContact3Definition, IContact3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IContact3Definition, IContact3> = {
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

  static create (definition?: Partial<IContact3Definition> | Contact | undefined): Contact {
    return new Contact(Object.assign({}, definition) as IContact3Definition)
  }

  static async createAsync (definition?: Partial<IContact3Definition> | Contact | string | undefined): Promise<Contact> {
    if (definition instanceof Contact) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IContact3Definition>)
    }
  }

  static createDefinition<T extends Partial<IContact3Definition>> (definition?: T | undefined): IContact3Definition & T {
    return Object.assign({}, definition) as IContact3Definition & T
  }

  static validate (definition: IContact3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IContact3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

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
