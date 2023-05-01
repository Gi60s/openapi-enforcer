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
import * as Icsd from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IOAuthFlowComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IOAuthFlow3Definition {
  [Extensions: `x-${string}`]: any
  authorizationUrl?: string
  tokenUrl?: string
  refreshUrl?: string
  scopes?: Record<string, string>
}

export interface IOAuthFlow3 extends IOAuthFlowComponent {
  [Extensions]: Record<string, any>
  authorizationUrl?: string
  tokenUrl?: string
  refreshUrl?: string
  scopes?: Record<string, string>
}

export interface IOAuthFlowValidatorsMap3 {
  authorizationUrl: Icsd.IProperty<Icsd.IString>
  tokenUrl: Icsd.IProperty<Icsd.IString>
  refreshUrl: Icsd.IProperty<Icsd.IString>
  scopes: Icsd.IProperty<Icsd.IObject<Icsd.IString>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
