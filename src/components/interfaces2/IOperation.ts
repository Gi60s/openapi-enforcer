import { ICallback } from '../../components2/Callback/ICallback'
import { IExternalDocumentation2, IExternalDocumentation2Definition, IExternalDocumentation3, IExternalDocumentation3Definition } from './IExternalDocumentation'
import { EnforcerData, EnforcerExtension } from '../../index'
import { IParameter2, IParameter3, ISerializedParameterMap } from './IParameter'
import { IResponses2, IResponses3 } from './IResponses'
import { IPathItem2, IPathItem3 } from './IPathItem'
import { IRequestBody3, IRequestBody3Definition } from './IRequestBody'
import { ISecurityRequirement2, ISecurityRequirement2Definition, ISecurityRequirement3, ISecurityRequirement3Definition } from './ISecurityRequirement'
import { IServer } from './IServer'
import { MediaTypeParser } from '../../utils/MediaTypeParser'
import { Result } from '../../utils/Result'

interface IOperation<
  IExternalDocumentation extends IExternalDocumentation2 | IExternalDocumentation3,
  IOperation extends IOperation2 | IOperation3,
  IResponses extends IResponses2 | IResponses3,
  ISecurityRequirement extends ISecurityRequirement2 | ISecurityRequirement3
  > {
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
  responses: IResponses
  security?: ISecurityRequirement[]
  summary?: string
  tags?: string[]

  ParseRequest: (req: IParseRequestInput, options?: IParseRequestOptions) => Result<IParseRequestResult<IOperation>>
}

export interface IOperation2 extends IOperation<IResponses2> {
  enforcer: EnforcerData<IOperation2> & EnforcerDataOperation<IParameter2>
  consumes?: string[]
  parameters?: IParameter2[]
  produces?: string[]
  schemes?: string[]
}

export interface IOperation3 extends IOperation<IResponses3> {
  enforcer: EnforcerData<IOperation3> & EnforcerDataOperation<IParameter3>
  callbacks?: Record<string, ICallback>
  parameters?: IParameter3[]
  requestBody?: IRequestBody3
  servers?: IServer[]
}

interface IOperationBaseDefinition {
  [key: `x-${string}`]: any
  'x-enforcer'?: EnforcerExtension
  deprecated?: boolean
  description?: string
  externalDocs?: IExternalDocumentation2Definition | IExternalDocumentation3Definition
  operationId?: string
  parameters?: IParameter2Definition[] | IParameter3Definition[]
  responses: IResponses2Definition | IResponses3Definition
  security?: ISecurityRequirement2Definition[] | ISecurityRequirement3Definition[]
  summary?: string
  tags?: string[]
}

export interface IOperation2Definition extends IOperationBaseDefinition {
  'x-enforcer'?: EnforcerExtension
  consumes?: string[]
  parameters?: IParameter2Definition[]
  produces?: string[]
  responses: IResponses2Definition
  schemes?: string[]
}

export interface IOperation3Definition extends IOperationBaseDefinition {
  'x-enforcer'?: EnforcerExtension
  callbacks?: Record<string, ICallback3Definition | IReferenceDefinition>
  parameters?: IParameter3Definition[]
  requestBody?: IRequestBody3Definition | IReferenceDefinition
  responses: IResponses3Definition
  servers?: IServer3Definition[]
}


interface EnforcerDataOperation <IParameter extends IParameter2 | IParameter3> {
  method: IMethod
  path: string
  parameters: {
    body?: IParameter
    formData?: Record<string, IParameter>
    header?: Record<string, IParameter>
    path?: Record<string, IParameter>
    query?: Record<string, IParameter>
  }
  requiredParameters: {
    body: boolean
    formData: string[]
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
