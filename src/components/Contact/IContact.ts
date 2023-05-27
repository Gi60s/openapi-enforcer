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

export type IContact = IContact2 | IContact3 | IContact3a
export type IContactDefinition = IContact2Definition | IContact3Definition | IContact3aDefinition
export type IContact2SchemaProcessor = SchemaProcessor<IContact2Definition, IContact2>
export type IContact3SchemaProcessor = SchemaProcessor<IContact3Definition, IContact3>
export type IContact3aSchemaProcessor = SchemaProcessor<IContact3aDefinition, IContact3a>
export type IContactSchemaProcessor = IContact2SchemaProcessor | IContact3SchemaProcessor | IContact3aSchemaProcessor

export interface IContactBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IContact2Definition {
  [extensions: `x-${string}`]: any
  name?: string
  url?: string
  email?: string
}

export interface IContact2 extends IContactBase {
  extensions: Record<string, any>
  name?: string
  url?: string
  email?: string
}

export interface IContactValidatorsMap2 {
  name: ISDProperty<ISDString>
  url: ISDProperty<ISDString>
  email: ISDProperty<ISDString>
}

export interface IContact3Definition {
  [extensions: `x-${string}`]: any
  name?: string
  url?: string
  email?: string
}

export interface IContact3 extends IContactBase {
  extensions: Record<string, any>
  name?: string
  url?: string
  email?: string
}

export interface IContactValidatorsMap3 {
  name: ISDProperty<ISDString>
  url: ISDProperty<ISDString>
  email: ISDProperty<ISDString>
}

export interface IContact3aDefinition {
  [extensions: `x-${string}`]: any
  name?: string
  url?: string
  email?: string
}

export interface IContact3a extends IContactBase {
  extensions: Record<string, any>
  name?: string
  url?: string
  email?: string
}

export interface IContactValidatorsMap3a {
  name: ISDProperty<ISDString>
  url: ISDProperty<ISDString>
  email: ISDProperty<ISDString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
