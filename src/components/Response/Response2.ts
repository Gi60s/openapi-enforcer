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
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as Icsd from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

type IValidatorsMap = I.IResponseValidatorsMap2

let cachedSchema: Icsd.ISchemaDefinition<I.IResponse2Definition, I.IResponse2> | null = null

export class Response extends EnforcerComponent<I.IResponse2Definition> implements I.IResponse2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IResponse2Definition, version?: IVersion) {
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
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IResponseSchemaProcessor): Icsd.ISchemaDefinition<I.IResponse2Definition, I.IResponse2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: Icsd.ISchemaDefinition<I.IResponse2Definition, I.IResponse2> = {
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

  static create (definition?: Partial<I.IResponse2Definition> | Response | undefined): Response {
    if (definition instanceof Response) {
      return new Response(Object.assign({}, definition as unknown) as I.IResponse2Definition)
    } else {
      return new Response(Object.assign({
        description: ''
      }, definition) as I.IResponse2Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IResponse2Definition> | Response | string | undefined): Promise<Response> {
    if (definition instanceof Response) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IResponse2Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IResponse2Definition>> (definition?: T | undefined): I.IResponse2Definition & T {
    return Object.assign({
      description: ''
    }, definition) as I.IResponse2Definition & T
  }

  static validate (definition: I.IResponse2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IResponse2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get description (): string {
    return this.getProperty('description')
  }

  set description (value: string) {
    this.setProperty('description', value)
  }

  get schema (): I.ISchema2 | undefined {
    return this.getProperty('schema')
  }

  set schema (value: I.ISchema2 | undefined) {
    this.setProperty('schema', value)
  }

  get headers (): Record<string, I.IHeader2> | undefined {
    return this.getProperty('headers')
  }

  set headers (value: Record<string, I.IHeader2> | undefined) {
    this.setProperty('headers', value)
  }

  get examples (): I.IExample2 | undefined {
    return this.getProperty('examples')
  }

  set examples (value: I.IExample2 | undefined) {
    this.setProperty('examples', value)
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
    schema: {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: I.Schema2
      }
    },
    headers: {
      name: 'headers',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: I.Header2
        }
      }
    },
    examples: {
      name: 'examples',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Example2
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
