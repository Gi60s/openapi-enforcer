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
import * as I from '../IInternalTypes'
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// <!# Custom Content End: HEADER #!>

interface IResponseComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IResponse2Definition {
  [Extensions: `x-${string}`]: any
  description: string
  schema?: I.ISchema2Definition | I.IReference2Definition
  headers?: Record<string, I.IHeader2Definition>
  examples?: I.IExample2Definition
}

export interface IResponse2 extends IResponseComponent {
  [Extensions]: Record<string, any>
  description: string
  schema?: I.ISchema2
  headers?: Record<string, I.IHeader2>
  examples?: I.IExample2
}

export interface IResponseValidatorsMap2 {
  description: Icsd.IProperty<Icsd.IString>
  schema: Icsd.IProperty<Icsd.IComponent<I.ISchema2Definition, I.ISchema2>>
  headers: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IHeader2Definition, I.IHeader2>>>
  examples: Icsd.IProperty<Icsd.IComponent<I.IExample2Definition, I.IExample2>>
}

export interface IResponse3Definition {
  [Extensions: `x-${string}`]: any
  description: string
  headers?: Record<string, I.IHeader3Definition | I.IReference3Definition>
  content?: Record<string, I.IMediaType3Definition>
  links?: Record<string, I.ILink3Definition | I.IReference3Definition>
}

export interface IResponse3 extends IResponseComponent {
  [Extensions]: Record<string, any>
  description: string
  headers?: Record<string, I.IHeader3>
  content?: Record<string, I.IMediaType3>
  links?: Record<string, I.ILink3>
}

export interface IResponseValidatorsMap3 {
  description: Icsd.IProperty<Icsd.IString>
  headers: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IHeader3Definition, I.IHeader3>>>
  content: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IMediaType3Definition, I.IMediaType3>>>
  links: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.ILink3Definition, I.ILink3>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
