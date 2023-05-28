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
import { License as LicenseBase } from './License'
import { ILicense3, ILicense3Definition, ILicense3SchemaProcessor, ILicenseValidatorsMap3 as IValidatorsMap } from './ILicense'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ILicense3Definition, ILicense3> | null = null

export class License extends LicenseBase implements ILicense3 {
  public extensions: Record<string, any> = {}
  public name!: string
  public url?: string

  constructor (definition: ILicense3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'LICENSE3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#license-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#license-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#license-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#license-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: ILicense3SchemaProcessor): ISDSchemaDefinition<ILicense3Definition, ILicense3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<ILicense3Definition, ILicense3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.name,
        validators.url
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<ILicense3Definition> | License | undefined): License {
    if (definition instanceof License) {
      return new License(Object.assign({}, definition as unknown) as ILicense3Definition)
    } else {
      return new License(Object.assign({
        name: ''
      }, definition) as ILicense3Definition)
    }
  }

  static async createAsync (definition?: Partial<ILicense3Definition> | License | string | undefined): Promise<License> {
    if (definition instanceof License) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ILicense3Definition>)
    }
  }

  static createDefinition<T extends Partial<ILicense3Definition>> (definition?: T | undefined): ILicense3Definition & T {
    return Object.assign({
      name: ''
    }, definition) as ILicense3Definition & T
  }

  static validate (definition: ILicense3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ILicense3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

function getValidatorsMap (): IValidatorsMap {
  return {
    name: {
      name: 'name',
      required: true,
      schema: {
        type: 'string'
      }
    },
    url: {
      name: 'url',
      schema: {
        type: 'string'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
