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

interface IXmlComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IXml2Definition {
  [Extensions: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml2 extends IXmlComponent {
  [Extensions]: Record<string, any>
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXmlValidatorsMap2 {
  name: Icsd.IProperty<Icsd.IString>
  namespace: Icsd.IProperty<Icsd.IString>
  prefix: Icsd.IProperty<Icsd.IString>
  attribute: Icsd.IProperty<Icsd.IBoolean>
  wrapped: Icsd.IProperty<Icsd.IBoolean>
}

export interface IXml3Definition {
  [Extensions: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml3 extends IXmlComponent {
  [Extensions]: Record<string, any>
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXmlValidatorsMap3 {
  name: Icsd.IProperty<Icsd.IString>
  namespace: Icsd.IProperty<Icsd.IString>
  prefix: Icsd.IProperty<Icsd.IString>
  attribute: Icsd.IProperty<Icsd.IBoolean>
  wrapped: Icsd.IProperty<Icsd.IBoolean>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
