import { IPathItem3, IPathItem3Definition } from '../../temp-components/interfaces/IPathItem'

export interface ICallback3 {
  extensions: Record<string, any>
  expression: Record<string, IPathItem3>
}

export interface ICallback3Definition {
  [key: `x-${string}`]: any
  [expression: string]: IPathItem3Definition
}
