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
import { Contact3a, IContact3a } from '../Contact'
import { License3a, ILicense3a } from '../License'
import { Info as InfoBase } from './Info'
import { IInfo3a, IInfo3aDefinition, IInfo3aSchemaProcessor, IInfoValidatorsMap3a as IValidatorsMap } from './IInfo'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IInfo3aDefinition, IInfo3a> | null = null

export class Info extends InfoBase implements IInfo3a {
  public extensions: Record<string, any> = {}
  public title!: string
  public description?: string
  public termsOfService?: string
  public contact?: IContact3a
  public license?: ILicense3a
  public version!: string

  constructor (definition: IInfo3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'INFO3A'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#info-object'
  }

  static getSchemaDefinition (_data: IInfo3aSchemaProcessor): ISDSchemaDefinition<IInfo3aDefinition, IInfo3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IInfo3aDefinition, IInfo3a> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.title,
        validators.description,
        validators.termsOfService,
        validators.contact,
        validators.license,
        validators.version
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IInfo3aDefinition> | Info | undefined): Info {
    if (definition instanceof Info) {
      return new Info(Object.assign({}, definition as unknown) as IInfo3aDefinition)
    } else {
      return new Info(Object.assign({
        title: '',
        version: ''
      }, definition) as IInfo3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<IInfo3aDefinition> | Info | string | undefined): Promise<Info> {
    if (definition instanceof Info) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IInfo3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IInfo3aDefinition>> (definition?: T | undefined): IInfo3aDefinition & T {
    return Object.assign({
      title: '',
      version: ''
    }, definition) as IInfo3aDefinition & T
  }

  static validate (definition: IInfo3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IInfo3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
    title: {
      name: 'title',
      required: true,
      schema: {
        type: 'string'
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    termsOfService: {
      name: 'termsOfService',
      schema: {
        type: 'string'
      }
    },
    contact: {
      name: 'contact',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Contact3a
      }
    },
    license: {
      name: 'license',
      schema: {
        type: 'component',
        allowsRef: false,
        component: License3a
      }
    },
    version: {
      name: 'version',
      required: true,
      schema: {
        type: 'string'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
