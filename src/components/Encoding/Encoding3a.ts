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
import { Header3a, IHeader3a } from '../Header'
import { Encoding as EncodingBase } from './Encoding'
import { IEncoding3a, IEncoding3aDefinition, IEncoding3aSchemaProcessor, IEncodingValidatorsMap3a as IValidatorsMap } from './IEncoding'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IEncoding3aDefinition, IEncoding3a> | null = null

export class Encoding extends EncodingBase implements IEncoding3a {
  public extensions: Record<string, any> = {}
  public contentType?: string
  public headers?: Record<string, IHeader3a>
  public style?: string
  public explode?: boolean
  public allowReserved?: boolean

  constructor (definition: IEncoding3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'encoding'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#encoding-object'
  }

  static getSchemaDefinition (_data: IEncoding3aSchemaProcessor): ISDSchemaDefinition<IEncoding3aDefinition, IEncoding3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IEncoding3aDefinition, IEncoding3a> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.contentType,
        validators.headers,
        validators.style,
        validators.explode,
        validators.allowReserved
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IEncoding3aDefinition> | Encoding | undefined): Encoding {
    return new Encoding(Object.assign({}, definition) as IEncoding3aDefinition)
  }

  static async createAsync (definition?: Partial<IEncoding3aDefinition> | Encoding | string | undefined): Promise<Encoding> {
    if (definition instanceof Encoding) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IEncoding3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IEncoding3aDefinition>> (definition?: T | undefined): IEncoding3aDefinition & T {
    return Object.assign({}, definition) as IEncoding3aDefinition & T
  }

  static validate (definition: IEncoding3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IEncoding3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
    contentType: {
      name: 'contentType',
      schema: {
        type: 'string'
      }
    },
    headers: {
      name: 'headers',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Header3a
        }
      }
    },
    style: {
      name: 'style',
      schema: {
        type: 'string'
      }
    },
    explode: {
      name: 'explode',
      schema: {
        type: 'boolean'
      }
    },
    allowReserved: {
      name: 'allowReserved',
      schema: {
        type: 'boolean'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
