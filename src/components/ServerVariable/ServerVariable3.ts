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
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { ServerVariable as ServerVariableBase } from './ServerVariable'
import { IServerVariable3, IServerVariable3Definition, IServerVariable3SchemaProcessor, IServerVariableValidatorsMap3 as IValidatorsMap } from './IServerVariable'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IServerVariable3Definition, IServerVariable3> | null = null

export class ServerVariable extends ServerVariableBase implements IServerVariable3 {
  public extensions: Record<string, any> = {}
  public enum?: string[]
  public default!: string
  public description?: string

  constructor (definition: IServerVariable3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SERVER_VARIABLE3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#server-variable-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#server-variable-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#server-variable-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-variable-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IServerVariable3SchemaProcessor): ISDSchemaDefinition<IServerVariable3Definition, IServerVariable3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IServerVariable3Definition, IServerVariable3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators._enum,
        validators._default,
        validators.description
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IServerVariable3Definition> | ServerVariable | undefined): ServerVariable {
    if (definition instanceof ServerVariable) {
      return new ServerVariable(Object.assign({}, definition as unknown) as IServerVariable3Definition)
    } else {
      return new ServerVariable(Object.assign({
        default: ''
      }, definition) as IServerVariable3Definition)
    }
  }

  static async createAsync (definition?: Partial<IServerVariable3Definition> | ServerVariable | string | undefined): Promise<ServerVariable> {
    if (definition instanceof ServerVariable) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IServerVariable3Definition>)
    }
  }

  static createDefinition<T extends Partial<IServerVariable3Definition>> (definition?: T | undefined): IServerVariable3Definition & T {
    return Object.assign({
      default: ''
    }, definition) as IServerVariable3Definition & T
  }

  static validate (definition: IServerVariable3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IServerVariable3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
    _enum: {
      name: 'enum',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    _default: {
      name: 'default',
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
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
