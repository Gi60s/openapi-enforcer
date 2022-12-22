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
import * as I from '../IInternalTypes'
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IPathsComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IPaths2Definition {
  [Extensions]: Record<string, any>
  [key: `/${string}`]: I.IPathItem2Definition
}

export interface IPaths2 extends IPathsComponent {
  [Extensions]: Record<string, any>
  [key: `/${string}`]: I.IPathItem2
}

export interface IPaths3Definition {
  [Extensions]: Record<string, any>
  [key: `/${string}`]: I.IPathItem3Definition
}

export interface IPaths3 extends IPathsComponent {
  [Extensions]: Record<string, any>
  [key: `/${string}`]: I.IPathItem3
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
