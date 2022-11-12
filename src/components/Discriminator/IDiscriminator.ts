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

export interface IDiscriminator3Definition {
  propertyName: string
  mapping?: Record<string, string>
}

export interface IDiscriminator3 extends IComponentInstance {
  propertyName: string
  mapping?: Record<string, string>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
