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
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IInfoComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IInfo2Definition {
  [extension: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: I.IContact2Definition
  license?: I.ILicense2Definition
  version: string
}

export interface IInfo2 extends IInfoComponent {
  [extension: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: I.IContact2
  license?: I.ILicense2
  version: string
}

export interface IInfo3Definition {
  [extension: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: I.IContact3Definition
  license?: I.ILicense3Definition
  version: string
}

export interface IInfo3 extends IInfoComponent {
  [extension: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: I.IContact3
  license?: I.ILicense3
  version: string
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
