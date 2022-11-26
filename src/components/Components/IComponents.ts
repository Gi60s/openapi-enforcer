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
  ICallback3,
  ICallback3Definition,
  IExample3,
  IExample3Definition,
  IHeader3,
  IHeader3Definition,
  ILink3,
  ILink3Definition,
  IParameter3,
  IParameter3Definition,
  IRequestBody3,
  IRequestBody3Definition,
  IResponse3,
  IResponse3Definition,
  ISchema3,
  ISchema3Definition,
  ISecurityScheme3,
  ISecurityScheme3Definition
} from '../'
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
  schemas?: Record<string, ISchema3Definition>
  responses?: Record<string, IResponse3Definition>
  parameters?: Record<string, IParameter3Definition>
  examples?: Record<string, IExample3Definition>
  requestBodies?: Record<string, IRequestBody3Definition>
  headers?: Record<string, IHeader3Definition>
  securitySchemes?: Record<string, ISecurityScheme3Definition>
  links?: Record<string, ILink3Definition>
  callbacks?: Record<string, ICallback3Definition>
}

export interface IComponents3 extends IComponentsComponent {
  [extension: `x-${string}`]: any
  schemas?: Record<string, ISchema3>
  responses?: Record<string, IResponse3>
  parameters?: Record<string, IParameter3>
  examples?: Record<string, IExample3>
  requestBodies?: Record<string, IRequestBody3>
  headers?: Record<string, IHeader3>
  securitySchemes?: Record<string, ISecurityScheme3>
  links?: Record<string, ILink3>
  callbacks?: Record<string, ICallback3>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
