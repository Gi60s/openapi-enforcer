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
import { ISDProperty, ISDString, ISDComponent, ISDArray } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IInfo3, IInfo3Definition, IInfo3a, IInfo3aDefinition } from '../Info'
import { IServer3, IServer3Definition, IServer3a, IServer3aDefinition } from '../Server'
import { IPaths3, IPaths3Definition, IPaths3a, IPaths3aDefinition } from '../Paths'
import { IComponents3, IComponents3Definition, IComponents3a, IComponents3aDefinition } from '../Components'
import { ISecurityRequirement3, ISecurityRequirement3Definition, ISecurityRequirement3a, ISecurityRequirement3aDefinition } from '../SecurityRequirement'
import { ITag3, ITag3Definition, ITag3a, ITag3aDefinition } from '../Tag'
import { IExternalDocumentation3, IExternalDocumentation3Definition, IExternalDocumentation3a, IExternalDocumentation3aDefinition } from '../ExternalDocumentation'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IOpenAPI = IOpenAPI3 | IOpenAPI3a
export type IOpenAPIDefinition = IOpenAPI3Definition | IOpenAPI3aDefinition
export type IOpenAPI3SchemaProcessor = SchemaProcessor<IOpenAPI3Definition, IOpenAPI3>
export type IOpenAPI3aSchemaProcessor = SchemaProcessor<IOpenAPI3aDefinition, IOpenAPI3a>
export type IOpenAPISchemaProcessor = IOpenAPI3SchemaProcessor | IOpenAPI3aSchemaProcessor

export interface IOpenAPIBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IOpenAPI3Definition {
  [extensions: `x-${string}`]: any
  openapi: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
  info: IInfo3Definition
  servers?: IServer3Definition[]
  paths: IPaths3Definition
  components?: IComponents3Definition
  security?: ISecurityRequirement3Definition[]
  tags?: ITag3Definition[]
  externalDocs?: IExternalDocumentation3Definition
}

export interface IOpenAPI3 extends IOpenAPIBase {
  extensions: Record<string, any>
  openapi: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
  info: IInfo3
  servers?: IServer3[]
  paths: IPaths3
  components?: IComponents3
  security?: ISecurityRequirement3[]
  tags?: ITag3[]
  externalDocs?: IExternalDocumentation3
}

export interface IOpenAPIValidatorsMap3 {
  openapi: ISDProperty<ISDString>
  info: ISDProperty<ISDComponent<IInfo3Definition, IInfo3>>
  servers: ISDProperty<ISDArray<ISDComponent<IServer3Definition, IServer3>>>
  paths: ISDProperty<ISDComponent<IPaths3Definition, IPaths3>>
  components: ISDProperty<ISDComponent<IComponents3Definition, IComponents3>>
  security: ISDProperty<ISDArray<ISDComponent<ISecurityRequirement3Definition, ISecurityRequirement3>>>
  tags: ISDProperty<ISDArray<ISDComponent<ITag3Definition, ITag3>>>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation3Definition, IExternalDocumentation3>>
}

export interface IOpenAPI3aDefinition {
  [extensions: `x-${string}`]: any
  openapi: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
  info: IInfo3aDefinition
  servers?: IServer3aDefinition[]
  paths: IPaths3aDefinition
  components?: IComponents3aDefinition
  security?: ISecurityRequirement3aDefinition[]
  tags?: ITag3aDefinition[]
  externalDocs?: IExternalDocumentation3aDefinition
}

export interface IOpenAPI3a extends IOpenAPIBase {
  extensions: Record<string, any>
  openapi: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
  info: IInfo3a
  servers?: IServer3a[]
  paths: IPaths3a
  components?: IComponents3a
  security?: ISecurityRequirement3a[]
  tags?: ITag3a[]
  externalDocs?: IExternalDocumentation3a
}

export interface IOpenAPIValidatorsMap3a {
  openapi: ISDProperty<ISDString>
  info: ISDProperty<ISDComponent<IInfo3aDefinition, IInfo3a>>
  servers: ISDProperty<ISDArray<ISDComponent<IServer3aDefinition, IServer3a>>>
  paths: ISDProperty<ISDComponent<IPaths3aDefinition, IPaths3a>>
  components: ISDProperty<ISDComponent<IComponents3aDefinition, IComponents3a>>
  security: ISDProperty<ISDArray<ISDComponent<ISecurityRequirement3aDefinition, ISecurityRequirement3a>>>
  tags: ISDProperty<ISDArray<ISDComponent<ITag3aDefinition, ITag3a>>>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation3aDefinition, IExternalDocumentation3a>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
