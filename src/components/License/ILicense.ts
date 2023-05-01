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
import * as Icsd from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface ILicenseComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ILicense2Definition {
  [Extensions: `x-${string}`]: any
  name: string
  url?: string
}

export interface ILicense2 extends ILicenseComponent {
  [Extensions]: Record<string, any>
  name: string
  url?: string
}

export interface ILicenseValidatorsMap2 {
  name: Icsd.IProperty<Icsd.IString>
  url: Icsd.IProperty<Icsd.IString>
}

export interface ILicense3Definition {
  [Extensions: `x-${string}`]: any
  name: string
  url?: string
}

export interface ILicense3 extends ILicenseComponent {
  [Extensions]: Record<string, any>
  name: string
  url?: string
}

export interface ILicenseValidatorsMap3 {
  name: Icsd.IProperty<Icsd.IString>
  url: Icsd.IProperty<Icsd.IString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
