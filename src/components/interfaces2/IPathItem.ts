import { IOperation2, IOperation3, IOperation2Definition, IOperation3Definition } from './IOperation'
import { IParameter2, IParameter3, IParameter2Definition, IParameter3Definition } from './IParameter'
import { IReferenceDefinition } from './IReference'
import { IServer3, IServer3Definition } from './IServer'
import { IEnforcerExtensionDefinition } from './IIndex'

interface IPathItem<Operation extends IOperation2 | IOperation3, Parameter extends IParameter2 | IParameter3> {
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
  trace?: IOperation3
  servers?: IServer3[]
  summary?: string
}

interface IPathItemBaseDefinition<OperationDefinition extends IOperation2Definition | IOperation3Definition, ParameterDefinition extends IParameter2Definition | IParameter3Definition> {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  delete?: OperationDefinition
  description?: string
  get?: OperationDefinition
  head?: OperationDefinition
  options?: OperationDefinition
  parameters?: Array<ParameterDefinition | IReferenceDefinition>
  patch?: OperationDefinition
  put?: OperationDefinition
  post?: OperationDefinition
  trace?: OperationDefinition
}

export interface IPathItem2Definition extends IPathItemBaseDefinition<IOperation2Definition, IParameter2Definition> {}

export interface IPathItem3Definition extends IPathItemBaseDefinition<IOperation3Definition, IParameter3Definition> {
  servers?: IServer3Definition[]
  summary?: string
}
