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
import { ExternalDocumentation2, IExternalDocumentation2 } from '../ExternalDocumentation'
import { Responses2, IResponses2 } from '../Responses'
import { Operation as OperationBase } from './Operation'
import { IOperation2, IOperation2Definition, IOperation2SchemaProcessor, IOperationValidatorsMap2 as IValidatorsMap } from './IOperation'
// <!# Custom Content Begin: HEADER #!>
import { getMergedParameters, mergeParameters, operationWillAcceptContentType, validate } from './common'
import { getLocation } from '../../Loader'
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { ContentType } from '../../ContentType/ContentType'
import { IOperationParseOptions, IOperationParseRequest, IOperationParseRequestResponse } from './IOperation'

const multipartContentType = ContentType.fromString('multipart/form-data')
const formUrlEncodedContentType = ContentType.fromString('application/x-www-form-urlencoded')
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IOperation2Definition, IOperation2> | null = null

export class Operation extends OperationBase implements IOperation2 {
  public extensions: Record<string, any> = {}
  public tags?: string[]
  public summary?: string
  public description?: string
  public externalDocs?: IExternalDocumentation2
  public operationId?: string
  public consumes?: string[]
  public produces?: string[]
  public parameters?: IParameter2[]
  public responses!: IResponses2
  public schemes?: Array<'http' | 'https' | 'ws' | 'wss'>
  public deprecated?: boolean
  public security?: ISecurityRequirement2[]

  constructor (definition: IOperation2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    this.getPropertyHook('parameters', (parameters?: I.IParameter2[]) => {
      const pathItem = this.getParent<I.IPathItem2>('PathItem').component
      const pathItemParameters: I.IParameter2[] = pathItem?.parameters ?? []
      return mergeParameters(pathItemParameters, parameters) as I.IParameter2[]
    })

    this.getPropertyHook('consumes', (consumes?: string[]) => {
      const swagger = this.getParent<I.ISwagger2>('Swagger').component
      const result = new Set<string>((swagger?.consumes ?? []).concat(consumes ?? []))
      return Array.from(result)
    })

    this.getPropertyHook('produces', (produces?: string[]) => {
      const swagger = this.getParent<I.ISwagger2>('Swagger').component
      const result = new Set<string>((swagger?.produces ?? []).concat(produces ?? []))
      return Array.from(result)
    })
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'OPERATION2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#operation-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IOperation2SchemaProcessor): ISDSchemaDefinition<IOperation2Definition, IOperation2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IOperation2Definition, IOperation2> = {
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

  static create (definition?: Partial<IOperation2Definition> | Operation | undefined): Operation {
    if (definition instanceof Operation) {
      return new Operation(Object.assign({}, definition as unknown) as IOperation2Definition)
    } else {
      return new Operation(Object.assign({
        responses: Responses2.create()
      }, definition) as IOperation2Definition)
    }
  }

  static async createAsync (definition?: Partial<IOperation2Definition> | Operation | string | undefined): Promise<Operation> {
    if (definition instanceof Operation) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IOperation2Definition>)
    }
  }

  static createDefinition<T extends Partial<IOperation2Definition>> (definition?: T | undefined): IOperation2Definition & T {
    return Object.assign({
      responses: Responses2.create()
    }, definition) as IOperation2Definition & T
  }

  static validate (definition: IOperation2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IOperation2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
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
        component: ExternalDocumentation2
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
          component: Parameter2
        }
      }
    },
    responses: {
      name: 'responses',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Responses2
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
          component: SecurityRequirement2
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
