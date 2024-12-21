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
import { IPathItem2, IPathItem2Definition, IPathItem3, IPathItem3Definition } from '../PathItem'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IPaths = IPaths2 | IPaths3 | IPaths3a
export type IPathsDefinition = IPaths2Definition | IPaths3Definition | IPaths3aDefinition
export type IPaths2SchemaProcessor = SchemaProcessor<IPaths2Definition, IPaths2>
export type IPaths3SchemaProcessor = SchemaProcessor<IPaths3Definition, IPaths3>
export type IPaths3aSchemaProcessor = SchemaProcessor<IPaths3aDefinition, IPaths3a>
export type IPathsSchemaProcessor = IPaths2SchemaProcessor | IPaths3SchemaProcessor | IPaths3aSchemaProcessor

export interface IPathsBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IPaths2Definition {
  [extensions: `x-${string}`]: any
  [path: `/${string}`]: IPathItem2Definition
}

export interface IPaths2 extends IPathsBase {
  extensions: Record<string, any>
  properties: {
    [path: `/${string}`]: IPathItem2
  }
}

export interface IPaths3Definition {
  [extensions: `x-${string}`]: any
  [path: `/${string}`]: IPathItem3Definition
}

export interface IPaths3 extends IPathsBase {
  extensions: Record<string, any>
  properties: {
    [path: `/${string}`]: IPathItem3
  }
}

export interface IPaths3aDefinition {
  [extensions: `x-${string}`]: any
}

export interface IPaths3a extends IPathsBase {
  extensions: Record<string, any>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
