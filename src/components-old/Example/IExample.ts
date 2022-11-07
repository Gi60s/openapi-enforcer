import { IComponentClass } from '../IComponent'

export interface IExample2 extends IComponentClass<IExample2Definition, IExample2> {
  [mimeType: string]: any
}

export interface IExample2Definition {
  [mimeType: string]: any
}

export interface IExample3 extends IComponentClass<IExample3Definition, IExample3> {
  [key: `x${string}`]: any
  description?: string
  externalValue?: string
  summary?: string
  value?: any
}

export interface IExample3Definition {
  [key: `x-${string}`]: any
  description?: string
  externalValue?: string
  summary?: string
  value?: any
}
