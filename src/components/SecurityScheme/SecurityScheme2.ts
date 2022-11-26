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
  ISecurityScheme2,
  ISecurityScheme2Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<ISecurityScheme2Definition, ISecurityScheme2> | null = null

export class SecurityScheme extends EnforcerComponent<ISecurityScheme2Definition, ISecurityScheme2> implements ISecurityScheme2 {
  [extension: `x${string}`]: any

  constructor (definition: ISecurityScheme2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#security-scheme-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: ISecuritySchemeSchemaProcessor): ISchema.ISchemaDefinition<ISecurityScheme2Definition, ISecurityScheme2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const type: ISchema.IProperty<ISchema.IString> = {
      name: 'type',
      required: true,
      schema: {
        type: 'string',
        enum: ['basic', 'apiKey', 'oauth2']
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

    const _in: ISchema.IProperty<ISchema.IString> = {
      name: 'in',
      schema: {
        type: 'string',
        enum: ['query', 'header']
      }
    }

    const flow: ISchema.IProperty<ISchema.IString> = {
      name: 'flow',
      schema: {
        type: 'string',
        enum: ['implicit', 'password', 'application', 'accessCode']
      }
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

    const scopes: ISchema.IProperty<ISchema.IObject<ISchema.IString>> = {
      name: 'scopes',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'string'
        }
      }
    }

    const result: ISchema.ISchemaDefinition<ISecurityScheme2Definition, ISecurityScheme2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        type,
        description,
        name,
        _in,
        flow,
        authorizationUrl,
        tokenUrl,
        scopes
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: ISecurityScheme2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get type (): 'basic'|'apiKey'|'oauth2' {
    return this.getProperty('type')
  }

  set type (value: 'basic'|'apiKey'|'oauth2') {
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

  get in (): 'query'|'header' | undefined {
    return this.getProperty('in')
  }

  set in (value: 'query'|'header' | undefined) {
    this.setProperty('in', value)
  }

  get flow (): 'implicit'|'password'|'application'|'accessCode' | undefined {
    return this.getProperty('flow')
  }

  set flow (value: 'implicit'|'password'|'application'|'accessCode' | undefined) {
    this.setProperty('flow', value)
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
