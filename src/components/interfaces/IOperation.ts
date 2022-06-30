import { ICallback } from './ICallback'
import { IExternalDocumentation } from './IExternalDocumentation'
import { EnforcerData } from '../index'
import { IParameter2, IParameter3, ISerializedParameterMap } from './IParameter'
import { IResponses2, IResponses3 } from './IResponses'
import { IPathItem2, IPathItem3 } from './IPathItem'
import { IRequestBody } from './IRequestBody'
import { ISecurityRequirement } from './ISecurityRequirement'
import { IServer } from './IServer'
import { MediaTypeParser } from '../../utils/MediaTypeParser'
import { Result } from '../../utils/Result'

interface IOperation<Responses> {
  extensions: Record<string, any>
  requestContentTypes: MediaTypeParser[] // acceptable request content types
  responseContentTypes: { // acceptable response content types per response code
    [code: string | number]: MediaTypeParser[]
  }

  deprecated?: boolean
  description?: string
  externalDocs?: IExternalDocumentation
  operationId?: string
  parameters?: any[] // overwritten by inheriting classes: Parameter.Parameter<HasReference>
  responses: Responses
  security?: ISecurityRequirement[]
  summary?: string
  tags?: string[]

  parseRequest: (req: IParseRequestInput, options?: IParseRequestOptions) => Result<IParseRequestResult<Operation>>
}

export interface IOperation2 extends IOperation<IResponses2> {
  enforcer: EnforcerData<IOperation2> & EnforcerDataOperation2
  consumes?: string[]
  parameters?: IParameter2[]
  produces?: string[]
  schemes?: string[]
}

export interface IOperation3 extends IOperation<IResponses3> {
  enforcer: EnforcerData<IOperation3> & EnforcerDataOperation3
  callbacks?: Record<string, ICallback>
  parameters?: IParameter3[]
  requestBody?: IRequestBody
  servers?: IServer[]
}

export interface EnforcerDataOperation2 {
  method: IMethod
  path: string
  parameters: {
    body?: IParameter2
    formData?: Record<string, IParameter2>
    header?: Record<string, IParameter2>
    path?: Record<string, IParameter2>
    query?: Record<string, IParameter2>
  }
  requiredParameters: {
    body: boolean
    formData: string[]
    header: string[]
    path: string[]
    query: string[]
  }
}

export interface EnforcerDataOperation3 {
  method: IMethod
  path: string
  parameters: {
    cookie?: Record<string, IParameter3>
    header?: Record<string, IParameter3>
    path?: Record<string, IParameter3>
    query?: Record<string, IParameter3>
  }
  requiredParameters: {
    cookie: string[]
    header: string[]
    path: string[]
    query: string[]
  }
}

export interface IGetOperationOptions {
  normalizePath?: boolean // default: true
}

export interface IGetOperationResult<Operation extends IOperation2 | IOperation3, PathItem extends IPathItem2 | IPathItem3> {
  operation: Operation
  params: Record<string, string>
  path: string
  pathItem: PathItem
}

export type IMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

export interface IParseRequestInput {
  /**
   * Body format:
   * - application/json - The body should be a JSON parsed body
   * - application/x-www-form-urlencoded - Record<string, string | string[]>
   * - multipart/form-data - Record<string, string | string[]>
   * - other - string
   */
  body?: string | any[] | Record<string, any> | undefined
  cookies?: ISerializedParameterMap
  headers?: ISerializedParameterMap
  method: IMethod
  path: string
  query?: ISerializedParameterMap
}

export interface IParseRequestOptions {
  allowOtherQueryParameters?: boolean | string[]
  decodeCookieUriComponents?: boolean
  decodeQueryStringUriComponents?: boolean
  validateInput?: boolean
}

export interface IParseRequestResult<Operation extends IOperation2 | IOperation3> {
  body?: unknown
  cookies: Record<string, unknown>
  headers: Record<string, unknown>
  operation: Operation
  params: Record<string, unknown> // path parameters
  path: string
  query: Record<string, unknown>
}
