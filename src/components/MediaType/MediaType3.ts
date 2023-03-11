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
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IMediaType3Definition, I.IMediaType3> | null = null

interface IValidatorsMap {
  schema: ISchema.IProperty<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>
  example: ISchema.IProperty<any>
  examples: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IExample3Definition, I.IExample3>>>
  encoding: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IEncoding3Definition, I.IEncoding3>>>
}

export class MediaType extends EnforcerComponent<I.IMediaType3Definition> implements I.IMediaType3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IMediaType3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'MEDIA_TYPE3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#media-type-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#media-type-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#media-type-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#media-type-object'
  }

  static getSchemaDefinition (_data: I.IMediaTypeSchemaProcessor): ISchema.ISchemaDefinition<I.IMediaType3Definition, I.IMediaType3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IMediaType3Definition, I.IMediaType3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.schema,
        validators.example,
        validators.examples,
        validators.encoding
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IMediaType3Definition> | MediaType | undefined): MediaType {
    return new MediaType(Object.assign({}, definition) as I.IMediaType3Definition)
  }

  static async createAsync (definition?: Partial<I.IMediaType3Definition> | MediaType | string | undefined): Promise<MediaType> {
    if (definition instanceof MediaType) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IMediaType3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IMediaType3Definition>> (definition?: T | undefined): I.IMediaType3Definition & T {
    return Object.assign({}, definition) as I.IMediaType3Definition & T
  }

  static validate (definition: I.IMediaType3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IMediaType3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get schema (): I.ISchema3 | undefined {
    return this[GetProperty]('schema')
  }

  set schema (value: I.ISchema3 | undefined) {
    this[SetProperty]('schema', value)
  }

  get example (): any | undefined {
    return this[GetProperty]('example')
  }

  set example (value: any | undefined) {
    this[SetProperty]('example', value)
  }

  get examples (): Record<string, I.IExample3> | undefined {
    return this[GetProperty]('examples')
  }

  set examples (value: Record<string, I.IExample3> | undefined) {
    this[SetProperty]('examples', value)
  }

  get encoding (): Record<string, I.IEncoding3> | undefined {
    return this[GetProperty]('encoding')
  }

  set encoding (value: Record<string, I.IEncoding3> | undefined) {
    this[SetProperty]('encoding', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    schema: {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: I.Schema3
      }
    },
    example: {
      name: 'example',
      schema: {
        type: 'any'
      }
    },
    examples: {
      name: 'examples',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: I.Example3
        }
      }
    },
    encoding: {
      name: 'encoding',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: I.Encoding3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
