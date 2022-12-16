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

interface IEncodingComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IEncoding3Definition {
  [extension: `x-${string}`]: any
  contentType?: string
  headers?: Record<string, I.IHeader3Definition>
  style?: string
  explode?: boolean
  allowReserved?: boolean
}

export interface IEncoding3 extends IEncodingComponent {
  [extension: `x-${string}`]: any
  contentType?: string
  headers?: Record<string, I.IHeader3>
  style?: string
  explode?: boolean
  allowReserved?: boolean
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
