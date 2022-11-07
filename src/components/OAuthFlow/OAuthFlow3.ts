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
import * as ISchema from '../IComponentSchema'
import { ISchemaProcessor } from '../ISchemaProcessor'
import {
  IOAuthFlow3,
  IOAuthFlow3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IOAuthFlow3Definition, IOAuthFlow3> | null = null

export class OAuthFlow extends EnforcerComponent implements IOAuthFlow3 {
  [extension: `x-${string}`]: any
  authorizationUrl?: string
  tokenUrl?: string
  refreshUrl?: string
  scopes?: Record<string, string>

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

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<IOAuthFlow3Definition, IOAuthFlow3> {
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

    const scopes: ISchema.IProperty<ISchema.IString> = {
      name: 'scopes',
      schema: {
        type: 'string'
      }
    }

    const schema: ISchema.IDefinition<IOAuthFlow3Definition, IOAuthFlow3> = {
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
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: IOAuthFlow3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
