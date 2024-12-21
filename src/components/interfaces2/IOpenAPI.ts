import { IComponents3, IComponents3Definition } from '../Components/IComponents'
import { IExternalDocumentation2, IExternalDocumentation3, IExternalDocumentation2Definition, IExternalDocumentation3Definition } from './IExternalDocumentation'
import { IInfo2, IInfo3, IInfo2Definition, IInfo3Definition } from './IInfo'
import { IFindPathsResult, IPaths2, IPaths3, IPaths2Definition, IPaths3Definition } from './IPaths'
import { ISecurityRequirement3, ISecurityRequirement3Definition, ISecurityRequirement2, ISecurityRequirement2Definition } from './ISecurityRequirement'
import { IServer3, IServer3Definition } from './IServer'
import { ITag2, ITag3, ITag2Definition, ITag3Definition } from './ITag'
import {
  IParseRequestInput,
  IParseRequestOptions,
  IParseRequestResult,
  IGetOperationResult,
  IOperation2,
  IOperation3, IMethod, IGetOperationOptions
} from './IOperation'
import { IPathItem2, IPathItem3 } from './IPathItem'
import { Result } from '../../utils/Result'
import { ISchema3 } from './ISchema'
import { IDefinitions2, IDefinitions2Definition } from '../Definitions/IDefinitions'
import { IParameter2, IParameter2Definition } from './IParameter'
import { IResponse2, IResponse2Definition } from './IResponse'
import { ISecurityScheme2, ISecurityScheme2Definition } from './ISecurityScheme'
import { IEnforcerExtensionDefinition } from './IIndex'

// protected - don't export with library
export interface IOpenAPIBase<Operation extends IOperation2 | IOperation3, PathItem extends IPathItem2 | IPathItem3> {
  FindOperation: (method: IMethod, path: string, options?: IGetOperationOptions) => IGetOperationResult<Operation, PathItem> | undefined

  /**
   * Find all paths that match the specified path string.
   * @param path
   */
  FindPaths: (path: string) => IFindPathsResult<PathItem>

  /**
   * Find an Operation object by the operation ID.
   * @param operationId The operation ID of the operation to find.
   */
  GetOperationById: (operationId: string) => Operation | undefined

  /**
   *
   * @param req The request object.
   * @param [req.body] Optional, the body as a string, array, or object. The body should have already passed through a body parser / deserializer.
   * @param [req.cookies] Optional, an object mapping cookies names to a value or an array of values.
   * @param [req.headers] Optional, an object mapping header names to a value or array of values.
   * @param req.method The lowercase HTTP method name.
   * @param req.path The path as a string. If the path includes query parameters then those will be added to anything already in the query property.
   * @param [req.query] Optional, an object mapping query parameter names to a value or array of values.
   * @param [options] Optional, configuration options.
   */
  ParseRequest: (req: IParseRequestInput, options?: IParseRequestOptions) => Result<IParseRequestResult<Operation>>

  /**
   * This function supports backward functionality. Use the GetPaths method instead.
   * @deprecated
   * @param method
   * @param path
   */
  path: (method: IMethod, path: string) => Result<{ operation: IOperation3, params: Record<string, any>, pathKey: string }>

  /**
   * This function supports backward functionality. Use the ParseRequest method instead.
   * @deprecated
   * @param req
   * @param options
   */
  request: (
    req: {
      body: any
      headers: Record<string, string>
      method: IMethod
      path: string
      query: Record<string, any>
    },
    options: {
      allowOtherQueryParameters: boolean | string[]
    })
  => Result<{
    body: any
    cookie: Record<string, any>
    headers: Record<string, any>
    operation: IOperation3
    path: Record<string, any>
    pathKey: string
    query: Record<string, any>
    response: (code: string | number, body: any, headers: Record<string, string>) => Result<{ body: any, header: Record<string, any>, schema: ISchema3 }>
  }>
}

export interface IOpenAPI extends IOpenAPIBase<IOperation3, IPathItem3> {
  extensions: Record<string, any>
  components?: IComponents3
  externalDocs?: IExternalDocumentation3
  info: IInfo3
  openapi: string
  paths: IPaths3
  security?: ISecurityRequirement3[]
  servers: IServer3[]
  tags?: ITag3[]
}

export interface ISwagger extends IOpenAPIBase<IOperation2, IPathItem2> {
  extensions: Record<string, any>
  basePath?: string
  consumes?: string[]
  definitions?: IDefinitions2
  externalDocs?: IExternalDocumentation2
  host?: string
  info: IInfo2
  parameters?: Record<string, IParameter2>
  paths: IPaths2
  produces?: string[]
  responses?: Record<string, IResponse2>
  security?: ISecurityRequirement2[]
  securityDefinitions?: Record<string, ISecurityScheme2>
  schemes?: string[]
  swagger: '2.0'
  tags?: ITag2[]
}

export interface IOpenAPI3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  components?: IComponents3Definition
  externalDocs?: IExternalDocumentation3Definition
  info: IInfo3Definition
  openapi: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
  paths: IPaths3Definition
  security?: ISecurityRequirement3Definition[]
  servers?: IServer3Definition[]
  tags?: ITag3Definition[]
}

export interface ISwagger2Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  basePath?: string
  consumes?: string[]
  definitions?: IDefinitions2Definition
  externalDocs?: IExternalDocumentation2Definition
  host?: string
  info: IInfo2Definition
  parameters?: Record<string, IParameter2Definition>
  paths: IPaths2Definition
  produces?: string[]
  responses?: Record<string, IResponse2Definition>
  security?: ISecurityRequirement2Definition[]
  securityDefinitions?: Record<string, ISecurityScheme2Definition>
  schemes?: string[]
  swagger: '2.0'
  tags?: ITag2Definition[]
}
