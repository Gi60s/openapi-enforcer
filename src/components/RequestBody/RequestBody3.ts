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

let cachedSchema: ISchema.ISchemaDefinition<I.IRequestBody3Definition, I.IRequestBody3> | null = null

interface IValidatorsMap {
  description: ISchema.IProperty<ISchema.IString>
  content: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IMediaType3Definition, I.IMediaType3>>>
  required: ISchema.IProperty<ISchema.IBoolean>
}

export class RequestBody extends EnforcerComponent<I.IRequestBody3Definition> implements I.IRequestBody3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IRequestBody3Definition, version?: IVersion) {
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
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#request-body-object'
  }

  static getSchemaDefinition (_data: I.IRequestBodySchemaProcessor): ISchema.ISchemaDefinition<I.IRequestBody3Definition, I.IRequestBody3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IRequestBody3Definition, I.IRequestBody3> = {
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

  static create (definition?: Partial<I.IRequestBody3Definition> | RequestBody | undefined): RequestBody {
    return new RequestBody(Object.assign({}, definition) as I.IRequestBody3Definition)
  }

  static async createAsync (definition?: Partial<I.IRequestBody3Definition> | RequestBody | string | undefined): Promise<RequestBody> {
    if (definition instanceof RequestBody) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IRequestBody3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IRequestBody3Definition>> (definition?: T | undefined): I.IRequestBody3Definition & T {
    return Object.assign({}, definition) as I.IRequestBody3Definition & T
  }

  static validate (definition: I.IRequestBody3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IRequestBody3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get content (): Record<string, I.IMediaType3> | undefined {
    return this[GetProperty]('content')
  }

  set content (value: Record<string, I.IMediaType3> | undefined) {
    this[SetProperty]('content', value)
  }

  get required (): boolean | undefined {
    return this[GetProperty]('required')
  }

  set required (value: boolean | undefined) {
    this[SetProperty]('required', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

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
          component: I.MediaType3
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
