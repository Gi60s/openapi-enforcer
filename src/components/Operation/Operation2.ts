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
import { IOperationSchemaProcessor } from '../IInternalTypes'
import {
  ExternalDocumentation2,
  IExternalDocumentation2,
  IExternalDocumentation2Definition,
  IOperation2,
  IOperation2Definition,
  IParameter2,
  IParameter2Definition,
  IResponses2,
  IResponses2Definition,
  ISecurityRequirement2,
  ISecurityRequirement2Definition,
  Parameter2,
  Responses2,
  SecurityRequirement2
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { after, getMergedParameters, mergeParameters } from './common'
import { getLocation } from '../../Locator/Locator'
import { findAncestorComponentData } from '../common'
import { ISchemaProcessor } from '../../ComponentSchemaDefinition/ISchemaProcessor'
import { ISwagger2Definition, ISwagger2 } from '../Swagger'
import { ContentType } from '../../ContentType/ContentType'
import { IPathItem2, IPathItem2Definition } from '../PathItem/IPathItem'
import { IOperationParseOptions, IOperationParseRequest, IOperationParseRequestResponse } from './IOperation'
import { getExistingProcessorData } from '../../ComponentSchemaDefinition/schema-processor'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IOperation2Definition, IOperation2> | null = null

interface IValidatorsMap {
  tags: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  summary: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation2Definition, IExternalDocumentation2>>
  operationId: ISchema.IProperty<ISchema.IString>
  consumes: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  produces: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IParameter2Definition, IParameter2>>>
  responses: ISchema.IProperty<ISchema.IComponent<IResponses2Definition, IResponses2>>
  schemes: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  deprecated: ISchema.IProperty<ISchema.IBoolean>
  security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISecurityRequirement2Definition, ISecurityRequirement2>>>
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

export class Operation extends EnforcerComponent<IOperation2Definition, IOperation2> implements IOperation2 {
  [extension: `x${string}`]: any

  constructor (definition: IOperation2Definition, version?: IVersion) {
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

  static getSchemaDefinition (_data: IOperationSchemaProcessor): ISchema.ISchemaDefinition<IOperation2Definition, IOperation2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IOperation2Definition, IOperation2> = {
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

      built.hookGetProperty('parameters', (parameters: IParameter2[]) => {
        const pathItem = findAncestorComponentData<IPathItem2, IPathItem2Definition>(chain, 'PathItem')
        const pathItemParameters: IParameter2[] = pathItem?.definition.parameters ?? []
        return mergeParameters(pathItemParameters, parameters) as IParameter2[]
      })

      built.hookGetProperty('consumes', (value) => {

      })

      built.hookGetProperty('produces', (value) => {

      })

      data.hookSetProperty('parameters', (newValue: any, oldValue: any) => {
        const parameters = getMergedParameters(data)
        const bodies: IParameter2Definition[] = []
        const forms: IParameter2Definition[] = []
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
      })
    }

    result.after = function (data, mode) {
      const { definition, exception, id, reference } = data
      after(definition, data, mode)

      if (mode === 'validate') {
        const parameters = getMergedParameters(data)
        const bodies: IParameter2Definition[] = []
        const forms: IParameter2Definition[] = []
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

        const accepts = getAllConsumes(data)

        // check consumes values for form data
        if (forms.length > 0) {
          const matchTypes = [
            ContentType.fromString('multipart/form-data'),
            ContentType.fromString('application/x-www-form-urlencoded')
          ]
          const consumesFormData = accepts.find(v => v?.findMatches(matchTypes) !== undefined)
          if (consumesFormData === undefined) {
            exception.add({
              id: id + '_FORM_DATA_CONSUMES',
              level: 'warn',
              locations: [getLocation(definition)],
              message: 'Input parameters in formData or file should also be accompanied with a consumes property value of either "multipart/form-data" or "application/x-www-form-urlencoded',
              metadata: {
                consumes: accepts.map(v => v.toString())
              }
            })
          }
        }
      }

      if (mode === 'build') {
        data.lastly.add(() => {
          const swaggerData: ISchemaProcessor<ISwagger2Definition, ISwagger2> | undefined =
            findAncestorComponentData<ISchemaProcessor<ISwagger2Definition, ISwagger2>>(data.chain, 'Swagger')
          const operation = data.built
          operation.watchProperty('consumes', () => operation.clearCache('allConsumes'))
          operation.watchProperty('produces', () => operation.clearCache('allProduces'))
          swaggerData?.built.watchProperty('consumes', () => operation.clearCache('allConsumes'))
          swaggerData?.built.watchProperty('produces', () => operation.clearCache('allProduces'))
        })
      }
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IOperation2Definition, version?: IVersion): ExceptionStore {
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

  get externalDocs (): IExternalDocumentation2 | undefined {
    return this.getProperty('externalDocs')
  }

  set externalDocs (value: IExternalDocumentation2 | undefined) {
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

  get parameters (): IParameter2[] | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: IParameter2[] | undefined) {
    this.setProperty('parameters', value)
  }

  get responses (): IResponses2 {
    return this.getProperty('responses')
  }

  set responses (value: IResponses2) {
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

  get security (): ISecurityRequirement2[] | undefined {
    return this.getProperty('security')
  }

  set security (value: ISecurityRequirement2[] | undefined) {
    this.setProperty('security', value)
  }

  // <!# Custom Content Begin: BODY #!>
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
    const data = getExistingProcessorData<IOperation2Definition, IOperation2>(this)
    const input = [contentType]
    return this.cached<ContentType[]>('allConsumes', getAllConsumes, data)
      .find(c => c.findMatches(input).length > 0) !== undefined
  }
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
function getAllConsumes (data: ISchemaProcessor<IOperation2Definition, IOperation2>): ContentType[] {
  const { chain, definition } = data
  const swaggerData: ISchemaProcessor<ISwagger2Definition, any> | undefined =
    findAncestorComponentData(chain, 'Swagger') as ISchemaProcessor<ISwagger2Definition, any>
  return (definition.consumes ?? []).concat(swaggerData?.definition.consumes ?? [])
    .map(ContentType.fromString)
    .filter(v => v !== undefined) as ContentType[]
}

function getAllProduces (data: ISchemaProcessor<IOperation2Definition, IOperation2>): ContentType[] {
  const { chain, definition } = data
  const swaggerData: ISchemaProcessor<ISwagger2Definition, any> | undefined =
    findAncestorComponentData(chain, 'Swagger') as ISchemaProcessor<ISwagger2Definition, any>
  return (definition.produces ?? []).concat(swaggerData?.definition.produces ?? [])
    .map(ContentType.fromString)
    .filter(v => v !== undefined) as ContentType[]
}
// <!# Custom Content End: FOOTER #!>
