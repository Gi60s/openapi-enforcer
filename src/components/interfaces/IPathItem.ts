import { IOperation2, IOperation3 } from './IOperation'
import { IParameter2, IParameter3 } from './IParameter'
import { Operation } from '../v3/Operation'
import { Server } from '../v3/Server'

interface IPathItem<Operation, Parameter> {
  extensions: Record<string, any>
  delete?: Operation
  get?: Operation
  head?: Operation
  options?: Operation
  parameters?: Parameter[]
  patch?: Operation
  put?: Operation
  post?: Operation
}

export interface IPathItem2 extends IPathItem<IOperation2, IParameter2> {}

export interface IPathItem3 extends IPathItem<IOperation3, IParameter3> {
  description?: string
  trace?: Operation
  servers?: Server[]
  summary?: string
}
