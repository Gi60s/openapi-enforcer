import { IInfo } from './IInfo'
import { IParameter2 } from './IParameter'
import { IResponse2 } from './IResponse'
import { IDefinitions } from './IDefinitions'
import { IExternalDocumentation } from './IExternalDocumentation'
import { IPaths2 } from './IPaths'
import { ISecurityRequirement } from './ISecurityRequirement'
import { ISecurityScheme2 } from './ISecurityScheme'
import { ITag } from './ITag'
import { IPathItem2 } from './IPathItem'
import { IOperation2 } from './IOperation'
import { IOpenAPIBase } from './IOpenAPI'

export interface ISwagger extends IOpenAPIBase<IOperation2, IPathItem2> {
  extensions: Record<string, any>
  basePath?: string
  consumes?: string[]
  definitions?: IDefinitions
  externalDocs?: IExternalDocumentation
  host?: string
  info: IInfo
  parameters?: Record<string, IParameter2>
  paths: IPaths2
  produces?: string[]
  responses?: Record<string, IResponse2>
  security?: ISecurityRequirement[]
  securityDefinitions?: Record<string, ISecurityScheme2>
  schemes?: string[]
  swagger: '2.0'
  tags?: ITag[]
}
