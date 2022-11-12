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

export interface IXml2Definition {
  [extension: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml2 extends IComponentInstance {
  [extension: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml3Definition {
  [extension: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
