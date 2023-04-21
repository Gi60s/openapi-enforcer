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
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import { getMergedParameters, mergeParameters, operationWillAcceptContentType, validate } from './common'
import { getLocation } from '../../Loader'
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { ContentType } from '../../ContentType/ContentType'
import { IOperationParseOptions, IOperationParseRequest, IOperationParseRequestResponse } from './IOperation'

const multipartContentType = ContentType.fromString('multipart/form-data')
const formUrlEncodedContentType = ContentType.fromString('application/x-www-form-urlencoded')
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IOperation2Definition, I.IOperation2> | null = null

interface IValidatorsMap {
  tags: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  summary: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  externalDocs: ISchema.IProperty<ISchema.IComponent<I.IExternalDocumentation2Definition, I.IExternalDocumentation2>>
  operationId: ISchema.IProperty<ISchema.IString>
  consumes: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  produces: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.IParameter2Definition, I.IParameter2>>>
  responses: ISchema.IProperty<ISchema.IComponent<I.IResponses2Definition, I.IResponses2>>
  schemes: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  deprecated: ISchema.IProperty<ISchema.IBoolean>
  security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISecurityRequirement2Definition, I.ISecurityRequirement2>>>
}

export class Operation extends EnforcerComponent<I.IOperation2Definition> implements I.IOperation2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IOperation2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'OPERATION2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#operation-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IOperationSchemaProcessor): ISchema.ISchemaDefinition<I.IOperation2Definition, I.IOperation2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IOperation2Definition, I.IOperation2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.tags,
        validators.summary,
        validators.description,
        validators.externalDocs,
        validators.operationId,
        validators.consumes,
        validators.produces,
        validators.parameters,
        validators.responses,
        validators.schemes,
        validators.deprecated,
        validators.security
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.build = function (data) {
      const { built } = data

      built[S.HookGetProperty]('parameters', (parameters: I.IParameter2[] | undefined) => {
        const pathItem: SchemaProcessor<I.IPathItem2Definition, I.IPathItem2> | undefined = data.upTo('PathItem')
        const pathItemParameters: I.IParameter2[] = pathItem?.built.parameters ?? []
        return mergeParameters(pathItemParameters, parameters) as I.IParameter2[]
      })

      built[S.HookGetProperty]('consumes', (consumes: string[] | undefined) => {
        return getAllContentTypeStrings(data, 'consumes', consumes)
      })

      built[S.HookGetProperty]('produces', (produces: string[] | undefined) => {
        return getAllContentTypeStrings(data, 'produces', produces)
      })
    }

    result.validate = function (data) {
      const { definition, exception } = data
      const { reference, id } = data.component
      const parameters = getMergedParameters(data) as I.IParameter2Definition[]
      validate(data, parameters)

      const bodies: I.IParameter2Definition[] = []
      const forms: I.IParameter2Definition[] = []
      parameters.forEach(parameter => {
        if (parameter.in === 'body') {
          bodies.push(parameter)
        } else if (parameter.in === 'formData') {
          forms.push(parameter)
        }
      })

      if (bodies.length > 1) {
        exception.add({
          id,
          code: 'OPERATION_BODY_NOT_UNIQUE',
          level: 'error',
          locations: bodies.map(parameter => getLocation(parameter)),
          metadata: { bodyParameters: parameters },
          reference
        })
      }

      if (bodies.length > 0 && forms.length > 0) {
        exception.add({
          id,
          code: 'OPERATION_BODY_FORM_CONFLICT',
          level: 'error',
          locations: bodies.map(parameter => getLocation(parameter))
            .concat(forms.map(parameter => getLocation(parameter))),
          metadata: { bodyParameters: parameters, formDataParameters: forms },
          reference
        })
      }

      validateContentTypes(definition.consumes ?? [], 'consumes', data)
      validateContentTypes(definition.produces ?? [], 'produces', data)

      // check consumes values for form data
      const consumes = getAllContentTypeStrings(data, 'consumes', definition.consumes)
        .map(ContentType.fromString)
        .filter(c => c !== undefined) as ContentType[]
      if (forms.length > 0) {
        const consumesFormData = consumes.find(c => c.isMatch(multipartContentType) || c.isMatch(formUrlEncodedContentType))
        if (consumesFormData === undefined) {
          exception.add({
            id,
            code: 'OPERATION_CONSUMES_FORM_DATA',
            level: 'warn',
            locations: [getLocation(definition)],
            metadata: {
              consumes: consumes.filter(v => v !== undefined).map(v => v.toString())
            }
          })
        }
      }
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IOperation2Definition> | Operation | undefined): Operation {
    if (definition instanceof Operation) {
      return new Operation(Object.assign({}, definition as unknown) as I.IOperation2Definition)
    } else {
      return new Operation(Object.assign({
        responses: I.Responses2.create()
      }, definition) as I.IOperation2Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IOperation2Definition> | Operation | string | undefined): Promise<Operation> {
    if (definition instanceof Operation) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IOperation2Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IOperation2Definition>> (definition?: T | undefined): I.IOperation2Definition & T {
    return Object.assign({
      responses: I.Responses2.create()
    }, definition) as I.IOperation2Definition & T
  }

  static validate (definition: I.IOperation2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IOperation2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get tags (): string[] | undefined {
    return this[GetProperty]('tags')
  }

  set tags (value: string[] | undefined) {
    this[SetProperty]('tags', value)
  }

  get summary (): string | undefined {
    return this[GetProperty]('summary')
  }

  set summary (value: string | undefined) {
    this[SetProperty]('summary', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get externalDocs (): I.IExternalDocumentation2 | undefined {
    return this[GetProperty]('externalDocs')
  }

  set externalDocs (value: I.IExternalDocumentation2 | undefined) {
    this[SetProperty]('externalDocs', value)
  }

  get operationId (): string | undefined {
    return this[GetProperty]('operationId')
  }

  set operationId (value: string | undefined) {
    this[SetProperty]('operationId', value)
  }

  get consumes (): string[] | undefined {
    return this[GetProperty]('consumes')
  }

  set consumes (value: string[] | undefined) {
    this[SetProperty]('consumes', value)
  }

  get produces (): string[] | undefined {
    return this[GetProperty]('produces')
  }

  set produces (value: string[] | undefined) {
    this[SetProperty]('produces', value)
  }

  get parameters (): I.IParameter2[] | undefined {
    return this[GetProperty]('parameters')
  }

  set parameters (value: I.IParameter2[] | undefined) {
    this[SetProperty]('parameters', value)
  }

  get responses (): I.IResponses2 {
    return this[GetProperty]('responses')
  }

  set responses (value: I.IResponses2) {
    this[SetProperty]('responses', value)
  }

  get schemes (): Array<'http'|'https'|'ws'|'wss'> | undefined {
    return this[GetProperty]('schemes')
  }

  set schemes (value: Array<'http'|'https'|'ws'|'wss'> | undefined) {
    this[SetProperty]('schemes', value)
  }

  get deprecated (): boolean | undefined {
    return this[GetProperty]('deprecated')
  }

  set deprecated (value: boolean | undefined) {
    this[SetProperty]('deprecated', value)
  }

  get security (): I.ISecurityRequirement2[] | undefined {
    return this[GetProperty]('security')
  }

  set security (value: I.ISecurityRequirement2[] | undefined) {
    this[SetProperty]('security', value)
  }

  // <!# Custom Content Begin: BODY #!>
  getAcceptedResponseTypes (statusCode: number | 'default', accepts: string): ContentType[] {
    return ContentType.filterProducedTypesByAccepted(accepts, this.produces ?? [])
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
    const consumes: string[] = this.consumes ?? []
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
        component: I.ExternalDocumentation2
      }
    },
    operationId: {
      name: 'operationId',
      schema: {
        type: 'string'
      }
    },
    consumes: {
      name: 'consumes',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    produces: {
      name: 'produces',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    parameters: {
      name: 'parameters',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: I.Parameter2
        }
      }
    },
    responses: {
      name: 'responses',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Responses2
      }
    },
    schemes: {
      name: 'schemes',
      schema: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['http', 'https', 'ws', 'wss']
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
          component: I.SecurityRequirement2
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
function getAllContentTypeStrings (data: SchemaProcessor<I.IOperation2Definition, I.IOperation2>, key: 'consumes' | 'produces', types: string[] | undefined): string[] {
  const swagger = data.upTo<I.ISwagger2Definition, I.ISwagger2>('Swagger')
  const result = new Set<string>((swagger?.built[key] ?? []).concat(types ?? []))
  return Array.from(result)
}

function validateContentTypes (contentTypes: string[] | undefined, key: 'consumes' | 'produces', data: SchemaProcessor<I.IOperation2Definition, I.IOperation2>): void {
  contentTypes?.forEach((contentType, index) => {
    if (!ContentType.isContentTypeString(contentType)) {
      const { definition, exception } = data
      const { reference, id } = data.component
      exception.add({
        id,
        code: 'CONTENT_TYPE_INVALID',
        level: 'warn',
        locations: [getLocation(definition[key] as string[], index, 'value')],
        metadata: {
          contentType
        },
        reference
      })
    }
  })
}
// <!# Custom Content End: FOOTER #!>
