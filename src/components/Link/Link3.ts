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
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Server3, IServer3, IServer3Definition } from '../Server'
import { Link as LinkBase } from './Link'
import { ILink3, ILink3Definition, ILink3SchemaProcessor, ILinkValidatorsMap3 as IValidatorsMap } from './ILink'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ILink3Definition, ILink3> | null = null

export class Link extends LinkBase implements ILink3 {
  public extensions: Record<string, any> = {}
  public operationRef?: string
  public operationId?: string
  public parameters?: Record<string, any>
  public requestBody?: any
  public description?: string
  public server?: IServer3

  constructor (definition: ILink3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'LINK3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#link-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#link-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#link-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#link-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: ILink3SchemaProcessor): ISDSchemaDefinition<ILink3Definition, ILink3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<ILink3Definition, ILink3> = {
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

  static create (definition?: Partial<ILink3Definition> | Link | undefined): Link {
    return new Link(Object.assign({}, definition) as ILink3Definition)
  }

  static async createAsync (definition?: Partial<ILink3Definition> | Link | string | undefined): Promise<Link> {
    if (definition instanceof Link) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ILink3Definition>)
    }
  }

  static createDefinition<T extends Partial<ILink3Definition>> (definition?: T | undefined): ILink3Definition & T {
    return Object.assign({}, definition) as ILink3Definition & T
  }

  static validate (definition: ILink3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ILink3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

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
        component: Server3
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
