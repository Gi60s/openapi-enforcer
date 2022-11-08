/*
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!   IMPORTANT   !!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *  A portion of this file has been created from a template. You can only edit
 *  content in some regions within this file. Look for a region that begins with
 *  // <!# Custom Content Begin: *** #!>
 *  and ends with
 *  // <!# Custom Content End: *** #!>
 *  where the *** is replaced by a string of some value. Within these custom
 *  content regions you can edit the file without worrying about a loss of your
 *  code.
 */

import { IComponentInstance } from '../IComponent'
import {
  IResponse2,
  IResponse2Definition,
  IResponse3,
  IResponse3Definition
} from '../'

export interface IResponses2Definition {
  [extension: `x-${string}`]: any
  [key: number]: IResponse2Definition
  default?: IResponse2Definition
}
export interface IResponses2 extends IComponentInstance {
  [extension: `x-${string}`]: any
  [key: number]: IResponse2
  default?: IResponse2
}
export interface IResponses3Definition {
  [extension: `x-${string}`]: any
  [key: number]: IResponse3Definition
  default?: IResponse3Definition
}
export interface IResponses3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  [key: number]: IResponse3
  default?: IResponse3
}
