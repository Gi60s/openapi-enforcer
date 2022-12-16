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

const validators: IValidatorsMap = {
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

export class SecurityScheme extends EnforcerComponent<I.ISecurityScheme2Definition> implements I.ISecurityScheme2 {
  [extension: `x${string}`]: any

  constructor (definition: I.ISecurityScheme2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
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

  static validate (definition: I.ISecurityScheme2Definition, version?: IVersion): ExceptionStore {
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
