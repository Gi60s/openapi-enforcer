import { IPathItem3, IPathItem3Definition } from '../PathItem/IPathItem'
import { IComponentInstance } from '../IComponent'

export interface ICallback3 extends IComponentInstance {
  [expression: string]: IPathItem3
}

export interface ICallback3Definition {
  [extension: `x-${string}`]: any
  [expression: string]: IPathItem3Definition
}
