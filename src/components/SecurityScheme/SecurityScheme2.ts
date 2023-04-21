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
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.ISecurityScheme2Definition, I.ISecurityScheme2> | null = null

interface IValidatorsMap {
  type: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  name: ISchema.IProperty<ISchema.IString>
  _in: ISchema.IProperty<ISchema.IString>
  flow: ISchema.IProperty<ISchema.IString>
  authorizationUrl: ISchema.IProperty<ISchema.IString>
  tokenUrl: ISchema.IProperty<ISchema.IString>
  scopes: ISchema.IProperty<ISchema.IObject<ISchema.IString>>
}

export class SecurityScheme extends EnforcerComponent<I.ISecurityScheme2Definition> implements I.ISecurityScheme2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.ISecurityScheme2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SECURITY_SCHEME2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#security-scheme-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.ISecuritySchemeSchemaProcessor): ISchema.ISchemaDefinition<I.ISecurityScheme2Definition, I.ISecurityScheme2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.ISecurityScheme2Definition, I.ISecurityScheme2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.type,
        validators.description,
        validators.name,
        validators._in,
        validators.flow,
        validators.authorizationUrl,
        validators.tokenUrl,
        validators.scopes
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.ISecurityScheme2Definition> | SecurityScheme | undefined): SecurityScheme {
    if (definition instanceof SecurityScheme) {
      return new SecurityScheme(Object.assign({}, definition as unknown) as I.ISecurityScheme2Definition)
    } else {
      return new SecurityScheme(Object.assign({
        type: 'basic'
      }, definition) as I.ISecurityScheme2Definition)
    }
  }

  static async createAsync (definition?: Partial<I.ISecurityScheme2Definition> | SecurityScheme | string | undefined): Promise<SecurityScheme> {
    if (definition instanceof SecurityScheme) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.ISecurityScheme2Definition>)
    }
  }

  static createDefinition<T extends Partial<I.ISecurityScheme2Definition>> (definition?: T | undefined): I.ISecurityScheme2Definition & T {
    return Object.assign({
      type: 'basic'
    }, definition) as I.ISecurityScheme2Definition & T
  }

  static validate (definition: I.ISecurityScheme2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.ISecurityScheme2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get type (): 'basic'|'apiKey'|'oauth2' {
    return this[GetProperty]('type')
  }

  set type (value: 'basic'|'apiKey'|'oauth2') {
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

  get in (): 'query'|'header' | undefined {
    return this[GetProperty]('in')
  }

  set in (value: 'query'|'header' | undefined) {
    this[SetProperty]('in', value)
  }

  get flow (): 'implicit'|'password'|'application'|'accessCode' | undefined {
    return this[GetProperty]('flow')
  }

  set flow (value: 'implicit'|'password'|'application'|'accessCode' | undefined) {
    this[SetProperty]('flow', value)
  }

  get authorizationUrl (): string | undefined {
    return this[GetProperty]('authorizationUrl')
  }

  set authorizationUrl (value: string | undefined) {
    this[SetProperty]('authorizationUrl', value)
  }

  get tokenUrl (): string | undefined {
    return this[GetProperty]('tokenUrl')
  }

  set tokenUrl (value: string | undefined) {
    this[SetProperty]('tokenUrl', value)
  }

  get scopes (): Record<string, string> | undefined {
    return this[GetProperty]('scopes')
  }

  set scopes (value: Record<string, string> | undefined) {
    this[SetProperty]('scopes', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    type: {
      name: 'type',
      required: true,
      schema: {
        type: 'string',
        enum: ['basic', 'apiKey', 'oauth2']
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
        enum: ['query', 'header']
      }
    },
    flow: {
      name: 'flow',
      schema: {
        type: 'string',
        enum: ['implicit', 'password', 'application', 'accessCode']
      }
    },
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
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
