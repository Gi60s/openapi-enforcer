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
import { ISDProperty, ISDString, ISDObject } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IOAuthFlow = IOAuthFlow3 | IOAuthFlow3a
export type IOAuthFlowDefinition = IOAuthFlow3Definition | IOAuthFlow3aDefinition
export type IOAuthFlow3SchemaProcessor = SchemaProcessor<IOAuthFlow3Definition, IOAuthFlow3>
export type IOAuthFlow3aSchemaProcessor = SchemaProcessor<IOAuthFlow3aDefinition, IOAuthFlow3a>
export type IOAuthFlowSchemaProcessor = IOAuthFlow3SchemaProcessor | IOAuthFlow3aSchemaProcessor

export interface IOAuthFlowBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IOAuthFlow3Definition {
  [extensions: `x-${string}`]: any
  authorizationUrl?: string
  tokenUrl?: string
  refreshUrl?: string
  scopes?: Record<string, string>
}

export interface IOAuthFlow3 extends IOAuthFlowBase {
  extensions: Record<string, any>
  authorizationUrl?: string
  tokenUrl?: string
  refreshUrl?: string
  scopes?: Record<string, string>
}

export interface IOAuthFlowValidatorsMap3 {
  authorizationUrl: ISDProperty<ISDString>
  tokenUrl: ISDProperty<ISDString>
  refreshUrl: ISDProperty<ISDString>
  scopes: ISDProperty<ISDObject<ISDString>>
}

export interface IOAuthFlow3aDefinition {
  [extensions: `x-${string}`]: any
  authorizationUrl?: string
  tokenUrl?: string
  refreshUrl?: string
  scopes?: Record<string, string>
}

export interface IOAuthFlow3a extends IOAuthFlowBase {
  extensions: Record<string, any>
  authorizationUrl?: string
  tokenUrl?: string
  refreshUrl?: string
  scopes?: Record<string, string>
}

export interface IOAuthFlowValidatorsMap3a {
  authorizationUrl: ISDProperty<ISDString>
  tokenUrl: ISDProperty<ISDString>
  refreshUrl: ISDProperty<ISDString>
  scopes: ISDProperty<ISDObject<ISDString>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
