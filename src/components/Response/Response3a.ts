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
import { MediaType3a, IMediaType3a } from '../MediaType'
import { Link3a, ILink3a } from '../Link'
import { Response as ResponseBase } from './Response'
import { IResponse3a, IResponse3aDefinition, IResponse3aSchemaProcessor, IResponseValidatorsMap3a as IValidatorsMap } from './IResponse'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IResponse3aDefinition, IResponse3a> | null = null

export class Response extends ResponseBase implements IResponse3a {
  public extensions: Record<string, any> = {}
  public description!: string
  public headers?: Record<string, IHeader3a>
  public content?: Record<string, IMediaType3a>
  public links?: Record<string, ILink3a>

  constructor (definition: IResponse3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'RESPONSE3A'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#response-object'
  }

  static getSchemaDefinition (_data: IResponse3aSchemaProcessor): ISDSchemaDefinition<IResponse3aDefinition, IResponse3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IResponse3aDefinition, IResponse3a> = {
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

  static create (definition?: Partial<IResponse3aDefinition> | Response | undefined): Response {
    if (definition instanceof Response) {
      return new Response(Object.assign({}, definition as unknown) as IResponse3aDefinition)
    } else {
      return new Response(Object.assign({
        description: ''
      }, definition) as IResponse3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<IResponse3aDefinition> | Response | string | undefined): Promise<Response> {
    if (definition instanceof Response) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IResponse3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IResponse3aDefinition>> (definition?: T | undefined): IResponse3aDefinition & T {
    return Object.assign({
      description: ''
    }, definition) as IResponse3aDefinition & T
  }

  static validate (definition: IResponse3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IResponse3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
          component: Header3a
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
          component: MediaType3a
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
          component: Link3a
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
