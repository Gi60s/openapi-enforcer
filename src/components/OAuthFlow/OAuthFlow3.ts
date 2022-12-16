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
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IOAuthFlow3Definition, I.IOAuthFlow3> | null = null

interface IValidatorsMap {
  authorizationUrl: ISchema.IProperty<ISchema.IString>
  tokenUrl: ISchema.IProperty<ISchema.IString>
  refreshUrl: ISchema.IProperty<ISchema.IString>
  scopes: ISchema.IProperty<ISchema.IObject<ISchema.IString>>
}

const validators: IValidatorsMap = {
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

export class OAuthFlow extends EnforcerComponent<I.IOAuthFlow3Definition> implements I.IOAuthFlow3 {
  [extension: `x${string}`]: any

  constructor (definition: I.IOAuthFlow3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'OAUTH_FLOW3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flow-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flow-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flow-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flow-object'
  }

  static getSchemaDefinition (_data: I.IOAuthFlowSchemaProcessor): ISchema.ISchemaDefinition<I.IOAuthFlow3Definition, I.IOAuthFlow3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IOAuthFlow3Definition, I.IOAuthFlow3> = {
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

  static validate (definition: I.IOAuthFlow3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get authorizationUrl (): string | undefined {
    return this.getProperty('authorizationUrl')
  }

  set authorizationUrl (value: string | undefined) {
    this.setProperty('authorizationUrl', value)
  }

  get tokenUrl (): string | undefined {
    return this.getProperty('tokenUrl')
  }

  set tokenUrl (value: string | undefined) {
    this.setProperty('tokenUrl', value)
  }

  get refreshUrl (): string | undefined {
    return this.getProperty('refreshUrl')
  }

  set refreshUrl (value: string | undefined) {
    this.setProperty('refreshUrl', value)
  }

  get scopes (): Record<string, string> | undefined {
    return this.getProperty('scopes')
  }

  set scopes (value: Record<string, string> | undefined) {
    this.setProperty('scopes', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
