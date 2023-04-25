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
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import { isUrl } from '../validations'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IServer3Definition, I.IServer3> | null = null

interface IValidatorsMap {
  url: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  variables: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IServerVariable3Definition, I.IServerVariable3>>>
}

export class Server extends EnforcerComponent<I.IServer3Definition> implements I.IServer3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IServer3Definition, version?: IVersion) {
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
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-object'
  }

  static getSchemaDefinition (_data: I.IServerSchemaProcessor): ISchema.ISchemaDefinition<I.IServer3Definition, I.IServer3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IServer3Definition, I.IServer3> = {
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

  static create (definition?: Partial<I.IServer3Definition> | Server | undefined): Server {
    if (definition instanceof Server) {
      return new Server(Object.assign({}, definition as unknown) as I.IServer3Definition)
    } else {
      return new Server(Object.assign({
        url: ''
      }, definition) as I.IServer3Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IServer3Definition> | Server | string | undefined): Promise<Server> {
    if (definition instanceof Server) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IServer3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IServer3Definition>> (definition?: T | undefined): I.IServer3Definition & T {
    return Object.assign({
      url: ''
    }, definition) as I.IServer3Definition & T
  }

  static validate (definition: I.IServer3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IServer3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get url (): string {
    return this.getProperty('url')
  }

  set url (value: string) {
    this.setProperty('url', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get variables (): Record<string, I.IServerVariable3> | undefined {
    return this.getProperty('variables')
  }

  set variables (value: Record<string, I.IServerVariable3> | undefined) {
    this.setProperty('variables', value)
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

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
          component: I.ServerVariable3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
