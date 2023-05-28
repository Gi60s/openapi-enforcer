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
import { OAuthFlows3a, IOAuthFlows3a } from '../OAuthFlows'
import { SecurityScheme as SecuritySchemeBase } from './SecurityScheme'
import { ISecurityScheme3a, ISecurityScheme3aDefinition, ISecurityScheme3aSchemaProcessor, ISecuritySchemeValidatorsMap3a as IValidatorsMap } from './ISecurityScheme'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ISecurityScheme3aDefinition, ISecurityScheme3a> | null = null

export class SecurityScheme extends SecuritySchemeBase implements ISecurityScheme3a {
  public extensions: Record<string, any> = {}
  public type?: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
  public description?: string
  public name?: string
  public in?: 'query' | 'header' | 'cookie'
  public scheme?: string
  public bearerFormat?: string
  public flows?: IOAuthFlows3a
  public openIdConnectUrl?: string

  constructor (definition: ISecurityScheme3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SECURITY_SCHEME3A'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#security-scheme-object'
  }

  static getSchemaDefinition (_data: ISecurityScheme3aSchemaProcessor): ISDSchemaDefinition<ISecurityScheme3aDefinition, ISecurityScheme3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<ISecurityScheme3aDefinition, ISecurityScheme3a> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.type,
        validators.description,
        validators.name,
        validators._in,
        validators.scheme,
        validators.bearerFormat,
        validators.flows,
        validators.openIdConnectUrl
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<ISecurityScheme3aDefinition> | SecurityScheme | undefined): SecurityScheme {
    return new SecurityScheme(Object.assign({}, definition) as ISecurityScheme3aDefinition)
  }

  static async createAsync (definition?: Partial<ISecurityScheme3aDefinition> | SecurityScheme | string | undefined): Promise<SecurityScheme> {
    if (definition instanceof SecurityScheme) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ISecurityScheme3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<ISecurityScheme3aDefinition>> (definition?: T | undefined): ISecurityScheme3aDefinition & T {
    return Object.assign({}, definition) as ISecurityScheme3aDefinition & T
  }

  static validate (definition: ISecurityScheme3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ISecurityScheme3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
      schema: {
        type: 'string',
        enum: ['apiKey', 'http', 'oauth2', 'openIdConnect']
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
        enum: ['query', 'header', 'cookie']
      }
    },
    scheme: {
      name: 'scheme',
      schema: {
        type: 'string'
      }
    },
    bearerFormat: {
      name: 'bearerFormat',
      schema: {
        type: 'string'
      }
    },
    flows: {
      name: 'flows',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlows3a
      }
    },
    openIdConnectUrl: {
      name: 'openIdConnectUrl',
      schema: {
        type: 'string'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
