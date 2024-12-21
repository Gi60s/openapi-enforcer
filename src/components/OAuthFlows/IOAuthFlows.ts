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
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { ISDProperty, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IOAuthFlow3, IOAuthFlow3Definition, IOAuthFlow3a, IOAuthFlow3aDefinition } from '../OAuthFlow'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IOAuthFlows = IOAuthFlows3 | IOAuthFlows3a
export type IOAuthFlowsDefinition = IOAuthFlows3Definition | IOAuthFlows3aDefinition
export type IOAuthFlows3SchemaProcessor = SchemaProcessor<IOAuthFlows3Definition, IOAuthFlows3>
export type IOAuthFlows3aSchemaProcessor = SchemaProcessor<IOAuthFlows3aDefinition, IOAuthFlows3a>
export type IOAuthFlowsSchemaProcessor = IOAuthFlows3SchemaProcessor | IOAuthFlows3aSchemaProcessor

export interface IOAuthFlowsBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IOAuthFlows3Definition {
  [extensions: `x-${string}`]: any
  implicit?: IOAuthFlow3Definition
  password?: IOAuthFlow3Definition
  clientCredentials?: IOAuthFlow3Definition
  authorizationCode?: IOAuthFlow3Definition
}

export interface IOAuthFlows3 extends IOAuthFlowsBase {
  extensions: Record<string, any>
  implicit?: IOAuthFlow3
  password?: IOAuthFlow3
  clientCredentials?: IOAuthFlow3
  authorizationCode?: IOAuthFlow3
}

export interface IOAuthFlowsValidatorsMap3 {
  implicit: ISDProperty<ISDComponent<IOAuthFlow3Definition, IOAuthFlow3>>
  password: ISDProperty<ISDComponent<IOAuthFlow3Definition, IOAuthFlow3>>
  clientCredentials: ISDProperty<ISDComponent<IOAuthFlow3Definition, IOAuthFlow3>>
  authorizationCode: ISDProperty<ISDComponent<IOAuthFlow3Definition, IOAuthFlow3>>
}

export interface IOAuthFlows3aDefinition {
  [extensions: `x-${string}`]: any
  implicit?: IOAuthFlow3aDefinition
  password?: IOAuthFlow3aDefinition
  clientCredentials?: IOAuthFlow3aDefinition
  authorizationCode?: IOAuthFlow3aDefinition
}

export interface IOAuthFlows3a extends IOAuthFlowsBase {
  extensions: Record<string, any>
  implicit?: IOAuthFlow3a
  password?: IOAuthFlow3a
  clientCredentials?: IOAuthFlow3a
  authorizationCode?: IOAuthFlow3a
}

export interface IOAuthFlowsValidatorsMap3a {
  implicit: ISDProperty<ISDComponent<IOAuthFlow3aDefinition, IOAuthFlow3a>>
  password: ISDProperty<ISDComponent<IOAuthFlow3aDefinition, IOAuthFlow3a>>
  clientCredentials: ISDProperty<ISDComponent<IOAuthFlow3aDefinition, IOAuthFlow3a>>
  authorizationCode: ISDProperty<ISDComponent<IOAuthFlow3aDefinition, IOAuthFlow3a>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
