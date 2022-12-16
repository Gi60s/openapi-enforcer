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

let cachedSchema: ISchema.ISchemaDefinition<I.ILink3Definition, I.ILink3> | null = null

interface IValidatorsMap {
  operationRef: ISchema.IProperty<ISchema.IString>
  operationId: ISchema.IProperty<ISchema.IString>
  parameters: ISchema.IProperty<ISchema.IObject<any>>
  requestBody: ISchema.IProperty<any>
  description: ISchema.IProperty<ISchema.IString>
  server: ISchema.IProperty<ISchema.IComponent<I.IServer3Definition, I.IServer3>>
}

const validators: IValidatorsMap = {
  operationRef: {
    name: 'operationRef',
    schema: {
      type: 'string'
    }
  },
  operationId: {
    name: 'operationId',
    schema: {
      type: 'string'
    }
  },
  parameters: {
    name: 'parameters',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'any'
      }
    }
  },
  requestBody: {
    name: 'requestBody',
    schema: {
      type: 'any'
    }
  },
  description: {
    name: 'description',
    schema: {
      type: 'string'
    }
  },
  server: {
    name: 'server',
    schema: {
      type: 'component',
      allowsRef: false,
      component: I.Server3
    }
  }
}

export class Link extends EnforcerComponent<I.ILink3Definition> implements I.ILink3 {
  [extension: `x${string}`]: any

  constructor (definition: I.ILink3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'LINK3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#link-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#link-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#link-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#link-object'
  }

  static getSchemaDefinition (_data: I.ILinkSchemaProcessor): ISchema.ISchemaDefinition<I.ILink3Definition, I.ILink3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.ILink3Definition, I.ILink3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.operationRef,
        validators.operationId,
        validators.parameters,
        validators.requestBody,
        validators.description,
        validators.server
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.ILink3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get operationRef (): string | undefined {
    return this.getProperty('operationRef')
  }

  set operationRef (value: string | undefined) {
    this.setProperty('operationRef', value)
  }

  get operationId (): string | undefined {
    return this.getProperty('operationId')
  }

  set operationId (value: string | undefined) {
    this.setProperty('operationId', value)
  }

  get parameters (): Record<string, any> | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: Record<string, any> | undefined) {
    this.setProperty('parameters', value)
  }

  get requestBody (): any | undefined {
    return this.getProperty('requestBody')
  }

  set requestBody (value: any | undefined) {
    this.setProperty('requestBody', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get server (): I.IServer3 | undefined {
    return this.getProperty('server')
  }

  set server (value: I.IServer3 | undefined) {
    this.setProperty('server', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
