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
import { loadAsync, loadAsyncAndThrow } from '../../Loader/Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
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

export class Link extends EnforcerComponent<I.ILink3Definition> implements I.ILink3 {
  [S.Extensions]: Record<string, any> = {}

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

    const validators = getValidatorsMap()
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

  static create (definition?: Partial<I.ILink3Definition> | Link | undefined): Link {
    return new Link(Object.assign({}, definition) as I.ILink3Definition)
  }

  static async createAsync (definition?: Partial<I.ILink3Definition> | Link | string | undefined): Promise<Link> {
    if (definition instanceof Link) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.ILink3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.ILink3Definition>> (definition?: T | undefined): I.ILink3Definition & T {
    return Object.assign({}, definition) as I.ILink3Definition & T
  }

  static validate (definition: I.ILink3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.ILink3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get operationRef (): string | undefined {
    return this[GetProperty]('operationRef')
  }

  set operationRef (value: string | undefined) {
    this[SetProperty]('operationRef', value)
  }

  get operationId (): string | undefined {
    return this[GetProperty]('operationId')
  }

  set operationId (value: string | undefined) {
    this[SetProperty]('operationId', value)
  }

  get parameters (): Record<string, any> | undefined {
    return this[GetProperty]('parameters')
  }

  set parameters (value: Record<string, any> | undefined) {
    this[SetProperty]('parameters', value)
  }

  get requestBody (): any | undefined {
    return this[GetProperty]('requestBody')
  }

  set requestBody (value: any | undefined) {
    this[SetProperty]('requestBody', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get server (): I.IServer3 | undefined {
    return this[GetProperty]('server')
  }

  set server (value: I.IServer3 | undefined) {
    this[SetProperty]('server', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
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
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
