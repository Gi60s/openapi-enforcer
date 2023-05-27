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
import { ISDProperty, ISDArray, ISDString } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IServerVariable = IServerVariable3 | IServerVariable3a
export type IServerVariableDefinition = IServerVariable3Definition | IServerVariable3aDefinition
export type IServerVariable3SchemaProcessor = SchemaProcessor<IServerVariable3Definition, IServerVariable3>
export type IServerVariable3aSchemaProcessor = SchemaProcessor<IServerVariable3aDefinition, IServerVariable3a>
export type IServerVariableSchemaProcessor = IServerVariable3SchemaProcessor | IServerVariable3aSchemaProcessor

export interface IServerVariableBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IServerVariable3Definition {
  [extensions: `x-${string}`]: any
  enum?: string[]
  default: string
  description?: string
}

export interface IServerVariable3 extends IServerVariableBase {
  extensions: Record<string, any>
  enum?: string[]
  default: string
  description?: string
}

export interface IServerVariableValidatorsMap3 {
  _enum: ISDProperty<ISDArray<ISDString>>
  _default: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
}

export interface IServerVariable3aDefinition {
  [extensions: `x-${string}`]: any
  enum?: string[]
  default: string
  description?: string
}

export interface IServerVariable3a extends IServerVariableBase {
  extensions: Record<string, any>
  enum?: string[]
  default: string
  description?: string
}

export interface IServerVariableValidatorsMap3a {
  _enum: ISDProperty<ISDArray<ISDString>>
  _default: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
