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

/* eslint-disable import/no-duplicates */
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Server3a, IServer3a } from '../Server'
import { Link as LinkBase } from './Link'
import { ILink3a, ILink3aDefinition, ILink3aSchemaProcessor, ILinkValidatorsMap3a as IValidatorsMap } from './ILink'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ILink3aDefinition, ILink3a> | null = null

export class Link extends LinkBase implements ILink3a {
  public extensions: Record<string, any> = {}
  public operationRef?: string
  public operationId?: string
  public parameters?: Record<string, any>
  public requestBody?: any
  public description?: string
  public server?: IServer3a

  constructor (definition: ILink3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'LINK3A'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#link-object'
  }

  static getSchemaDefinition (_data: ILink3aSchemaProcessor): ISDSchemaDefinition<ILink3aDefinition, ILink3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<ILink3aDefinition, ILink3a> = {
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

  static create (definition?: Partial<ILink3aDefinition> | Link | undefined): Link {
    return new Link(Object.assign({}, definition) as ILink3aDefinition)
  }

  static async createAsync (definition?: Partial<ILink3aDefinition> | Link | string | undefined): Promise<Link> {
    if (definition instanceof Link) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ILink3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<ILink3aDefinition>> (definition?: T | undefined): ILink3aDefinition & T {
    return Object.assign({}, definition) as ILink3aDefinition & T
  }

  static validate (definition: ILink3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ILink3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
        component: Server3a
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
