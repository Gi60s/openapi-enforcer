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
import * as Icsd from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as I from '../IInternalTypes'
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import { ContentType } from '../../ContentType/ContentType'
// <!# Custom Content End: HEADER #!>

interface IOperationComponent extends IComponentInstance {
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
  [Extensions: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: I.IExternalDocumentation2Definition
  operationId?: string
  consumes?: string[]
  produces?: string[]
  parameters?: Array<I.IParameter2Definition | I.IReference2Definition>
  responses: I.IResponses2Definition
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  deprecated?: boolean
  security?: I.ISecurityRequirement2Definition[]
}

export interface IOperation2 extends IOperationComponent {
  [Extensions]: Record<string, any>
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: I.IExternalDocumentation2
  operationId?: string
  consumes?: string[]
  produces?: string[]
  parameters?: I.IParameter2[]
  responses: I.IResponses2
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  deprecated?: boolean
  security?: I.ISecurityRequirement2[]
}

export interface IOperationValidatorsMap2 {
  tags: Icsd.IProperty<Icsd.IArray<Icsd.IString>>
  summary: Icsd.IProperty<Icsd.IString>
  description: Icsd.IProperty<Icsd.IString>
  externalDocs: Icsd.IProperty<Icsd.IComponent<I.IExternalDocumentation2Definition, I.IExternalDocumentation2>>
  operationId: Icsd.IProperty<Icsd.IString>
  consumes: Icsd.IProperty<Icsd.IArray<Icsd.IString>>
  produces: Icsd.IProperty<Icsd.IArray<Icsd.IString>>
  parameters: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.IParameter2Definition, I.IParameter2>>>
  responses: Icsd.IProperty<Icsd.IComponent<I.IResponses2Definition, I.IResponses2>>
  schemes: Icsd.IProperty<Icsd.IArray<Icsd.IString>>
  deprecated: Icsd.IProperty<Icsd.IBoolean>
  security: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.ISecurityRequirement2Definition, I.ISecurityRequirement2>>>
}

export interface IOperation3Definition {
  [Extensions: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: I.IExternalDocumentation3Definition
  operationId?: string
  parameters?: Array<I.IParameter3Definition | I.IReference3Definition>
  requestBody?: I.IRequestBody3Definition | I.IReference3Definition
  responses: I.IResponses3Definition
  callbacks?: Record<string, I.ICallback3Definition | I.IReference3Definition>
  deprecated?: boolean
  security?: I.ISecurityRequirement3Definition[]
  servers?: I.IServer3Definition[]
}

export interface IOperation3 extends IOperationComponent {
  [Extensions]: Record<string, any>
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: I.IExternalDocumentation3
  operationId?: string
  parameters?: I.IParameter3[]
  requestBody?: I.IRequestBody3
  responses: I.IResponses3
  callbacks?: Record<string, I.ICallback3>
  deprecated?: boolean
  security?: I.ISecurityRequirement3[]
  servers?: I.IServer3[]
}

export interface IOperationValidatorsMap3 {
  tags: Icsd.IProperty<Icsd.IArray<Icsd.IString>>
  summary: Icsd.IProperty<Icsd.IString>
  description: Icsd.IProperty<Icsd.IString>
  externalDocs: Icsd.IProperty<Icsd.IComponent<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>>
  operationId: Icsd.IProperty<Icsd.IString>
  parameters: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.IParameter3Definition, I.IParameter3>>>
  requestBody: Icsd.IProperty<Icsd.IComponent<I.IRequestBody3Definition, I.IRequestBody3>>
  responses: Icsd.IProperty<Icsd.IComponent<I.IResponses3Definition, I.IResponses3>>
  callbacks: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.ICallback3Definition, I.ICallback3>>>
  deprecated: Icsd.IProperty<Icsd.IBoolean>
  security: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.ISecurityRequirement3Definition, I.ISecurityRequirement3>>>
  servers: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.IServer3Definition, I.IServer3>>>
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
