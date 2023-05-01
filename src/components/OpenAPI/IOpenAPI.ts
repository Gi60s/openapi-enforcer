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

interface IOpenAPIComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IOpenAPI3Definition {
  [Extensions: `x-${string}`]: any
  openapi: '3.0.0'|'3.0.1'|'3.0.2'|'3.0.3'
  info: I.IInfo3Definition
  servers?: I.IServer3Definition[]
  paths: I.IPaths3Definition
  components?: I.IComponents3Definition
  security?: I.ISecurityRequirement3Definition[]
  tags?: I.ITag3Definition[]
  externalDocs?: I.IExternalDocumentation3Definition
}

export interface IOpenAPI3 extends IOpenAPIComponent {
  [Extensions]: Record<string, any>
  openapi: '3.0.0'|'3.0.1'|'3.0.2'|'3.0.3'
  info: I.IInfo3
  servers?: I.IServer3[]
  paths: I.IPaths3
  components?: I.IComponents3
  security?: I.ISecurityRequirement3[]
  tags?: I.ITag3[]
  externalDocs?: I.IExternalDocumentation3
}

export interface IOpenAPIValidatorsMap3 {
  openapi: Icsd.IProperty<Icsd.IString>
  info: Icsd.IProperty<Icsd.IComponent<I.IInfo3Definition, I.IInfo3>>
  servers: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.IServer3Definition, I.IServer3>>>
  paths: Icsd.IProperty<Icsd.IComponent<I.IPaths3Definition, I.IPaths3>>
  components: Icsd.IProperty<Icsd.IComponent<I.IComponents3Definition, I.IComponents3>>
  security: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.ISecurityRequirement3Definition, I.ISecurityRequirement3>>>
  tags: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.ITag3Definition, I.ITag3>>>
  externalDocs: Icsd.IProperty<Icsd.IComponent<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
