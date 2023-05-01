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
import * as Icsd from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

type IValidatorsMap = I.ISecuritySchemeValidatorsMap3

let cachedSchema: Icsd.ISchemaDefinition<I.ISecurityScheme3Definition, I.ISecurityScheme3> | null = null

export class SecurityScheme extends EnforcerComponent<I.ISecurityScheme3Definition> implements I.ISecurityScheme3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.ISecurityScheme3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SECURITY_SCHEME3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-scheme-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-scheme-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-scheme-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-scheme-object'
  }

  static getSchemaDefinition (_data: I.ISecuritySchemeSchemaProcessor): Icsd.ISchemaDefinition<I.ISecurityScheme3Definition, I.ISecurityScheme3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: Icsd.ISchemaDefinition<I.ISecurityScheme3Definition, I.ISecurityScheme3> = {
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

  static async createAsync (definition?: Partial<I.ISecurityScheme3Definition> | SecurityScheme | string | undefined): Promise<SecurityScheme> {
    if (definition instanceof SecurityScheme) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.ISecurityScheme3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.ISecurityScheme3Definition>> (definition?: T | undefined): I.ISecurityScheme3Definition & T {
    return Object.assign({}, definition) as I.ISecurityScheme3Definition & T
  }

  static validate (definition: I.ISecurityScheme3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.ISecurityScheme3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
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

  get flows (): I.IOAuthFlows3 | undefined {
    return this.getProperty('flows')
  }

  set flows (value: I.IOAuthFlows3 | undefined) {
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

function getValidatorsMap (): IValidatorsMap {
  return {
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
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
