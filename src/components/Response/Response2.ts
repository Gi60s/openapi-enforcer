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
import { Schema2, ISchema2 } from '../Schema'
import { Header2, IHeader2 } from '../Header'
import { Example2, IExample2 } from '../Example'
import { Response as ResponseBase } from './Response'
import { IResponse2, IResponse2Definition, IResponse2SchemaProcessor, IResponseValidatorsMap2 as IValidatorsMap } from './IResponse'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IResponse2Definition, IResponse2> | null = null

export class Response extends ResponseBase implements IResponse2 {
  public extensions: Record<string, any> = {}
  public description!: string
  public schema?: ISchema2
  public headers?: Record<string, IHeader2>
  public examples?: IExample2

  constructor (definition: IResponse2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'RESPONSE2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#response-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IResponse2SchemaProcessor): ISDSchemaDefinition<IResponse2Definition, IResponse2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IResponse2Definition, IResponse2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.description,
        validators.schema,
        validators.headers,
        validators.examples
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IResponse2Definition> | Response | undefined): Response {
    if (definition instanceof Response) {
      return new Response(Object.assign({}, definition as unknown) as IResponse2Definition)
    } else {
      return new Response(Object.assign({
        description: ''
      }, definition) as IResponse2Definition)
    }
  }

  static async createAsync (definition?: Partial<IResponse2Definition> | Response | string | undefined): Promise<Response> {
    if (definition instanceof Response) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IResponse2Definition>)
    }
  }

  static createDefinition<T extends Partial<IResponse2Definition>> (definition?: T | undefined): IResponse2Definition & T {
    return Object.assign({
      description: ''
    }, definition) as IResponse2Definition & T
  }

  static validate (definition: IResponse2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IResponse2Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
    schema: {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema2
      }
    },
    headers: {
      name: 'headers',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: Header2
        }
      }
    },
    examples: {
      name: 'examples',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Example2
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
