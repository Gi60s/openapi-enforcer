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
import { IPathItem3, IPathItem3Definition } from '../PathItem'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type ICallback = ICallback3 | ICallback3a
export type ICallbackDefinition = ICallback3Definition | ICallback3aDefinition
export type ICallback3SchemaProcessor = SchemaProcessor<ICallback3Definition, ICallback3>
export type ICallback3aSchemaProcessor = SchemaProcessor<ICallback3aDefinition, ICallback3a>
export type ICallbackSchemaProcessor = ICallback3SchemaProcessor | ICallback3aSchemaProcessor

export interface ICallbackBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ICallback3Definition {
  [extensions: `x-${string}`]: any
  [path: `http${string}`]: [path: `http${string}`]: IPathItem3Definition
  [path: `{$${string}`]: [path: `{$${string}`]: IPathItem3Definition
}

export interface ICallback3 extends ICallbackBase {
  extensions: Record<string, any>
  [path: `http${string}`]: [path: `http${string}`]: IPathItem3
  [path: `{$${string}`]: [path: `{$${string}`]: IPathItem3
}

export interface ICallback3aDefinition {
  [extensions: `x-${string}`]: any
}

export interface ICallback3a extends ICallbackBase {
  extensions: Record<string, any>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
