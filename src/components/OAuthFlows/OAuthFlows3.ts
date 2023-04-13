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
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IOAuthFlows3Definition, I.IOAuthFlows3> | null = null

interface IValidatorsMap {
  implicit: ISchema.IProperty<ISchema.IComponent<I.IOAuthFlow3Definition, I.IOAuthFlow3>>
  password: ISchema.IProperty<ISchema.IComponent<I.IOAuthFlow3Definition, I.IOAuthFlow3>>
  clientCredentials: ISchema.IProperty<ISchema.IComponent<I.IOAuthFlow3Definition, I.IOAuthFlow3>>
  authorizationCode: ISchema.IProperty<ISchema.IComponent<I.IOAuthFlow3Definition, I.IOAuthFlow3>>
}

export class OAuthFlows extends EnforcerComponent<I.IOAuthFlows3Definition> implements I.IOAuthFlows3 {
  [S.Extensions]: Record<string, any> = {}
  public implicit?: I.IOAuthFlow3
  public password?: I.IOAuthFlow3
  public clientCredentials?: I.IOAuthFlow3
  public authorizationCode?: I.IOAuthFlow3

  constructor (definition: I.IOAuthFlows3Definition, version?: IVersion) {
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
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flows-object'
  }

  static getSchemaDefinition (_data: I.IOAuthFlowsSchemaProcessor): ISchema.ISchemaDefinition<I.IOAuthFlows3Definition, I.IOAuthFlows3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IOAuthFlows3Definition, I.IOAuthFlows3> = {
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

  static create (definition?: Partial<I.IOAuthFlows3Definition> | OAuthFlows | undefined): OAuthFlows {
    return new OAuthFlows(Object.assign({}, definition) as I.IOAuthFlows3Definition)
  }

  static async createAsync (definition?: Partial<I.IOAuthFlows3Definition> | OAuthFlows | string | undefined): Promise<OAuthFlows> {
    if (definition instanceof OAuthFlows) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IOAuthFlows3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IOAuthFlows3Definition>> (definition?: T | undefined): I.IOAuthFlows3Definition & T {
    return Object.assign({}, definition) as I.IOAuthFlows3Definition & T
  }

  static validate (definition: I.IOAuthFlows3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IOAuthFlows3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    implicit: {
      name: 'implicit',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.OAuthFlow3
      }
    },
    password: {
      name: 'password',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.OAuthFlow3
      }
    },
    clientCredentials: {
      name: 'clientCredentials',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.OAuthFlow3
      }
    },
    authorizationCode: {
      name: 'authorizationCode',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.OAuthFlow3
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
