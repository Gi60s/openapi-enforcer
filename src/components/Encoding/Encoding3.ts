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
import { Encoding as EncodingBase } from './Encoding'
import { IEncoding3, IEncoding3Definition, IEncoding3SchemaProcessor, IEncodingValidatorsMap3 as IValidatorsMap } from './IEncoding'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IEncoding3Definition, IEncoding3> | null = null

export class Encoding extends EncodingBase implements IEncoding3 {
  public extensions: Record<string, any> = {}
  public contentType?: string
  public headers?: Record<string, IHeader3>
  public style?: string
  public explode?: boolean
  public allowReserved?: boolean

  constructor (definition: IEncoding3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'ENCODING3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#encoding-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#encoding-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#encoding-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#encoding-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IEncoding3SchemaProcessor): ISDSchemaDefinition<IEncoding3Definition, IEncoding3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IEncoding3Definition, IEncoding3> = {
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

  static create (definition?: Partial<IEncoding3Definition> | Encoding | undefined): Encoding {
    return new Encoding(Object.assign({}, definition) as IEncoding3Definition)
  }

  static async createAsync (definition?: Partial<IEncoding3Definition> | Encoding | string | undefined): Promise<Encoding> {
    if (definition instanceof Encoding) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IEncoding3Definition>)
    }
  }

  static createDefinition<T extends Partial<IEncoding3Definition>> (definition?: T | undefined): IEncoding3Definition & T {
    return Object.assign({}, definition) as IEncoding3Definition & T
  }

  static validate (definition: IEncoding3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IEncoding3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
          component: Header3
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
