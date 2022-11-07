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
  IOAuth Flow3,
  IOAuth Flow3Definition,
  IOAuthFlows3,
  IOAuthFlows3Definition,
  OAuth Flow3
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IOAuthFlows3Definition, IOAuthFlows3> | null = null

export class OAuthFlows extends EnforcerComponent implements IOAuthFlows3 {
  [extension: `x-${string}`]: any
  implicit?: IOAuth Flow3
  password?: IOAuth Flow3
  clientCredentials?: IOAuth Flow3
  authorizationCode?: IOAuth Flow3

  constructor (definition: IOAuthFlows3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flows-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flows-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flows-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flows-object'
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<IOAuthFlows3Definition, IOAuthFlows3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const implicit: ISchema.IProperty<ISchema.IComponent<IOAuth Flow3Definition, IOAuth Flow3>> = {
      name: 'implicit',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuth Flow3
      }
    }

    const password: ISchema.IProperty<ISchema.IComponent<IOAuth Flow3Definition, IOAuth Flow3>> = {
      name: 'password',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuth Flow3
      }
    }

    const clientCredentials: ISchema.IProperty<ISchema.IComponent<IOAuth Flow3Definition, IOAuth Flow3>> = {
      name: 'clientCredentials',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuth Flow3
      }
    }

    const authorizationCode: ISchema.IProperty<ISchema.IComponent<IOAuth Flow3Definition, IOAuth Flow3>> = {
      name: 'authorizationCode',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuth Flow3
      }
    }

    const schema: ISchema.IDefinition<IOAuthFlows3Definition, IOAuthFlows3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        implicit,
        password,
        clientCredentials,
        authorizationCode
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: IOAuthFlows3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
