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
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface ITagComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ITag2Definition {
  [Extensions: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: I.IExternalDocumentation2Definition
}

export interface ITag2 extends ITagComponent {
  [Extensions]: Record<string, any>
  name: string
  description?: string
  externalDocs?: I.IExternalDocumentation2
}

export interface ITagValidatorsMap2 {
  name: Icsd.IProperty<Icsd.IString>
  description: Icsd.IProperty<Icsd.IString>
  externalDocs: Icsd.IProperty<Icsd.IComponent<I.IExternalDocumentation2Definition, I.IExternalDocumentation2>>
}

export interface ITag3Definition {
  [Extensions: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: I.IExternalDocumentation3Definition
}

export interface ITag3 extends ITagComponent {
  [Extensions]: Record<string, any>
  name: string
  description?: string
  externalDocs?: I.IExternalDocumentation3
}

export interface ITagValidatorsMap3 {
  name: Icsd.IProperty<Icsd.IString>
  description: Icsd.IProperty<Icsd.IString>
  externalDocs: Icsd.IProperty<Icsd.IComponent<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
