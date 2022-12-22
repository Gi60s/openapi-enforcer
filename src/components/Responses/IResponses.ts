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

interface IResponsesComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IResponses2Definition {
  [Extensions]: Record<string, any>
  [key: number]: I.IResponse2Definition
  default?: I.IResponse2Definition
}

export interface IResponses2 extends IResponsesComponent {
  [Extensions]: Record<string, any>
  [key: number]: I.IResponse2
  default?: I.IResponse2
}

export interface IResponses3Definition {
  [Extensions]: Record<string, any>
  [key: number]: I.IResponse3Definition
  default?: I.IResponse3Definition
}

export interface IResponses3 extends IResponsesComponent {
  [Extensions]: Record<string, any>
  [key: number]: I.IResponse3
  default?: I.IResponse3
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
