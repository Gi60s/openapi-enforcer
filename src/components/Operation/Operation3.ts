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
import { ExternalDocumentation3, IExternalDocumentation3 } from '../ExternalDocumentation'
import { Parameter3, IParameter3 } from '../Parameter'
import { Responses3, IResponses3 } from '../Responses'
import { SecurityRequirement3, ISecurityRequirement3 } from '../SecurityRequirement'
import { RequestBody3, IRequestBody3 } from '../RequestBody'
import { Callback3, ICallback3 } from '../Callback'
import { Server3, IServer3 } from '../Server'
import { Operation as OperationBase } from './Operation'
import { IOperation3, IOperation3Definition, IOperation3SchemaProcessor, IOperationValidatorsMap3 as IValidatorsMap } from './IOperation'
// <!# Custom Content Begin: HEADER #!>
import { ContentType } from '../../ContentType/ContentType'
import { IOperationParseOptions, IOperationParseRequest, IOperationParseRequestResponse } from './IOperation'
import { validate, getMergedParameters, mergeParameters, operationWillAcceptContentType } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IOperation3Definition, IOperation3> | null = null

export class Operation extends OperationBase implements IOperation3 {
  public extensions: Record<string, any> = {}
  public tags?: string[]
  public summary?: string
  public description?: string
  public externalDocs?: IExternalDocumentation3
  public operationId?: string
  public parameters?: IParameter3[]
  public requestBody?: IRequestBody3
  public responses!: IResponses3
  public callbacks?: Record<string, ICallback3>
  public deprecated?: boolean
  public security?: ISecurityRequirement3[]
  public servers?: IServer3[]

  constructor (definition: IOperation3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    this.getPropertyHook('parameters', (parameters: I.IParameter3[] | undefined) => {
      const pathItem = this.getParent<I.IPathItem3>('PathItem').component
      const pathItemParameters: I.IParameter3[] = pathItem?.parameters ?? []
      return mergeParameters(pathItemParameters, parameters) as I.IParameter3[]
    })
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'OPERATION3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#operation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#operation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#operation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#operation-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IOperation3SchemaProcessor): ISDSchemaDefinition<IOperation3Definition, IOperation3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IOperation3Definition, IOperation3> = {
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
    result.validate = function (data) {
      const parameters = getMergedParameters(data)
      validate(data, parameters)
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IOperation3Definition> | Operation | undefined): Operation {
    if (definition instanceof Operation) {
      return new Operation(Object.assign({}, definition as unknown) as IOperation3Definition)
    } else {
      return new Operation(Object.assign({
        responses: Responses3.create()
      }, definition) as IOperation3Definition)
    }
  }

  static async createAsync (definition?: Partial<IOperation3Definition> | Operation | string | undefined): Promise<Operation> {
    if (definition instanceof Operation) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IOperation3Definition>)
    }
  }

  static createDefinition<T extends Partial<IOperation3Definition>> (definition?: T | undefined): IOperation3Definition & T {
    return Object.assign({
      responses: Responses3.create()
    }, definition) as IOperation3Definition & T
  }

  static validate (definition: IOperation3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IOperation3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  getAcceptedResponseTypes (statusCode: number | 'default', accepts: string): ContentType[] {
    const response = this.responses[statusCode]
    if (response === undefined) return []

    const produces = Object.keys(response.content ?? {})
      .map(ContentType.fromString)
      .filter(c => c !== undefined) as ContentType[]

    return ContentType.filterProducedTypesByAccepted(accepts, produces)
  }

  parseBody (body: string | object, options?: IOperationParseOptions): any {
    return null
  }

  parseHeaders (headers: Record<string, string>, options?: IOperationParseOptions): Record<string, any> {
    return {}
  }

  parsePath (path: string, options?: IOperationParseOptions): Record<string, any> {
    return {}
  }

  parseQuery (query: string, options?: IOperationParseOptions & { allowOtherQueryParameters?: boolean }): Record<string, any> {
    return {}
  }

  parseRequest (request: IOperationParseRequest, options?: IOperationParseOptions & { allowOtherQueryParameters?: boolean }): IOperationParseRequestResponse {
    return {}
  }

  willAcceptContentType (contentType: string | ContentType): boolean {
    const consumes = Object.keys(this.requestBody?.content ?? {})
    return operationWillAcceptContentType(contentType, consumes)
  }
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
        component: ExternalDocumentation3
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
          component: Parameter3
        }
      }
    },
    requestBody: {
      name: 'requestBody',
      schema: {
        type: 'component',
        allowsRef: true,
        component: RequestBody3
      }
    },
    responses: {
      name: 'responses',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Responses3
      }
    },
    callbacks: {
      name: 'callbacks',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Callback3
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
          component: SecurityRequirement3
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
          component: Server3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
