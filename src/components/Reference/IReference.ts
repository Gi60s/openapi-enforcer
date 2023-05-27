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
import { ISDProperty, ISDString } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IReference = IReference2 | IReference3 | IReference3a
export type IReferenceDefinition = IReference2Definition | IReference3Definition | IReference3aDefinition
export type IReference2SchemaProcessor = SchemaProcessor<IReference2Definition, IReference2>
export type IReference3SchemaProcessor = SchemaProcessor<IReference3Definition, IReference3>
export type IReference3aSchemaProcessor = SchemaProcessor<IReference3aDefinition, IReference3a>
export type IReferenceSchemaProcessor = IReference2SchemaProcessor | IReference3SchemaProcessor | IReference3aSchemaProcessor

export interface IReferenceBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IReference2Definition {
  $ref: string
}

export interface IReference2 extends IReferenceBase {
  $ref: string
}

export interface IReferenceValidatorsMap2 {
  $ref: ISDProperty<ISDString>
}

export interface IReference3Definition {
  $ref: string
}

export interface IReference3 extends IReferenceBase {
  $ref: string
}

export interface IReferenceValidatorsMap3 {
  $ref: ISDProperty<ISDString>
}

export interface IReference3aDefinition {
  [extensions: `x-${string}`]: any
  $ref: string
}

export interface IReference3a extends IReferenceBase {
  extensions: Record<string, any>
  $ref: string
}

export interface IReferenceValidatorsMap3a {
  $ref: ISDProperty<ISDString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
