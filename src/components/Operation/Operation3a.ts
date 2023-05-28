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
import { ExternalDocumentation3a, IExternalDocumentation3a } from '../ExternalDocumentation'
import { Responses3a, IResponses3a } from '../Responses'
import { RequestBody3a, IRequestBody3a } from '../RequestBody'
import { Operation as OperationBase } from './Operation'
import { IOperation3a, IOperation3aDefinition, IOperation3aSchemaProcessor, IOperationValidatorsMap3a as IValidatorsMap } from './IOperation'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IOperation3aDefinition, IOperation3a> | null = null

export class Operation extends OperationBase implements IOperation3a {
  public extensions: Record<string, any> = {}
  public tags?: string[]
  public summary?: string
  public description?: string
  public externalDocs?: IExternalDocumentation3a
  public operationId?: string
  public parameters?: IParameter3a[]
  public requestBody?: IRequestBody3a
  public responses!: IResponses3a
  public callbacks?: Record<string, ICallback3a>
  public deprecated?: boolean
  public security?: ISecurityRequirement3a[]
  public servers?: IServer3a[]

  constructor (definition: IOperation3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'OPERATION3A'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#operation-object'
  }

  static getSchemaDefinition (_data: IOperation3aSchemaProcessor): ISDSchemaDefinition<IOperation3aDefinition, IOperation3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IOperation3aDefinition, IOperation3a> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.tags,
        validators.summary,
        validators.description,
        validators.externalDocs,
        validators.operationId,
        validators.parameters,
        validators.requestBody,
        validators.responses,
        validators.callbacks,
        validators.deprecated,
        validators.security,
        validators.servers
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IOperation3aDefinition> | Operation | undefined): Operation {
    if (definition instanceof Operation) {
      return new Operation(Object.assign({}, definition as unknown) as IOperation3aDefinition)
    } else {
      return new Operation(Object.assign({
        responses: Responses3a.create()
      }, definition) as IOperation3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<IOperation3aDefinition> | Operation | string | undefined): Promise<Operation> {
    if (definition instanceof Operation) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IOperation3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IOperation3aDefinition>> (definition?: T | undefined): IOperation3aDefinition & T {
    return Object.assign({
      responses: Responses3a.create()
    }, definition) as IOperation3aDefinition & T
  }

  static validate (definition: IOperation3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IOperation3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
    tags: {
      name: 'tags',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    summary: {
      name: 'summary',
      schema: {
        type: 'string'
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    externalDocs: {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation3a
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
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Parameter3a
        }
      }
    },
    requestBody: {
      name: 'requestBody',
      schema: {
        type: 'component',
        allowsRef: true,
        component: RequestBody3a
      }
    },
    responses: {
      name: 'responses',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Responses3a
      }
    },
    callbacks: {
      name: 'callbacks',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Callback3a
        }
      }
    },
    deprecated: {
      name: 'deprecated',
      schema: {
        type: 'boolean'
      }
    },
    security: {
      name: 'security',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: SecurityRequirement3a
        }
      }
    },
    servers: {
      name: 'servers',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: Server3a
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
