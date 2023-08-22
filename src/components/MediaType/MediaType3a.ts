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
import { Schema3a, ISchema3a } from '../Schema'
import { Example3a, IExample3a } from '../Example'
import { Encoding3a, IEncoding3a } from '../Encoding'
import { MediaType as MediaTypeBase } from './MediaType'
import { IMediaType3a, IMediaType3aDefinition, IMediaType3aSchemaProcessor, IMediaTypeValidatorsMap3a as IValidatorsMap } from './IMediaType'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IMediaType3aDefinition, IMediaType3a> | null = null

export class MediaType extends MediaTypeBase implements IMediaType3a {
  public extensions: Record<string, any> = {}
  public schema?: ISchema3a
  public example?: any
  public examples?: Record<string, IExample3a>
  public encoding?: Record<string, IEncoding3a>

  constructor (definition: IMediaType3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'mediaType'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#media-type-object'
  }

  static getSchemaDefinition (_data: IMediaType3aSchemaProcessor): ISDSchemaDefinition<IMediaType3aDefinition, IMediaType3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IMediaType3aDefinition, IMediaType3a> = {
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

  static create (definition?: Partial<IMediaType3aDefinition> | MediaType | undefined): MediaType {
    return new MediaType(Object.assign({}, definition) as IMediaType3aDefinition)
  }

  static async createAsync (definition?: Partial<IMediaType3aDefinition> | MediaType | string | undefined): Promise<MediaType> {
    if (definition instanceof MediaType) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IMediaType3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IMediaType3aDefinition>> (definition?: T | undefined): IMediaType3aDefinition & T {
    return Object.assign({}, definition) as IMediaType3aDefinition & T
  }

  static validate (definition: IMediaType3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IMediaType3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
        component: Schema3a
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
          component: Example3a
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
          component: Encoding3a
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
