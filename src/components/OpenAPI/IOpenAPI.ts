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
import { IInfo3, IInfo3Definition } from '../Info/IInfo'
import { IServer3, IServer3Definition } from '../Server/IServer'
import { IPaths3, IPaths3Definition } from '../Paths/IPaths'
import { IComponents3, IComponents3Definition } from '../Components/IComponents'
import { ISecurityRequirement3, ISecurityRequirement3Definition } from '../SecurityRequirement/ISecurityRequirement'
import { ITag3, ITag3Definition } from '../Tag/ITag'
import { IExternalDocumentation3, IExternalDocumentation3Definition } from '../ExternalDocumentation/IExternalDocumentation'

export interface IOpenAPI3Definition {
  [extension: `x-${string}`]: any
  openapi: '3.0.0'|'3.0.1'|'3.0.2'|'3.0.3'
  info: IInfo3Definition
  servers?: IServer3Definition[]
  paths: IPaths3Definition
  components?: IComponents3Definition
  security?: ISecurityRequirement3Definition[]
  tags?: ITag3Definition[]
  externalDocs?: IExternalDocumentation3Definition
}

export interface IOpenAPI3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  openapi: '3.0.0'|'3.0.1'|'3.0.2'|'3.0.3'
  info: IInfo3
  servers?: IServer3[]
  paths: IPaths3
  components?: IComponents3
  security?: ISecurityRequirement3[]
  tags?: ITag3[]
  externalDocs?: IExternalDocumentation3
}

