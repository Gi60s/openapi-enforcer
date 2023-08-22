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
import { SecurityScheme as SecuritySchemeBase } from './SecurityScheme'
import { ISecurityScheme2, ISecurityScheme2Definition, ISecurityScheme2SchemaProcessor, ISecuritySchemeValidatorsMap2 as IValidatorsMap } from './ISecurityScheme'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ISecurityScheme2Definition, ISecurityScheme2> | null = null

export class SecurityScheme extends SecuritySchemeBase implements ISecurityScheme2 {
  public extensions: Record<string, any> = {}
  public type!: 'basic' | 'apiKey' | 'oauth2'
  public description?: string
  public name?: string
  public in?: 'query' | 'header'
  public flow?: 'implicit' | 'password' | 'application' | 'accessCode'
  public authorizationUrl?: string
  public tokenUrl?: string
  public scopes?: Record<string, string>

  constructor (definition: ISecurityScheme2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'securityScheme'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#security-scheme-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: ISecurityScheme2SchemaProcessor): ISDSchemaDefinition<ISecurityScheme2Definition, ISecurityScheme2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<ISecurityScheme2Definition, ISecurityScheme2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.type,
        validators.description,
        validators.name,
        validators._in,
        validators.flow,
        validators.authorizationUrl,
        validators.tokenUrl,
        validators.scopes
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<ISecurityScheme2Definition> | SecurityScheme | undefined): SecurityScheme {
    if (definition instanceof SecurityScheme) {
      return new SecurityScheme(Object.assign({}, definition as unknown) as ISecurityScheme2Definition)
    } else {
      return new SecurityScheme(Object.assign({
        type: 'basic'
      }, definition) as ISecurityScheme2Definition)
    }
  }

  static async createAsync (definition?: Partial<ISecurityScheme2Definition> | SecurityScheme | string | undefined): Promise<SecurityScheme> {
    if (definition instanceof SecurityScheme) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ISecurityScheme2Definition>)
    }
  }

  static createDefinition<T extends Partial<ISecurityScheme2Definition>> (definition?: T | undefined): ISecurityScheme2Definition & T {
    return Object.assign({
      type: 'basic'
    }, definition) as ISecurityScheme2Definition & T
  }

  static validate (definition: ISecurityScheme2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ISecurityScheme2Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
    type: {
      name: 'type',
      required: true,
      schema: {
        type: 'string',
        enum: ['basic', 'apiKey', 'oauth2']
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    name: {
      name: 'name',
      schema: {
        type: 'string'
      }
    },
    _in: {
      name: 'in',
      schema: {
        type: 'string',
        enum: ['query', 'header']
      }
    },
    flow: {
      name: 'flow',
      schema: {
        type: 'string',
        enum: ['implicit', 'password', 'application', 'accessCode']
      }
    },
    authorizationUrl: {
      name: 'authorizationUrl',
      schema: {
        type: 'string'
      }
    },
    tokenUrl: {
      name: 'tokenUrl',
      schema: {
        type: 'string'
      }
    },
    scopes: {
      name: 'scopes',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'string'
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
