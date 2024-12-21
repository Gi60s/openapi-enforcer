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
import { Schema3, ISchema3 } from '../Schema'
import { Example3, IExample3 } from '../Example'
import { Encoding3, IEncoding3 } from '../Encoding'
import { MediaType as MediaTypeBase } from './MediaType'
import { IMediaType3, IMediaType3Definition, IMediaType3SchemaProcessor, IMediaTypeValidatorsMap3 as IValidatorsMap } from './IMediaType'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IMediaType3Definition, IMediaType3> | null = null

export class MediaType extends MediaTypeBase implements IMediaType3 {
  public extensions: Record<string, any> = {}
  public schema?: ISchema3
  public example?: any
  public examples?: Record<string, IExample3>
  public encoding?: Record<string, IEncoding3>

  constructor (definition: IMediaType3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'mediaType'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#media-type-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#media-type-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#media-type-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#media-type-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IMediaType3SchemaProcessor): ISDSchemaDefinition<IMediaType3Definition, IMediaType3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IMediaType3Definition, IMediaType3> = {
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

  static create (definition?: Partial<IMediaType3Definition> | MediaType | undefined): MediaType {
    return new MediaType(Object.assign({}, definition) as IMediaType3Definition)
  }

  static async createAsync (definition?: Partial<IMediaType3Definition> | MediaType | string | undefined): Promise<MediaType> {
    if (definition instanceof MediaType) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IMediaType3Definition>)
    }
  }

  static createDefinition<T extends Partial<IMediaType3Definition>> (definition?: T | undefined): IMediaType3Definition & T {
    return Object.assign({}, definition) as IMediaType3Definition & T
  }

  static validate (definition: IMediaType3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IMediaType3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
    schema: {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3
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
          component: Example3
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
          component: Encoding3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
