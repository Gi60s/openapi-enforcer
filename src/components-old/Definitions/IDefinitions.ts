import { ISchema2, ISchema2Definition } from '../Schema/ISchema'
import { IComponentInstance } from '../IComponent'

export interface IDefinitions2 extends IComponentInstance {
  [name: string]: ISchema2
}

export interface IDefinitions2Definition {
  [name: string]: ISchema2Definition
}
