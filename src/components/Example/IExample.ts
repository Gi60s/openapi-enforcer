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

export interface IExample2Definition {
  [key: string]: any
}
export interface IExample2 extends IComponentInstance {
  [key: string]: any
}
export interface IExample3Definition {
  [extension: `x-${string}`]: any
  summary?: string
  description?: string
  value?: any
  externalValue?: string
}
export interface IExample3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  summary?: string
  description?: string
  value?: any
  externalValue?: string
}
