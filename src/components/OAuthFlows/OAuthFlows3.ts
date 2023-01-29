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
import { EnforcerComponent, SetProperty, GetProperty } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
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

  constructor (definition: I.IOAuthFlows3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
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

  static createDefinition (definition?: Partial<I.IOAuthFlows3Definition> | undefined): I.IOAuthFlows3Definition {
    return Object.assign({}, definition) as I.IOAuthFlows3Definition
  }

  static validate (definition: I.IOAuthFlows3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get implicit (): I.IOAuthFlow3 | undefined {
    return this[GetProperty]('implicit')
  }

  set implicit (value: I.IOAuthFlow3 | undefined) {
    this[SetProperty]('implicit', value)
  }

  get password (): I.IOAuthFlow3 | undefined {
    return this[GetProperty]('password')
  }

  set password (value: I.IOAuthFlow3 | undefined) {
    this[SetProperty]('password', value)
  }

  get clientCredentials (): I.IOAuthFlow3 | undefined {
    return this[GetProperty]('clientCredentials')
  }

  set clientCredentials (value: I.IOAuthFlow3 | undefined) {
    this[SetProperty]('clientCredentials', value)
  }

  get authorizationCode (): I.IOAuthFlow3 | undefined {
    return this[GetProperty]('authorizationCode')
  }

  set authorizationCode (value: I.IOAuthFlow3 | undefined) {
    this[SetProperty]('authorizationCode', value)
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
