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
import { ILinkSchemaProcessor } from '../IInternalTypes'
import {
  ILink3,
  ILink3Definition,
  IServer3,
  IServer3Definition,
  Server3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<ILink3Definition, ILink3> | null = null

export class Link extends EnforcerComponent<ILink3Definition, ILink3> implements ILink3 {
  [extension: `x${string}`]: any

  constructor (definition: ILink3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#link-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#link-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#link-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#link-object'
  }

  static getSchemaDefinition (_data: ILinkSchemaProcessor): ISchema.ISchemaDefinition<ILink3Definition, ILink3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const operationRef: ISchema.IProperty<ISchema.IString> = {
      name: 'operationRef',
      schema: {
        type: 'string'
      }
    }

    const operationId: ISchema.IProperty<ISchema.IString> = {
      name: 'operationId',
      schema: {
        type: 'string'
      }
    }

    const parameters: ISchema.IProperty<ISchema.IObject<any>> = {
      name: 'parameters',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'any'
        }
      }
    }

    const requestBody: ISchema.IProperty<any> = {
      name: 'requestBody',
      schema: {
        type: 'any'
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const server: ISchema.IProperty<ISchema.IComponent<IServer3Definition, IServer3>> = {
      name: 'server',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Server3
      }
    }

    const result: ISchema.ISchemaDefinition<ILink3Definition, ILink3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        operationRef,
        operationId,
        parameters,
        requestBody,
        description,
        server
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: ILink3Definition, version?: IVersion): ExceptionStore {
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

  get server (): IServer3 | undefined {
    return this.getProperty('server')
  }

  set server (value: IServer3 | undefined) {
    this.setProperty('server', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
