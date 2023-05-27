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
import { OAuthFlow as OAuthFlowBase } from './OAuthFlow'
import { IOAuthFlow3, IOAuthFlow3Definition, IOAuthFlow3SchemaProcessor, IOAuthFlowValidatorsMap3 as IValidatorsMap } from './IOAuthFlow'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IOAuthFlow3Definition, IOAuthFlow3> | null = null

export class OAuthFlow extends OAuthFlowBase implements IOAuthFlow3 {
  public extensions: Record<string, any> = {}
  public authorizationUrl?: string
  public tokenUrl?: string
  public refreshUrl?: string
  public scopes?: Record<string, string>

  constructor (definition: IOAuthFlow3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'OAUTH_FLOW3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flow-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flow-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flow-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flow-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IOAuthFlow3SchemaProcessor): ISDSchemaDefinition<IOAuthFlow3Definition, IOAuthFlow3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IOAuthFlow3Definition, IOAuthFlow3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.authorizationUrl,
        validators.tokenUrl,
        validators.refreshUrl,
        validators.scopes
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IOAuthFlow3Definition> | OAuthFlow | undefined): OAuthFlow {
    return new OAuthFlow(Object.assign({}, definition) as IOAuthFlow3Definition)
  }

  static async createAsync (definition?: Partial<IOAuthFlow3Definition> | OAuthFlow | string | undefined): Promise<OAuthFlow> {
    if (definition instanceof OAuthFlow) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IOAuthFlow3Definition>)
    }
  }

  static createDefinition<T extends Partial<IOAuthFlow3Definition>> (definition?: T | undefined): IOAuthFlow3Definition & T {
    return Object.assign({}, definition) as IOAuthFlow3Definition & T
  }

  static validate (definition: IOAuthFlow3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IOAuthFlow3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
    refreshUrl: {
      name: 'refreshUrl',
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
