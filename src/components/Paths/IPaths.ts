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
import { IPath2, IPath2Definition, IPath3, IPath3Definition } from '../Path/IPath'

export interface IPaths2Definition {
  [extension: `x-${string}`]: any
  [key: `/${string}`]: IPath2Definition
}

export interface IPaths2 extends IComponentInstance {
  [extension: `x-${string}`]: any
  [key: `/${string}`]: IPath2
}

export interface IPaths3Definition {
  [extension: `x-${string}`]: any
  [key: `/${string}`]: IPath3Definition
}

export interface IPaths3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  [key: `/${string}`]: IPath3
}

