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

type IValidatorsMap = I.IServerVariableValidatorsMap3

let cachedSchema: Icsd.ISchemaDefinition<I.IServerVariable3Definition, I.IServerVariable3> | null = null

export class ServerVariable extends EnforcerComponent<I.IServerVariable3Definition> implements I.IServerVariable3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IServerVariable3Definition, version?: IVersion) {
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
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-variable-object'
  }

  static getSchemaDefinition (_data: I.IServerVariableSchemaProcessor): Icsd.ISchemaDefinition<I.IServerVariable3Definition, I.IServerVariable3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: Icsd.ISchemaDefinition<I.IServerVariable3Definition, I.IServerVariable3> = {
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

  static create (definition?: Partial<I.IServerVariable3Definition> | ServerVariable | undefined): ServerVariable {
    if (definition instanceof ServerVariable) {
      return new ServerVariable(Object.assign({}, definition as unknown) as I.IServerVariable3Definition)
    } else {
      return new ServerVariable(Object.assign({
        default: ''
      }, definition) as I.IServerVariable3Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IServerVariable3Definition> | ServerVariable | string | undefined): Promise<ServerVariable> {
    if (definition instanceof ServerVariable) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IServerVariable3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IServerVariable3Definition>> (definition?: T | undefined): I.IServerVariable3Definition & T {
    return Object.assign({
      default: ''
    }, definition) as I.IServerVariable3Definition & T
  }

  static validate (definition: I.IServerVariable3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IServerVariable3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get enum (): string[] | undefined {
    return this.getProperty('enum')
  }

  set enum (value: string[] | undefined) {
    this.setProperty('enum', value)
  }

  get default (): string {
    return this.getProperty('default')
  }

  set default (value: string) {
    this.setProperty('default', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

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
