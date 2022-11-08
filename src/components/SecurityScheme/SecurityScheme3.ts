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
  IOAuthFlows3,
  IOAuthFlows3Definition,
  ISecurityScheme3,
  ISecurityScheme3Definition,
  OAuthFlows3
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<ISecurityScheme3Definition, ISecurityScheme3> | null = null

export class SecurityScheme extends EnforcerComponent implements ISecurityScheme3 {
  [extension: `x-${string}`]: any
  type?: 'apiKey'|'http'|'oauth2'|'openIdConnect'
  description?: string
  name?: string
  in?: 'query'|'header'|'cookie'
  scheme?: string
  bearerFormat?: string
  flows?: IOAuthFlows3
  openIdConnectUrl?: string

  constructor (definition: ISecurityScheme3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-scheme-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-scheme-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-scheme-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-scheme-object'
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<ISecurityScheme3Definition, ISecurityScheme3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const type: ISchema.IProperty<ISchema.IString> = {
      name: 'type',
      schema: {
        type: 'string',
        enum: ['apiKey', 'http', 'oauth2', 'openIdConnect']
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const name: ISchema.IProperty<ISchema.IString> = {
      name: 'name',
      schema: {
        type: 'string'
      }
    }

    const in: ISchema.IProperty<ISchema.IString> = {
      name: 'in',
      schema: {
        type: 'string',
        enum: ['query', 'header', 'cookie']
      }
    }

    const scheme: ISchema.IProperty<ISchema.IString> = {
      name: 'scheme',
      schema: {
        type: 'string'
      }
    }

    const bearerFormat: ISchema.IProperty<ISchema.IString> = {
      name: 'bearerFormat',
      schema: {
        type: 'string'
      }
    }

    const flows: ISchema.IProperty<ISchema.IComponent<IOAuthFlows3Definition, IOAuthFlows3>> = {
      name: 'flows',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlows3
      }
    }

    const openIdConnectUrl: ISchema.IProperty<ISchema.IString> = {
      name: 'openIdConnectUrl',
      schema: {
        type: 'string'
      }
    }

    const schema: ISchema.IDefinition<ISecurityScheme3Definition, ISecurityScheme3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        type,
        description,
        name,
        in,
        scheme,
        bearerFormat,
        flows,
        openIdConnectUrl
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: ISecurityScheme3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
