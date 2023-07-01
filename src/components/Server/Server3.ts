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
import { ServerVariable3, IServerVariable3 } from '../ServerVariable'
import { Server as ServerBase } from './Server'
import { IServer3, IServer3Definition, IServer3SchemaProcessor, IServerValidatorsMap3 as IValidatorsMap } from './IServer'
// <!# Custom Content Begin: HEADER #!>
import { isUrl } from '../validations'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IServer3Definition, IServer3> | null = null

export class Server extends ServerBase implements IServer3 {
  public extensions: Record<string, any> = {}
  public url!: string
  public description?: string
  public variables?: Record<string, IServerVariable3>

  constructor (definition: IServer3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SERVER3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#server-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#server-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#server-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IServer3SchemaProcessor): ISDSchemaDefinition<IServer3Definition, IServer3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IServer3Definition, IServer3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.url,
        validators.description,
        validators.variables
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.validate = function (data): void {
      isUrl('url', data)
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IServer3Definition> | Server | undefined): Server {
    if (definition instanceof Server) {
      return new Server(Object.assign({}, definition as unknown) as IServer3Definition)
    } else {
      return new Server(Object.assign({
        url: ''
      }, definition) as IServer3Definition)
    }
  }

  static async createAsync (definition?: Partial<IServer3Definition> | Server | string | undefined): Promise<Server> {
    if (definition instanceof Server) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IServer3Definition>)
    }
  }

  static createDefinition<T extends Partial<IServer3Definition>> (definition?: T | undefined): IServer3Definition & T {
    return Object.assign({
      url: ''
    }, definition) as IServer3Definition & T
  }

  static validate (definition: IServer3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IServer3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

function getValidatorsMap (): IValidatorsMap {
  return {
    url: {
      name: 'url',
      required: true,
      schema: {
        type: 'string'
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    variables: {
      name: 'variables',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: ServerVariable3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
