import { IPathItem3 } from './IPathItem'

export interface ICallback {
  extensions: Record<string, any>
  expression: Record<string, IPathItem3>
}
