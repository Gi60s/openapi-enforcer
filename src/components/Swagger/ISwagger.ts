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
import * as I from '../IInternalTypes'
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface ISwaggerComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ISwagger2Definition {
  [Extensions]: Record<string, any>
  swagger: '2.0'
  info: I.IInfo2Definition
  host?: string
  basePath?: string
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  consumes?: string[]
  produces?: string[]
  paths: I.IPaths2Definition
  definitions?: Record<string, I.ISchema2Definition>
  parameters?: Record<string, I.IParameter2Definition>
  responses?: Record<string, I.IResponse2Definition>
  securityDefinitions?: Record<string, I.ISecurityScheme2Definition>
  security?: I.ISecurityRequirement2Definition[]
  tags?: I.ITag2Definition[]
  externalDocs?: I.IExternalDocumentation2Definition
}

export interface ISwagger2 extends ISwaggerComponent {
  [Extensions]: Record<string, any>
  swagger: '2.0'
  info: I.IInfo2
  host?: string
  basePath?: string
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  consumes?: string[]
  produces?: string[]
  paths: I.IPaths2
  definitions?: Record<string, I.ISchema2>
  parameters?: Record<string, I.IParameter2>
  responses?: Record<string, I.IResponse2>
  securityDefinitions?: Record<string, I.ISecurityScheme2>
  security?: I.ISecurityRequirement2[]
  tags?: I.ITag2[]
  externalDocs?: I.IExternalDocumentation2
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
