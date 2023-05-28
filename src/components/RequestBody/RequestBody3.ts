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
import { RequestBody as RequestBodyBase } from './RequestBody'
import { IRequestBody3, IRequestBody3Definition, IRequestBody3SchemaProcessor, IRequestBodyValidatorsMap3 as IValidatorsMap } from './IRequestBody'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IRequestBody3Definition, IRequestBody3> | null = null

export class RequestBody extends RequestBodyBase implements IRequestBody3 {
  public extensions: Record<string, any> = {}
  public description?: string
  public content?: Record<string, IMediaType3>
  public required?: boolean

  constructor (definition: IRequestBody3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'REQUEST_BODY3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#request-body-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#request-body-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#request-body-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#request-body-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IRequestBody3SchemaProcessor): ISDSchemaDefinition<IRequestBody3Definition, IRequestBody3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IRequestBody3Definition, IRequestBody3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.description,
        validators.content,
        validators.required
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IRequestBody3Definition> | RequestBody | undefined): RequestBody {
    return new RequestBody(Object.assign({}, definition) as IRequestBody3Definition)
  }

  static async createAsync (definition?: Partial<IRequestBody3Definition> | RequestBody | string | undefined): Promise<RequestBody> {
    if (definition instanceof RequestBody) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IRequestBody3Definition>)
    }
  }

  static createDefinition<T extends Partial<IRequestBody3Definition>> (definition?: T | undefined): IRequestBody3Definition & T {
    return Object.assign({}, definition) as IRequestBody3Definition & T
  }

  static validate (definition: IRequestBody3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IRequestBody3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    content: {
      name: 'content',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: MediaType3
        }
      }
    },
    required: {
      name: 'required',
      schema: {
        type: 'boolean'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
