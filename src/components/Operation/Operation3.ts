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
  Callback3,
  ExternalDocumentation3,
  ICallback3,
  ICallback3Definition,
  IExternalDocumentation3,
  IExternalDocumentation3Definition,
  IOperation3,
  IOperation3Definition,
  IParameter3,
  IParameter3Definition,
  IRequestBody3,
  IRequestBody3Definition,
  IResponses3,
  IResponses3Definition,
  ISecurityRequirement3,
  ISecurityRequirement3Definition,
  IServer3,
  IServer3Definition,
  Parameter3,
  RequestBody3,
  Responses3,
  SecurityRequirement3,
  Server3
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { ContentType } from '../../ContentType/ContentType'
import { getExistingProcessorData } from '../../ComponentSchemaDefinition/schema-processor'
import { ISchemaProcessor } from '../../ComponentSchemaDefinition/ISchemaProcessor'
import { findAncestorComponentData } from '../common'
import { IOpenAPI3, IOpenAPI3Definition } from '../OpenAPI'
import { IResponse3Definition, IResponse3 } from '../Response'
import { IOperationParseOptions, IOperationParseRequest, IOperationParseRequestResponse } from './IOperation'
import { after } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IOperation3Definition, IOperation3> | null = null

interface IValidatorsMap {
  tags: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  summary: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation3Definition, IExternalDocumentation3>>
  operationId: ISchema.IProperty<ISchema.IString>
  parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IParameter3Definition, IParameter3>>>
  requestBody: ISchema.IProperty<ISchema.IComponent<IRequestBody3Definition, IRequestBody3>>
  responses: ISchema.IProperty<ISchema.IComponent<IResponses3Definition, IResponses3>>
  callbacks: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ICallback3Definition, ICallback3>>>
  deprecated: ISchema.IProperty<ISchema.IBoolean>
  security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISecurityRequirement3Definition, ISecurityRequirement3>>>
  servers: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IServer3Definition, IServer3>>>
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

export class Operation extends EnforcerComponent<IOperation3Definition, IOperation3> implements IOperation3 {
  [extension: `x${string}`]: any

  constructor (definition: IOperation3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'OPERATION3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#operation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#operation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#operation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#operation-object'
  }

  static getSchemaDefinition (_data: IOperationSchemaProcessor): ISchema.ISchemaDefinition<IOperation3Definition, IOperation3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IOperation3Definition, IOperation3> = {
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
    result.after = function (data, mode) {
      const { definition } = data
      after(definition, data, mode)

      if (mode === 'validate') {
        // TODO: add validations
      }

      if (mode === 'build') {
        data.lastly.add(() => {
          const openapiData: ISchemaProcessor<IOpenAPI3Definition, IOpenAPI3> | undefined =
            findAncestorComponentData<ISchemaProcessor<IOpenAPI3Definition, IOpenAPI3>>(data.chain, 'OpenAPI')
          const operation = data.built
          operation.watchProperty('consumes', () => operation.clearCache('allConsumes'))
          operation.watchProperty('produces', () => operation.clearCache('allProduces'))
          openapiData?.built.watchProperty('consumes', () => operation.clearCache('allConsumes'))
          openapiData?.built.watchProperty('produces', () => operation.clearCache('allProduces'))
        })
      }
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IOperation3Definition, version?: IVersion): ExceptionStore {
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

  get externalDocs (): IExternalDocumentation3 | undefined {
    return this.getProperty('externalDocs')
  }

  set externalDocs (value: IExternalDocumentation3 | undefined) {
    this.setProperty('externalDocs', value)
  }

  get operationId (): string | undefined {
    return this.getProperty('operationId')
  }

  set operationId (value: string | undefined) {
    this.setProperty('operationId', value)
  }

  get parameters (): IParameter3[] | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: IParameter3[] | undefined) {
    this.setProperty('parameters', value)
  }

  get requestBody (): IRequestBody3 | undefined {
    return this.getProperty('requestBody')
  }

  set requestBody (value: IRequestBody3 | undefined) {
    this.setProperty('requestBody', value)
  }

  get responses (): IResponses3 {
    return this.getProperty('responses')
  }

  set responses (value: IResponses3) {
    this.setProperty('responses', value)
  }

  get callbacks (): Record<string, ICallback3> | undefined {
    return this.getProperty('callbacks')
  }

  set callbacks (value: Record<string, ICallback3> | undefined) {
    this.setProperty('callbacks', value)
  }

  get deprecated (): boolean | undefined {
    return this.getProperty('deprecated')
  }

  set deprecated (value: boolean | undefined) {
    this.setProperty('deprecated', value)
  }

  get security (): ISecurityRequirement3[] | undefined {
    return this.getProperty('security')
  }

  set security (value: ISecurityRequirement3[] | undefined) {
    this.setProperty('security', value)
  }

  get servers (): IServer3[] | undefined {
    return this.getProperty('servers')
  }

  set servers (value: IServer3[] | undefined) {
    this.setProperty('servers', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // getResponsesThatCanProduceContentType (contentType: string | ContentType): Array<{ code: number | 'default', response: IResponse3 }> {
  //   const data = getExistingProcessorData<IOperation3Definition, IOperation3>(this)
  //   const input = [contentType]
  //   const allProducesTypes: ContentType[] = this.cached('allProduces', getAllProduces, data)
  //   const result: Array<{ code: number | 'default', response: IResponse3 }> = []
  //
  //   const match = allProducesTypes.find(c => c.findMatches(input).length > 0)
  //   if (match !== undefined) {
  //     Object.keys(this.responses).forEach(key => {
  //       if (key === 'default' || typeof key === 'number') {
  //         result.push({ code: key, response: this.responses[key] as IResponse3 })
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
    const data = getExistingProcessorData<IOperation3Definition, IOperation3>(this)
    const input = [contentType]
    const allConsumes = this.cached('allConsumes', getAllConsumes, data)
    return allConsumes
      .find(c => c.findMatches(input).length > 0) !== undefined
  }
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
function getAllConsumes (data: ISchemaProcessor<IOperation3Definition, IOperation3>): ContentType[] {
  const { definition } = data
  const content = definition.requestBody?.content
  if (content === undefined) return []

  return Object.keys(content)
    .map(ContentType.fromString)
    .filter(type => type !== undefined) as ContentType[]
}

function getAllProduces (data: ISchemaProcessor<IOperation3Definition, IOperation3>): ContentType[] {
  const { definition } = data
  const results: ContentType[] = []
  Object.keys(definition.responses ?? {})
    .forEach(code => {
      const response =
    })
}
// <!# Custom Content End: FOOTER #!>
