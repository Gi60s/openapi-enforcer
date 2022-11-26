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
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IContactComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IContact2Definition {
  [extension: `x-${string}`]: any
  name?: string
  url?: string
  email?: string
}

export interface IContact2 extends IContactComponent {
  [extension: `x-${string}`]: any
  name?: string
  url?: string
  email?: string
}

export interface IContact3Definition {
  [extension: `x-${string}`]: any
  name?: string
  url?: string
  email?: string
}

export interface IContact3 extends IContactComponent {
  [extension: `x-${string}`]: any
  name?: string
  url?: string
  email?: string
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
