import { ISchema2, ISchema2Definition } from '../interfaces2/ISchema'

export interface IDefinitions2 {
  definition: {
    [name: string]: ISchema2
  }
}

export interface IDefinitions2Definition {
  [name: string]: ISchema2Definition
}
