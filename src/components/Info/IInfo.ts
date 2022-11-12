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
  IContact2,
  IContact2Definition,
  IContact3,
  IContact3Definition,
  ILicense2,
  ILicense2Definition,
  ILicense3,
  ILicense3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export interface IInfo2Definition {
  [extension: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact2Definition
  license?: ILicense2Definition
  version: string
}

export interface IInfo2 extends IComponentInstance {
  [extension: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact2
  license?: ILicense2
  version: string
}

export interface IInfo3Definition {
  [extension: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact3Definition
  license?: ILicense3Definition
  version: string
}

export interface IInfo3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact3
  license?: ILicense3
  version: string
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
