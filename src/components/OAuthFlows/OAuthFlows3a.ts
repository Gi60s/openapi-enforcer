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
import { OAuth Flow3a, IOAuth Flow3a, IOAuth Flow3aDefinition } from '../OAuth Flow'
import { OAuthFlows as OAuthFlowsBase } from './OAuthFlows'
import { IOAuthFlows3a, IOAuthFlows3aDefinition, IOAuthFlows3aSchemaProcessor, IOAuthFlowsValidatorsMap3a as IValidatorsMap } from './IOAuthFlows'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IOAuthFlows3aDefinition, IOAuthFlows3a> | null = null

export class OAuthFlows extends OAuthFlowsBase implements IOAuthFlows3a {
  public extensions: Record<string, any> = {}
  public implicit?: IOAuth Flow3a
  public password?: IOAuth Flow3a
  public clientCredentials?: IOAuth Flow3a
  public authorizationCode?: IOAuth Flow3a

  constructor (definition: IOAuthFlows3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'OAUTH_FLOWS3A'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#oauth-flows-object'
  }

  static getSchemaDefinition (_data: IOAuthFlows3aSchemaProcessor): ISDSchemaDefinition<IOAuthFlows3aDefinition, IOAuthFlows3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IOAuthFlows3aDefinition, IOAuthFlows3a> = {
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

  static create (definition?: Partial<IOAuthFlows3aDefinition> | OAuthFlows | undefined): OAuthFlows {
    return new OAuthFlows(Object.assign({}, definition) as IOAuthFlows3aDefinition)
  }

  static async createAsync (definition?: Partial<IOAuthFlows3aDefinition> | OAuthFlows | string | undefined): Promise<OAuthFlows> {
    if (definition instanceof OAuthFlows) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IOAuthFlows3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IOAuthFlows3aDefinition>> (definition?: T | undefined): IOAuthFlows3aDefinition & T {
    return Object.assign({}, definition) as IOAuthFlows3aDefinition & T
  }

  static validate (definition: IOAuthFlows3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IOAuthFlows3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
        component: OAuth Flow3a
      }
    },
    password: {
      name: 'password',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuth Flow3a
      }
    },
    clientCredentials: {
      name: 'clientCredentials',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuth Flow3a
      }
    },
    authorizationCode: {
      name: 'authorizationCode',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuth Flow3a
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
