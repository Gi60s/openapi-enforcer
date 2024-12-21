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
import { ISDProperty, ISDString, ISDBoolean } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IXml = IXml2 | IXml3 | IXml3a
export type IXmlDefinition = IXml2Definition | IXml3Definition | IXml3aDefinition
export type IXml2SchemaProcessor = SchemaProcessor<IXml2Definition, IXml2>
export type IXml3SchemaProcessor = SchemaProcessor<IXml3Definition, IXml3>
export type IXml3aSchemaProcessor = SchemaProcessor<IXml3aDefinition, IXml3a>
export type IXmlSchemaProcessor = IXml2SchemaProcessor | IXml3SchemaProcessor | IXml3aSchemaProcessor

export interface IXmlBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IXml2Definition {
  [extensions: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml2 extends IXmlBase {
  extensions: Record<string, any>
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXmlValidatorsMap2 {
  name: ISDProperty<ISDString>
  namespace: ISDProperty<ISDString>
  prefix: ISDProperty<ISDString>
  attribute: ISDProperty<ISDBoolean>
  wrapped: ISDProperty<ISDBoolean>
}

export interface IXml3Definition {
  [extensions: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml3 extends IXmlBase {
  extensions: Record<string, any>
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXmlValidatorsMap3 {
  name: ISDProperty<ISDString>
  namespace: ISDProperty<ISDString>
  prefix: ISDProperty<ISDString>
  attribute: ISDProperty<ISDBoolean>
  wrapped: ISDProperty<ISDBoolean>
}

export interface IXml3aDefinition {
  [extensions: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml3a extends IXmlBase {
  extensions: Record<string, any>
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXmlValidatorsMap3a {
  name: ISDProperty<ISDString>
  namespace: ISDProperty<ISDString>
  prefix: ISDProperty<ISDString>
  attribute: ISDProperty<ISDBoolean>
  wrapped: ISDProperty<ISDBoolean>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
