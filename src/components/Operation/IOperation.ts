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

import { IComponentInstance } from '../IComponent'
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { ISDProperty, ISDArray, ISDString, ISDComponent, ISDBoolean, ISDObject } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IExternalDocumentation2, IExternalDocumentation2Definition, IExternalDocumentation3, IExternalDocumentation3Definition, IExternalDocumentation3a, IExternalDocumentation3aDefinition } from '../ExternalDocumentation'
import { IResponses2, IResponses2Definition, IResponses3, IResponses3Definition, IResponses3a, IResponses3aDefinition } from '../Responses'
import { IRequestBody3, IRequestBody3Definition, IRequestBody3a, IRequestBody3aDefinition } from '../RequestBody'
import { IReference3, IReference3Definition, IReference3a, IReference3aDefinition } from '../Reference'

// <!# Custom Content Begin: HEADER #!>
import { ContentType } from '../../ContentType/ContentType'
// <!# Custom Content End: HEADER #!>

export type IOperation = IOperation2 | IOperation3 | IOperation3a
export type IOperationDefinition = IOperation2Definition | IOperation3Definition | IOperation3aDefinition
export type IOperation2SchemaProcessor = SchemaProcessor<IOperation2Definition, IOperation2>
export type IOperation3SchemaProcessor = SchemaProcessor<IOperation3Definition, IOperation3>
export type IOperation3aSchemaProcessor = SchemaProcessor<IOperation3aDefinition, IOperation3a>
export type IOperationSchemaProcessor = IOperation2SchemaProcessor | IOperation3SchemaProcessor | IOperation3aSchemaProcessor

export interface IOperationBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // getResponsesThatCanProduceContentType: (contentType: string | ContentType) => Array<{ code: number | 'default', response: IResponse2 }>
  getAcceptedResponseTypes: (statusCode: number | 'default', accepted: string) => ContentType[]
  parseBody: (body: string | object, options?: IOperationParseOptions) => any
  parseHeaders: (headers: Record<string, string>, options?: IOperationParseOptions) => Record<string, any>
  parsePath: (path: string, options?: IOperationParseOptions) => Record<string, any>
  parseQuery: (query: string, options?: IOperationParseOptions & { allowOtherQueryParameters?: boolean }) => Record<string, string | string[] | undefined>
  parseRequest: (request: IOperationParseRequest, options?: IOperationParseOptions & { allowOtherQueryParameters?: boolean }) => IOperationParseRequestResponse
  willAcceptContentType: (contentType: string | ContentType) => boolean
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IOperation2Definition {
  [extensions: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation2Definition
  operationId?: string
  consumes?: string[]
  produces?: string[]
  parameters?: Array<IParameter2Definition | IReference2Definition>
  responses: IResponses2Definition
  schemes?: Array<'http' | 'https' | 'ws' | 'wss'>
  deprecated?: boolean
  security?: ISecurityRequirement2Definition[]
}

export interface IOperation2 extends IOperationBase {
  extensions: Record<string, any>
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation2
  operationId?: string
  consumes?: string[]
  produces?: string[]
  parameters?: Array<IParameter2 | IReference2>
  responses: IResponses2
  schemes?: Array<'http' | 'https' | 'ws' | 'wss'>
  deprecated?: boolean
  security?: ISecurityRequirement2[]
}

export interface IOperationValidatorsMap2 {
  tags: ISDProperty<ISDArray<ISDString>>
  summary: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation2Definition, IExternalDocumentation2>>
  operationId: ISDProperty<ISDString>
  consumes: ISDProperty<ISDArray<ISDString>>
  produces: ISDProperty<ISDArray<ISDString>>
  parameters: ISDProperty<ISDArray<ISDComponent<IParameter2Definition, IParameter2> | ISDComponent<IReference2Definition, IReference2>>>
  responses: ISDProperty<ISDComponent<IResponses2Definition, IResponses2>>
  schemes: ISDProperty<ISDArray<ISDString>>
  deprecated: ISDProperty<ISDBoolean>
  security: ISDProperty<ISDArray<ISDComponent<ISecurityRequirement2Definition, ISecurityRequirement2>>>
}

export interface IOperation3Definition {
  [extensions: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation3Definition
  operationId?: string
  parameters?: Array<IParameter3Definition | IReference3Definition>
  requestBody?: IRequestBody3Definition | IReference3Definition
  responses: IResponses3Definition
  callbacks?: Record<string, ICallback3Definition | IReference3Definition>
  deprecated?: boolean
  security?: ISecurityRequirement3Definition[]
  servers?: IServer3Definition[]
}

export interface IOperation3 extends IOperationBase {
  extensions: Record<string, any>
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation3
  operationId?: string
  parameters?: Array<IParameter3 | IReference3>
  requestBody?: IRequestBody3 | IReference3
  responses: IResponses3
  callbacks?: Record<string, ICallback3 | IReference3>
  deprecated?: boolean
  security?: ISecurityRequirement3[]
  servers?: IServer3[]
}

export interface IOperationValidatorsMap3 {
  tags: ISDProperty<ISDArray<ISDString>>
  summary: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation3Definition, IExternalDocumentation3>>
  operationId: ISDProperty<ISDString>
  parameters: ISDProperty<ISDArray<ISDComponent<IParameter3Definition, IParameter3> | ISDComponent<IReference3Definition, IReference3>>>
  requestBody: ISDProperty<ISDComponent<IRequestBody3Definition, IRequestBody3> | ISDComponent<IReference3Definition, IReference3>>
  responses: ISDProperty<ISDComponent<IResponses3Definition, IResponses3>>
  callbacks: ISDProperty<ISDObject<ISDComponent<ICallback3Definition, ICallback3> | ISDComponent<IReference3Definition, IReference3>>>
  deprecated: ISDProperty<ISDBoolean>
  security: ISDProperty<ISDArray<ISDComponent<ISecurityRequirement3Definition, ISecurityRequirement3>>>
  servers: ISDProperty<ISDArray<ISDComponent<IServer3Definition, IServer3>>>
}

export interface IOperation3aDefinition {
  [extensions: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation3aDefinition
  operationId?: string
  parameters?: Array<IParameter3aDefinition | IReference3aDefinition>
  requestBody?: IRequestBody3aDefinition | IReference3aDefinition
  responses: IResponses3aDefinition
  callbacks?: Record<string, ICallback3aDefinition | IReference3aDefinition>
  deprecated?: boolean
  security?: ISecurityRequirement3aDefinition[]
  servers?: IServer3aDefinition[]
}

export interface IOperation3a extends IOperationBase {
  extensions: Record<string, any>
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation3a
  operationId?: string
  parameters?: Array<IParameter3a | IReference3a>
  requestBody?: IRequestBody3a | IReference3a
  responses: IResponses3a
  callbacks?: Record<string, ICallback3a | IReference3a>
  deprecated?: boolean
  security?: ISecurityRequirement3a[]
  servers?: IServer3a[]
}

export interface IOperationValidatorsMap3a {
  tags: ISDProperty<ISDArray<ISDString>>
  summary: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation3aDefinition, IExternalDocumentation3a>>
  operationId: ISDProperty<ISDString>
  parameters: ISDProperty<ISDArray<ISDComponent<IParameter3aDefinition, IParameter3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  requestBody: ISDProperty<ISDComponent<IRequestBody3aDefinition, IRequestBody3a> | ISDComponent<IReference3aDefinition, IReference3a>>
  responses: ISDProperty<ISDComponent<IResponses3aDefinition, IResponses3a>>
  callbacks: ISDProperty<ISDObject<ISDComponent<ICallback3aDefinition, ICallback3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  deprecated: ISDProperty<ISDBoolean>
  security: ISDProperty<ISDArray<ISDComponent<ISecurityRequirement3aDefinition, ISecurityRequirement3a>>>
  servers: ISDProperty<ISDArray<ISDComponent<IServer3aDefinition, IServer3a>>>
}

// <!# Custom Content Begin: FOOTER #!>
export interface IOperationParseRequest {
  body?: string | object
  cookies?: Record<string, string>
  headers?: Record<string, string>
  path?: Record<string, string>
  query?: Record<string, string | string[] | undefined>
}

export interface IOperationParseRequestResponse {
  body?: any
  cookies?: Record<string, any>
  headers?: Record<string, any>
  path?: Record<string, any>
  query?: Record<string, any>
}

export interface IOperationParseOptions {
  validate?: boolean
}
// <!# Custom Content End: FOOTER #!>
