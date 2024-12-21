import { IPathItem2, IPathItem3 } from './IPathItem'
import { IGetOperationResult, IGetOperationOptions, IMethod, IOperation2, IOperation3 } from './IOperation'
import { EnforcerExtension } from '../../index'
import { IEnforcerExtensionDefinition } from './IIndex'

interface IPaths<Operation extends IOperation2 | IOperation3, PathItem extends IPathItem2 | IPathItem3> {
  extensions: Record<string, any>
  paths: {
    [path: string]: PathItem
  }

  findOperation: (method: IMethod, path: string, options?: IGetOperationOptions) => IGetOperationResult<Operation, PathItem>
  findPaths: (path: string) => IFindPathsResult<PathItem>
}

export interface IPaths2 extends IPaths<IOperation2, IPathItem2> {

}

export interface IPaths3 extends IPaths<IOperation3, IPathItem3> {

}

interface IPathsDefinitionBase<PathItemDefinition> {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  [path: `/${string}`]: PathItemDefinition
}

export interface IPaths2Definition extends IPathsDefinitionBase<IPaths2Definition> {}

export interface IPaths3Definition extends IPathsDefinitionBase<IPaths3Definition> {}

export type IFindPathsResult<PathItem extends IPathItem2 | IPathItem3> = Array<IFindPathsResulItem<PathItem>>

export interface IFindPathsResulItem<PathItem extends IPathItem2 | IPathItem3> {
  params: Record<string, string>
  path: string
  pathItem: PathItem
}
