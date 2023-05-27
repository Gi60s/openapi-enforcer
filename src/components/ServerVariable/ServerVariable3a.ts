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
import { IServerVariable3a, IServerVariable3aDefinition, IServerVariable3aSchemaProcessor, IServerVariableValidatorsMap3a as IValidatorsMap } from './IServerVariable'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IServerVariable3aDefinition, IServerVariable3a> | null = null

export class ServerVariable extends ServerVariableBase implements IServerVariable3a {
  public extensions: Record<string, any> = {}
  public enum?: string[]
  public default!: string
  public description?: string

  constructor (definition: IServerVariable3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SERVER_VARIABLE3A'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#server-variable-object'
  }

  static getSchemaDefinition (_data: IServerVariable3aSchemaProcessor): ISDSchemaDefinition<IServerVariable3aDefinition, IServerVariable3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IServerVariable3aDefinition, IServerVariable3a> = {
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

  static create (definition?: Partial<IServerVariable3aDefinition> | ServerVariable | undefined): ServerVariable {
    if (definition instanceof ServerVariable) {
      return new ServerVariable(Object.assign({}, definition as unknown) as IServerVariable3aDefinition)
    } else {
      return new ServerVariable(Object.assign({
        default: ''
      }, definition) as IServerVariable3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<IServerVariable3aDefinition> | ServerVariable | string | undefined): Promise<ServerVariable> {
    if (definition instanceof ServerVariable) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IServerVariable3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IServerVariable3aDefinition>> (definition?: T | undefined): IServerVariable3aDefinition & T {
    return Object.assign({
      default: ''
    }, definition) as IServerVariable3aDefinition & T
  }

  static validate (definition: IServerVariable3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IServerVariable3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
