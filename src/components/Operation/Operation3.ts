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
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import { ContentType } from '../../ContentType/ContentType'
import { IOperationParseOptions, IOperationParseRequest, IOperationParseRequestResponse } from './IOperation'
import { validate, getMergedParameters, mergeParameters, operationWillAcceptContentType } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IOperation3Definition, I.IOperation3> | null = null

interface IValidatorsMap {
  tags: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  summary: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  externalDocs: ISchema.IProperty<ISchema.IComponent<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>>
  operationId: ISchema.IProperty<ISchema.IString>
  parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.IParameter3Definition, I.IParameter3>>>
  requestBody: ISchema.IProperty<ISchema.IComponent<I.IRequestBody3Definition, I.IRequestBody3>>
  responses: ISchema.IProperty<ISchema.IComponent<I.IResponses3Definition, I.IResponses3>>
  callbacks: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ICallback3Definition, I.ICallback3>>>
  deprecated: ISchema.IProperty<ISchema.IBoolean>
  security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISecurityRequirement3Definition, I.ISecurityRequirement3>>>
  servers: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.IServer3Definition, I.IServer3>>>
}

export class Operation extends EnforcerComponent<I.IOperation3Definition> implements I.IOperation3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IOperation3Definition, version?: IVersion) {
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
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#operation-object'
  }

  static getSchemaDefinition (_data: I.IOperationSchemaProcessor): ISchema.ISchemaDefinition<I.IOperation3Definition, I.IOperation3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IOperation3Definition, I.IOperation3> = {
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

  static create (definition?: Partial<I.IOperation3Definition> | Operation | undefined): Operation {
    if (definition instanceof Operation) {
      return new Operation(Object.assign({}, definition as unknown) as I.IOperation3Definition)
    } else {
      return new Operation(Object.assign({
        responses: I.Responses3.create()
      }, definition) as I.IOperation3Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IOperation3Definition> | Operation | string | undefined): Promise<Operation> {
    if (definition instanceof Operation) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IOperation3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IOperation3Definition>> (definition?: T | undefined): I.IOperation3Definition & T {
    return Object.assign({
      responses: I.Responses3.create()
    }, definition) as I.IOperation3Definition & T
  }

  static validate (definition: I.IOperation3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IOperation3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get tags (): string[] | undefined {
    return this.getProperty('tags')
  }

  set tags (value: string[] | undefined) {
    this.setProperty('tags', value)
  }

  get summary (): string | undefined {
    return this.getProperty('summary')
  }

  set summary (value: string | undefined) {
    this.setProperty('summary', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get externalDocs (): I.IExternalDocumentation3 | undefined {
    return this.getProperty('externalDocs')
  }

  set externalDocs (value: I.IExternalDocumentation3 | undefined) {
    this.setProperty('externalDocs', value)
  }

  get operationId (): string | undefined {
    return this.getProperty('operationId')
  }

  set operationId (value: string | undefined) {
    this.setProperty('operationId', value)
  }

  get parameters (): I.IParameter3[] | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: I.IParameter3[] | undefined) {
    this.setProperty('parameters', value)
  }

  get requestBody (): I.IRequestBody3 | undefined {
    return this.getProperty('requestBody')
  }

  set requestBody (value: I.IRequestBody3 | undefined) {
    this.setProperty('requestBody', value)
  }

  get responses (): I.IResponses3 {
    return this.getProperty('responses')
  }

  set responses (value: I.IResponses3) {
    this.setProperty('responses', value)
  }

  get callbacks (): Record<string, I.ICallback3> | undefined {
    return this.getProperty('callbacks')
  }

  set callbacks (value: Record<string, I.ICallback3> | undefined) {
    this.setProperty('callbacks', value)
  }

  get deprecated (): boolean | undefined {
    return this.getProperty('deprecated')
  }

  set deprecated (value: boolean | undefined) {
    this.setProperty('deprecated', value)
  }

  get security (): I.ISecurityRequirement3[] | undefined {
    return this.getProperty('security')
  }

  set security (value: I.ISecurityRequirement3[] | undefined) {
    this.setProperty('security', value)
  }

  get servers (): I.IServer3[] | undefined {
    return this.getProperty('servers')
  }

  set servers (value: I.IServer3[] | undefined) {
    this.setProperty('servers', value)
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
        component: I.ExternalDocumentation3
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
          component: I.Parameter3
        }
      }
    },
    requestBody: {
      name: 'requestBody',
      schema: {
        type: 'component',
        allowsRef: true,
        component: I.RequestBody3
      }
    },
    responses: {
      name: 'responses',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Responses3
      }
    },
    callbacks: {
      name: 'callbacks',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: I.Callback3
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
          component: I.SecurityRequirement3
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
          component: I.Server3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
