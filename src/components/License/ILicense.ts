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

export type ILicense = ILicense2 | ILicense3 | ILicense3a
export type ILicenseDefinition = ILicense2Definition | ILicense3Definition | ILicense3aDefinition
export type ILicense2SchemaProcessor = SchemaProcessor<ILicense2Definition, ILicense2>
export type ILicense3SchemaProcessor = SchemaProcessor<ILicense3Definition, ILicense3>
export type ILicense3aSchemaProcessor = SchemaProcessor<ILicense3aDefinition, ILicense3a>
export type ILicenseSchemaProcessor = ILicense2SchemaProcessor | ILicense3SchemaProcessor | ILicense3aSchemaProcessor

export interface ILicenseBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ILicense2Definition {
  [extensions: `x-${string}`]: any
  name: string
  url?: string
}

export interface ILicense2 extends ILicenseBase {
  extensions: Record<string, any>
  name: string
  url?: string
}

export interface ILicenseValidatorsMap2 {
  name: ISDProperty<ISDString>
  url: ISDProperty<ISDString>
}

export interface ILicense3Definition {
  [extensions: `x-${string}`]: any
  name: string
  url?: string
}

export interface ILicense3 extends ILicenseBase {
  extensions: Record<string, any>
  name: string
  url?: string
}

export interface ILicenseValidatorsMap3 {
  name: ISDProperty<ISDString>
  url: ISDProperty<ISDString>
}

export interface ILicense3aDefinition {
  [extensions: `x-${string}`]: any
  name: string
  url?: string
}

export interface ILicense3a extends ILicenseBase {
  extensions: Record<string, any>
  name: string
  url?: string
}

export interface ILicenseValidatorsMap3a {
  name: ISDProperty<ISDString>
  url: ISDProperty<ISDString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
