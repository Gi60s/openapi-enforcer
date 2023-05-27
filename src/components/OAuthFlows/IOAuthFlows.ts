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
import { IOAuth Flow3, IOAuth Flow3Definition, IOAuth Flow3a, IOAuth Flow3aDefinition } from '../OAuth Flow'

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
  implicit?: IOAuth Flow3Definition
  password?: IOAuth Flow3Definition
  clientCredentials?: IOAuth Flow3Definition
  authorizationCode?: IOAuth Flow3Definition
}

export interface IOAuthFlows3 extends IOAuthFlowsBase {
  extensions: Record<string, any>
  implicit?: IOAuth Flow3
  password?: IOAuth Flow3
  clientCredentials?: IOAuth Flow3
  authorizationCode?: IOAuth Flow3
}

export interface IOAuthFlowsValidatorsMap3 {
  implicit: ISDProperty<ISDComponent<IOAuth Flow3Definition, IOAuth Flow3>>
  password: ISDProperty<ISDComponent<IOAuth Flow3Definition, IOAuth Flow3>>
  clientCredentials: ISDProperty<ISDComponent<IOAuth Flow3Definition, IOAuth Flow3>>
  authorizationCode: ISDProperty<ISDComponent<IOAuth Flow3Definition, IOAuth Flow3>>
}

export interface IOAuthFlows3aDefinition {
  [extensions: `x-${string}`]: any
  implicit?: IOAuth Flow3aDefinition
  password?: IOAuth Flow3aDefinition
  clientCredentials?: IOAuth Flow3aDefinition
  authorizationCode?: IOAuth Flow3aDefinition
}

export interface IOAuthFlows3a extends IOAuthFlowsBase {
  extensions: Record<string, any>
  implicit?: IOAuth Flow3a
  password?: IOAuth Flow3a
  clientCredentials?: IOAuth Flow3a
  authorizationCode?: IOAuth Flow3a
}

export interface IOAuthFlowsValidatorsMap3a {
  implicit: ISDProperty<ISDComponent<IOAuth Flow3aDefinition, IOAuth Flow3a>>
  password: ISDProperty<ISDComponent<IOAuth Flow3aDefinition, IOAuth Flow3a>>
  clientCredentials: ISDProperty<ISDComponent<IOAuth Flow3aDefinition, IOAuth Flow3a>>
  authorizationCode: ISDProperty<ISDComponent<IOAuth Flow3aDefinition, IOAuth Flow3a>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
