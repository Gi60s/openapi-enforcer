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
  IOAuthFlow3,
  IOAuthFlow3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IOAuthFlowsComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IOAuthFlows3Definition {
  [extension: `x-${string}`]: any
  implicit?: IOAuthFlow3Definition
  password?: IOAuthFlow3Definition
  clientCredentials?: IOAuthFlow3Definition
  authorizationCode?: IOAuthFlow3Definition
}

export interface IOAuthFlows3 extends IOAuthFlowsComponent {
  [extension: `x-${string}`]: any
  implicit?: IOAuthFlow3
  password?: IOAuthFlow3
  clientCredentials?: IOAuthFlow3
  authorizationCode?: IOAuthFlow3
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
