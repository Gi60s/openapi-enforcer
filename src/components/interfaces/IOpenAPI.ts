import { IComponents } from './IComponents'
import { IExternalDocumentation } from './IExternalDocumentation'
import { IInfo } from './IInfo'
import { IFindPathsResult, IPaths3 } from './IPaths'
import { ISecurityRequirement } from './ISecurityRequirement'
import { IServer } from './IServer'
import { ITag } from './ITag'
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

// protected - don't export with library
export interface IOpenAPIBase<Operation extends IOperation2 | IOperation3, PathItem extends IPathItem2 | IPathItem3> {
  findOperation: (method: IMethod, path: string, options?: IGetOperationOptions) => IGetOperationResult<Operation, PathItem> | undefined

  /**
   * Find all paths that match the specified path string.
   * @param path
   */
  findPaths: (path: string) => IFindPathsResult<PathItem>

  /**
   * Find an Operation object by the operation ID.
   * @param operationId The operation ID of the operation to find.
   */
  getOperationById: (operationId: string) => Operation | undefined

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
  parseRequest: (req: IParseRequestInput, options?: IParseRequestOptions) => Result<IParseRequestResult<Operation>>
}

export interface IOpenAPI extends IOpenAPIBase<IOperation3, IPathItem3> {
  extensions: Record<string, any>
  components?: IComponents
  externalDocs?: IExternalDocumentation
  info: IInfo
  openapi: string
  paths: IPaths3
  security?: ISecurityRequirement[]
  servers: IServer[]
  tags?: ITag[]
}
