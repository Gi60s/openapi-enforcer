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
import { OAuthFlow3, IOAuthFlow3 } from '../OAuthFlow'
import { OAuthFlows as OAuthFlowsBase } from './OAuthFlows'
import { IOAuthFlows3, IOAuthFlows3Definition, IOAuthFlows3SchemaProcessor, IOAuthFlowsValidatorsMap3 as IValidatorsMap } from './IOAuthFlows'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IOAuthFlows3Definition, IOAuthFlows3> | null = null

export class OAuthFlows extends OAuthFlowsBase implements IOAuthFlows3 {
  public extensions: Record<string, any> = {}
  public implicit?: IOAuthFlow3
  public password?: IOAuthFlow3
  public clientCredentials?: IOAuthFlow3
  public authorizationCode?: IOAuthFlow3

  constructor (definition: IOAuthFlows3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'OAUTH_FLOWS3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flows-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flows-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flows-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flows-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IOAuthFlows3SchemaProcessor): ISDSchemaDefinition<IOAuthFlows3Definition, IOAuthFlows3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IOAuthFlows3Definition, IOAuthFlows3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.implicit,
        validators.password,
        validators.clientCredentials,
        validators.authorizationCode
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IOAuthFlows3Definition> | OAuthFlows | undefined): OAuthFlows {
    return new OAuthFlows(Object.assign({}, definition) as IOAuthFlows3Definition)
  }

  static async createAsync (definition?: Partial<IOAuthFlows3Definition> | OAuthFlows | string | undefined): Promise<OAuthFlows> {
    if (definition instanceof OAuthFlows) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IOAuthFlows3Definition>)
    }
  }

  static createDefinition<T extends Partial<IOAuthFlows3Definition>> (definition?: T | undefined): IOAuthFlows3Definition & T {
    return Object.assign({}, definition) as IOAuthFlows3Definition & T
  }

  static validate (definition: IOAuthFlows3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IOAuthFlows3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
    implicit: {
      name: 'implicit',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow3
      }
    },
    password: {
      name: 'password',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow3
      }
    },
    clientCredentials: {
      name: 'clientCredentials',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow3
      }
    },
    authorizationCode: {
      name: 'authorizationCode',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow3
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
