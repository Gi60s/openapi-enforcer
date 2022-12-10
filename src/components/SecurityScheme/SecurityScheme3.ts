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
import { ISecuritySchemeSchemaProcessor } from '../IInternalTypes'
import {
  IOAuthFlows3,
  IOAuthFlows3Definition,
  ISecurityScheme3,
  ISecurityScheme3Definition,
  OAuthFlows3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<ISecurityScheme3Definition, ISecurityScheme3> | null = null

interface IValidatorsMap {
  type: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  name: ISchema.IProperty<ISchema.IString>
  _in: ISchema.IProperty<ISchema.IString>
  scheme: ISchema.IProperty<ISchema.IString>
  bearerFormat: ISchema.IProperty<ISchema.IString>
  flows: ISchema.IProperty<ISchema.IComponent<IOAuthFlows3Definition, IOAuthFlows3>>
  openIdConnectUrl: ISchema.IProperty<ISchema.IString>
}

const validators: IValidatorsMap = {
  type: {
    name: 'type',
    schema: {
      type: 'string',
      enum: ['apiKey', 'http', 'oauth2', 'openIdConnect']
    }
  },
  description: {
    name: 'description',
    schema: {
      type: 'string'
    }
  },
  name: {
    name: 'name',
    schema: {
      type: 'string'
    }
  },
  _in: {
    name: 'in',
    schema: {
      type: 'string',
      enum: ['query', 'header', 'cookie']
    }
  },
  scheme: {
    name: 'scheme',
    schema: {
      type: 'string'
    }
  },
  bearerFormat: {
    name: 'bearerFormat',
    schema: {
      type: 'string'
    }
  },
  flows: {
    name: 'flows',
    schema: {
      type: 'component',
      allowsRef: false,
      component: OAuthFlows3
    }
  },
  openIdConnectUrl: {
    name: 'openIdConnectUrl',
    schema: {
      type: 'string'
    }
  }
}

export class SecurityScheme extends EnforcerComponent<ISecurityScheme3Definition, ISecurityScheme3> implements ISecurityScheme3 {
  [extension: `x${string}`]: any

  constructor (definition: ISecurityScheme3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'SECURITY_SCHEME3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-scheme-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-scheme-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-scheme-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-scheme-object'
  }

  static getSchemaDefinition (_data: ISecuritySchemeSchemaProcessor): ISchema.ISchemaDefinition<ISecurityScheme3Definition, ISecurityScheme3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<ISecurityScheme3Definition, ISecurityScheme3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.type,
        validators.description,
        validators.name,
        validators._in,
        validators.scheme,
        validators.bearerFormat,
        validators.flows,
        validators.openIdConnectUrl
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: ISecurityScheme3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get type (): 'apiKey'|'http'|'oauth2'|'openIdConnect' | undefined {
    return this.getProperty('type')
  }

  set type (value: 'apiKey'|'http'|'oauth2'|'openIdConnect' | undefined) {
    this.setProperty('type', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get name (): string | undefined {
    return this.getProperty('name')
  }

  set name (value: string | undefined) {
    this.setProperty('name', value)
  }

  get in (): 'query'|'header'|'cookie' | undefined {
    return this.getProperty('in')
  }

  set in (value: 'query'|'header'|'cookie' | undefined) {
    this.setProperty('in', value)
  }

  get scheme (): string | undefined {
    return this.getProperty('scheme')
  }

  set scheme (value: string | undefined) {
    this.setProperty('scheme', value)
  }

  get bearerFormat (): string | undefined {
    return this.getProperty('bearerFormat')
  }

  set bearerFormat (value: string | undefined) {
    this.setProperty('bearerFormat', value)
  }

  get flows (): IOAuthFlows3 | undefined {
    return this.getProperty('flows')
  }

  set flows (value: IOAuthFlows3 | undefined) {
    this.setProperty('flows', value)
  }

  get openIdConnectUrl (): string | undefined {
    return this.getProperty('openIdConnectUrl')
  }

  set openIdConnectUrl (value: string | undefined) {
    this.setProperty('openIdConnectUrl', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
