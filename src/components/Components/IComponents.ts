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

interface IComponentsComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IComponents3Definition {
  [extension: `x-${string}`]: any
  schemas?: Record<string, I.ISchema3Definition>
  responses?: Record<string, I.IResponse3Definition>
  parameters?: Record<string, I.IParameter3Definition>
  examples?: Record<string, I.IExample3Definition>
  requestBodies?: Record<string, I.IRequestBody3Definition>
  headers?: Record<string, I.IHeader3Definition>
  securitySchemes?: Record<string, I.ISecurityScheme3Definition>
  links?: Record<string, I.ILink3Definition>
  callbacks?: Record<string, I.ICallback3Definition>
}

export interface IComponents3 extends IComponentsComponent {
  [extension: `x-${string}`]: any
  schemas?: Record<string, I.ISchema3>
  responses?: Record<string, I.IResponse3>
  parameters?: Record<string, I.IParameter3>
  examples?: Record<string, I.IExample3>
  requestBodies?: Record<string, I.IRequestBody3>
  headers?: Record<string, I.IHeader3>
  securitySchemes?: Record<string, I.ISecurityScheme3>
  links?: Record<string, I.ILink3>
  callbacks?: Record<string, I.ICallback3>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
