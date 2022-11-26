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
import { IOAuthFlowSchemaProcessor } from '../IInternalTypes'
import {
  IOAuthFlow3,
  IOAuthFlow3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IOAuthFlow3Definition, IOAuthFlow3> | null = null

export class OAuthFlow extends EnforcerComponent<IOAuthFlow3Definition, IOAuthFlow3> implements IOAuthFlow3 {
  [extension: `x${string}`]: any

  constructor (definition: IOAuthFlow3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flow-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flow-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flow-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flow-object'
  }

  static getSchemaDefinition (_data: IOAuthFlowSchemaProcessor): ISchema.ISchemaDefinition<IOAuthFlow3Definition, IOAuthFlow3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const authorizationUrl: ISchema.IProperty<ISchema.IString> = {
      name: 'authorizationUrl',
      schema: {
        type: 'string'
      }
    }

    const tokenUrl: ISchema.IProperty<ISchema.IString> = {
      name: 'tokenUrl',
      schema: {
        type: 'string'
      }
    }

    const refreshUrl: ISchema.IProperty<ISchema.IString> = {
      name: 'refreshUrl',
      schema: {
        type: 'string'
      }
    }

    const scopes: ISchema.IProperty<ISchema.IObject<ISchema.IString>> = {
      name: 'scopes',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'string'
        }
      }
    }

    const result: ISchema.ISchemaDefinition<IOAuthFlow3Definition, IOAuthFlow3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        authorizationUrl,
        tokenUrl,
        refreshUrl,
        scopes
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IOAuthFlow3Definition, version?: IVersion): ExceptionStore {
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
