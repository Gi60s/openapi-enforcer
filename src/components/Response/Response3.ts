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
import { loadAsync, loadAsyncAndThrow } from '../../Loader/Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IResponse3Definition, I.IResponse3> | null = null

interface IValidatorsMap {
  description: ISchema.IProperty<ISchema.IString>
  headers: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IHeader3Definition, I.IHeader3>>>
  content: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IMediaType3Definition, I.IMediaType3>>>
  links: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ILink3Definition, I.ILink3>>>
}

export class Response extends EnforcerComponent<I.IResponse3Definition> implements I.IResponse3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IResponse3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'RESPONSE3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#response-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#response-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#response-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#response-object'
  }

  static getSchemaDefinition (_data: I.IResponseSchemaProcessor): ISchema.ISchemaDefinition<I.IResponse3Definition, I.IResponse3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IResponse3Definition, I.IResponse3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.description,
        validators.headers,
        validators.content,
        validators.links
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IResponse3Definition> | Response | undefined): Response {
    if (definition instanceof Response) {
      return new Response(Object.assign({}, definition))
    } else {
      return new Response(Object.assign({
        description: ''
      }, definition) as I.IResponse3Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IResponse3Definition> | Response | string | undefined): Promise<Response> {
    if (definition instanceof Response) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IResponse3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IResponse3Definition>> (definition?: T | undefined): I.IResponse3Definition & T {
    return Object.assign({
      description: ''
    }, definition) as I.IResponse3Definition & T
  }

  static validate (definition: I.IResponse3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IResponse3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get description (): string {
    return this[GetProperty]('description')
  }

  set description (value: string) {
    this[SetProperty]('description', value)
  }

  get headers (): Record<string, I.IHeader3> | undefined {
    return this[GetProperty]('headers')
  }

  set headers (value: Record<string, I.IHeader3> | undefined) {
    this[SetProperty]('headers', value)
  }

  get content (): Record<string, I.IMediaType3> | undefined {
    return this[GetProperty]('content')
  }

  set content (value: Record<string, I.IMediaType3> | undefined) {
    this[SetProperty]('content', value)
  }

  get links (): Record<string, I.ILink3> | undefined {
    return this[GetProperty]('links')
  }

  set links (value: Record<string, I.ILink3> | undefined) {
    this[SetProperty]('links', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    description: {
      name: 'description',
      required: true,
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
          component: I.Header3
        }
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
    links: {
      name: 'links',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: I.Link3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
