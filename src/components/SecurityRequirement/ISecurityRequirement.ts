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

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type ISecurityRequirement = ISecurityRequirement2 | ISecurityRequirement3 | ISecurityRequirement3a
export type ISecurityRequirementDefinition = ISecurityRequirement2Definition | ISecurityRequirement3Definition | ISecurityRequirement3aDefinition
export type ISecurityRequirement2SchemaProcessor = SchemaProcessor<ISecurityRequirement2Definition, ISecurityRequirement2>
export type ISecurityRequirement3SchemaProcessor = SchemaProcessor<ISecurityRequirement3Definition, ISecurityRequirement3>
export type ISecurityRequirement3aSchemaProcessor = SchemaProcessor<ISecurityRequirement3aDefinition, ISecurityRequirement3a>
export type ISecurityRequirementSchemaProcessor = ISecurityRequirement2SchemaProcessor | ISecurityRequirement3SchemaProcessor | ISecurityRequirement3aSchemaProcessor

export interface ISecurityRequirementBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ISecurityRequirement2Definition {
  string: string[]
}

export interface ISecurityRequirement2 extends ISecurityRequirementBase {
  properties: {
    string: string[]
  }
}

export interface ISecurityRequirement3Definition {
  string: string[]
}

export interface ISecurityRequirement3 extends ISecurityRequirementBase {
  properties: {
    string: string[]
  }
}

export interface ISecurityRequirement3aDefinition {
  [extensions: `x-${string}`]: any
}

export interface ISecurityRequirement3a extends ISecurityRequirementBase {
  extensions: Record<string, any>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
