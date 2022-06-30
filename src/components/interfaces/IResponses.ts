import { IResponse2, IResponse3 } from './IResponse'

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
