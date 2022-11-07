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
import { IOAuth Flow3, IOAuth Flow3Definition } from '../OAuth Flow/IOAuth Flow'

export interface IOAuthFlows3Definition {
  [extension: `x-${string}`]: any
  implicit?: IOAuth Flow3Definition
  password?: IOAuth Flow3Definition
  clientCredentials?: IOAuth Flow3Definition
  authorizationCode?: IOAuth Flow3Definition
}

export interface IOAuthFlows3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  implicit?: IOAuth Flow3
  password?: IOAuth Flow3
  clientCredentials?: IOAuth Flow3
  authorizationCode?: IOAuth Flow3
}

