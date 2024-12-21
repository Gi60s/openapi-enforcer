import { IResponse2, IResponse2Definition, IResponse3, IResponse3Definition } from './IResponse'
import { EnforcerExtension } from '../../index'
import { IEnforcerExtensionDefinition } from './IIndex'

export interface IResponses2 {
  response: {
    [code: string]: IResponse2
  }
}

export interface IResponses3 {
  response: {
    [code: string]: IResponse3
  }
}

interface IResponsesBaseDefinition<Definition> {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  default?: Definition
  [code: number]: Definition
}

export interface IResponses2Definition extends IResponsesBaseDefinition<IResponse2Definition> {}
export interface IResponses3Definition extends IResponsesBaseDefinition<IResponse3Definition> {}
