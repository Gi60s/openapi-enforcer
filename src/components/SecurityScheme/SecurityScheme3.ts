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

let cachedSchema: ISchema.ISchemaDefinition<I.ISecurityScheme3Definition, I.ISecurityScheme3> | null = null

interface IValidatorsMap {
  type: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  name: ISchema.IProperty<ISchema.IString>
  _in: ISchema.IProperty<ISchema.IString>
  scheme: ISchema.IProperty<ISchema.IString>
  bearerFormat: ISchema.IProperty<ISchema.IString>
  flows: ISchema.IProperty<ISchema.IComponent<I.IOAuthFlows3Definition, I.IOAuthFlows3>>
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
      component: I.OAuthFlows3
    }
  },
  openIdConnectUrl: {
    name: 'openIdConnectUrl',
    schema: {
      type: 'string'
    }
  }
}

export class SecurityScheme extends EnforcerComponent<I.ISecurityScheme3Definition> implements I.ISecurityScheme3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.ISecurityScheme3Definition, version?: IVersion) {
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

  static getSchemaDefinition (_data: I.ISecuritySchemeSchemaProcessor): ISchema.ISchemaDefinition<I.ISecurityScheme3Definition, I.ISecurityScheme3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.ISecurityScheme3Definition, I.ISecurityScheme3> = {
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

  static create (definition?: Partial<I.ISecurityScheme3Definition> | SecurityScheme | undefined): SecurityScheme {
    return new SecurityScheme(Object.assign({}, definition) as I.ISecurityScheme3Definition)
  }

  static validate (definition: I.ISecurityScheme3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get type (): 'apiKey'|'http'|'oauth2'|'openIdConnect' | undefined {
    return this[GetProperty]('type')
  }

  set type (value: 'apiKey'|'http'|'oauth2'|'openIdConnect' | undefined) {
    this[SetProperty]('type', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get name (): string | undefined {
    return this[GetProperty]('name')
  }

  set name (value: string | undefined) {
    this[SetProperty]('name', value)
  }

  get in (): 'query'|'header'|'cookie' | undefined {
    return this[GetProperty]('in')
  }

  set in (value: 'query'|'header'|'cookie' | undefined) {
    this[SetProperty]('in', value)
  }

  get scheme (): string | undefined {
    return this[GetProperty]('scheme')
  }

  set scheme (value: string | undefined) {
    this[SetProperty]('scheme', value)
  }

  get bearerFormat (): string | undefined {
    return this[GetProperty]('bearerFormat')
  }

  set bearerFormat (value: string | undefined) {
    this[SetProperty]('bearerFormat', value)
  }

  get flows (): I.IOAuthFlows3 | undefined {
    return this[GetProperty]('flows')
  }

  set flows (value: I.IOAuthFlows3 | undefined) {
    this[SetProperty]('flows', value)
  }

  get openIdConnectUrl (): string | undefined {
    return this[GetProperty]('openIdConnectUrl')
  }

  set openIdConnectUrl (value: string | undefined) {
    this[SetProperty]('openIdConnectUrl', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
