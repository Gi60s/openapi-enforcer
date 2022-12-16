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
import { getMergedParameters, mergeParameters } from './common'
import { getLocation } from '../../Locator/Locator'
import { ISchemaProcessor } from '../../ComponentSchemaDefinition/ISchemaProcessor'
import { ContentType } from '../../ContentType/ContentType'
import { IOperationParseOptions, IOperationParseRequest, IOperationParseRequestResponse } from './IOperation'
import { IOperation2 } from '../IInternalTypes'
import { smart } from '../../util'
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

const validators: IValidatorsMap = {
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

export class Operation extends EnforcerComponent<I.IOperation2Definition> implements I.IOperation2 {
  [extension: `x${string}`]: any

  constructor (definition: I.IOperation2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
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

      built.hookGetProperty('parameters', (parameters: I.IParameter2[] | undefined) => {
        const pathItem: ISchemaProcessor<I.IPathItem2Definition, I.IPathItem2> | undefined = data.chain
          .getAncestor(ancestor => ancestor.name === 'PathItem')
        const pathItemParameters: I.IParameter2[] = pathItem?.built.parameters ?? []
        return mergeParameters(pathItemParameters, parameters) as I.IParameter2[]
      })

      built.hookGetProperty('consumes', (consumes: string[] | undefined) => {
        return getAllContentTypeStrings(data, 'consumes', consumes)
      })

      built.hookGetProperty('produces', (produces: string[] | undefined) => {
        return getAllContentTypeStrings(data, 'produces', produces)
      })
    }

    result.validate = function (data) {
      const { definition, exception, id, reference } = data

      const parameters = getMergedParameters(data)
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
          id: id + '_BODY_NOT_UNIQUE',
          level: 'error',
          locations: bodies.map(parameter => getLocation(parameter)),
          message: 'Only one body parameter allowed.',
          metadata: { bodyParameters: parameters },
          reference
        })
      }

      if (bodies.length > 0 && forms.length > 0) {
        exception.add({
          id: id + '_BODY_FORM_DATA_CONFLICT',
          level: 'error',
          locations: bodies.map(parameter => getLocation(parameter))
            .concat(forms.map(parameter => getLocation(parameter))),
          message: 'The body parameter and formData parameter are mutually exclusive.',
          metadata: { bodyParameters: parameters, formDataParameters: forms },
          reference
        })
      }

      validateContentTypes(definition.consumes ?? [], 'consumes', data)
      validateContentTypes(definition.produces ?? [], 'produces', data)

      // check consumes values for form data
      const consumes = getAllContentTypeStrings(data, 'consumes', definition.consumes).map(ContentType.fromString)
      if (forms.length > 0) {
        const matchTypes = [
          ContentType.fromString('multipart/form-data'),
          ContentType.fromString('application/x-www-form-urlencoded')
        ]
        const consumesFormData = consumes.find(v => v?.findMatches(matchTypes) !== undefined)
        if (consumesFormData === undefined) {
          exception.add({
            id: id + '_FORM_DATA_CONSUMES',
            level: 'warn',
            locations: [getLocation(definition)],
            message: 'Input parameters in formData or file should also be accompanied with a consumes property value of either "multipart/form-data" or "application/x-www-form-urlencoded',
            metadata: {
              consumes: consumes.filter(v => v !== undefined).map(v => (v as ContentType).toString())
            }
          })
        }
      }
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.IOperation2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
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

  get externalDocs (): I.IExternalDocumentation2 | undefined {
    return this.getProperty('externalDocs')
  }

  set externalDocs (value: I.IExternalDocumentation2 | undefined) {
    this.setProperty('externalDocs', value)
  }

  get operationId (): string | undefined {
    return this.getProperty('operationId')
  }

  set operationId (value: string | undefined) {
    this.setProperty('operationId', value)
  }

  get consumes (): string[] | undefined {
    return this.getProperty('consumes')
  }

  set consumes (value: string[] | undefined) {
    this.setProperty('consumes', value)
  }

  get produces (): string[] | undefined {
    return this.getProperty('produces')
  }

  set produces (value: string[] | undefined) {
    this.setProperty('produces', value)
  }

  get parameters (): I.IParameter2[] | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: I.IParameter2[] | undefined) {
    this.setProperty('parameters', value)
  }

  get responses (): I.IResponses2 {
    return this.getProperty('responses')
  }

  set responses (value: I.IResponses2) {
    this.setProperty('responses', value)
  }

  get schemes (): Array<'http'|'https'|'ws'|'wss'> | undefined {
    return this.getProperty('schemes')
  }

  set schemes (value: Array<'http'|'https'|'ws'|'wss'> | undefined) {
    this.setProperty('schemes', value)
  }

  get deprecated (): boolean | undefined {
    return this.getProperty('deprecated')
  }

  set deprecated (value: boolean | undefined) {
    this.setProperty('deprecated', value)
  }

  get security (): I.ISecurityRequirement2[] | undefined {
    return this.getProperty('security')
  }

  set security (value: I.ISecurityRequirement2[] | undefined) {
    this.setProperty('security', value)
  }

  // <!# Custom Content Begin: BODY #!>
  getAcceptedResponseTypes (statusCode: number | 'default', accepts: string): ContentType[] {
    const acceptedTypes = ContentType.fromStringMultiple(accepts)
    const produces = this.produces?.map(ContentType.fromString).filter(v => v !== undefined) as ContentType[] ?? []
    return ContentType.findIntersections(acceptedTypes, produces)
  }
  // getResponsesThatCanProduceContentType (contentType: string | ContentType): Array<{ code: number | 'default', response: IResponse2 }> {
  //   const data = getExistingProcessorData<IOperation2Definition, IOperation2>(this)
  //   const input = [contentType]
  //   const allProducesTypes = this.cached<ContentType[]>('allProduces', getAllProduces, data)
  //   const result: Array<{ code: number | 'default', response: IResponse2 }> = []
  //   const match = allProducesTypes.find(c => c.findMatches(input).length > 0)
  //   if (match !== undefined) {
  //     Object.keys(this.responses).forEach(key => {
  //       if (key === 'default' || typeof key === 'number') {
  //         result.push({ code: key, response: this.responses[key] as IResponse2 })
  //       }
  //     })
  //   }
  //
  //   return result
  // }

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
    const length = consumes.length
    for (let i = 0; i < length; i++) {
      const type = ContentType.fromString(consumes[i])
      const matches = type?.findMatches([contentType]) ?? []
      if (matches.length > 0) return true
    }
    return false
  }
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
function getAllContentTypeStrings (data: ISchemaProcessor<I.IOperation2Definition, IOperation2>, key: 'consumes' | 'produces', types: string[] | undefined): string[] {
  const swagger: ISchemaProcessor<I.ISwagger2Definition, I.ISwagger2> | undefined = data.chain
    .getAncestor(ancestor => ancestor.name === 'Swagger')
  const result = new Set<string>((swagger?.built[key] ?? []).concat(types ?? []))
  return Array.from(result)
}

function validateContentTypes (contentTypes: string[] | undefined, key: 'consumes' | 'produces', data: ISchemaProcessor<I.IOperation2Definition, IOperation2>): void {
  contentTypes?.forEach((contentType, index) => {
    if (!ContentType.isContentTypeString(contentType)) {
      const { definition, exception, id, reference } = data
      exception.add({
        id: id + '_CONTENT_TYPE_INVALID',
        level: 'warn',
        locations: [getLocation(definition[key] as string[], index, 'value')],
        message: 'Value for ' + smart(key) + ' appears to be invalid: ' + smart(contentType),
        metadata: {
          contentType
        },
        reference
      })
    }
  })
}
// <!# Custom Content End: FOOTER #!>
