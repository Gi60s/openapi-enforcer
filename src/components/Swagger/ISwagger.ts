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
import {
  IExternalDocumentation2,
  IExternalDocumentation2Definition,
  IInfo2,
  IInfo2Definition,
  IParameter2,
  IParameter2Definition,
  IPaths2,
  IPaths2Definition,
  IResponse2,
  IResponse2Definition,
  ISchema2,
  ISchema2Definition,
  ISecurityRequirement2,
  ISecurityRequirement2Definition,
  ISecurityScheme2,
  ISecurityScheme2Definition,
  ITag2,
  ITag2Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export interface ISwagger2Definition {
  [extension: `x-${string}`]: any
  swagger: '2.0'
  info: IInfo2Definition
  host?: string
  basePath?: string
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  consumes?: string[]
  produces?: string[]
  paths: IPaths2Definition
  definitions?: Record<string, ISchema2Definition>
  parameters?: Record<string, IParameter2Definition>
  responses?: Record<string, IResponse2Definition>
  securityDefinitions?: Record<string, ISecurityScheme2Definition>
  security?: ISecurityRequirement2Definition[]
  tags?: ITag2Definition[]
  externalDocs?: IExternalDocumentation2Definition
}

export interface ISwagger2 extends IComponentInstance {
  [extension: `x-${string}`]: any
  swagger: '2.0'
  info: IInfo2
  host?: string
  basePath?: string
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  consumes?: string[]
  produces?: string[]
  paths: IPaths2
  definitions?: Record<string, ISchema2>
  parameters?: Record<string, IParameter2>
  responses?: Record<string, IResponse2>
  securityDefinitions?: Record<string, ISecurityScheme2>
  security?: ISecurityRequirement2[]
  tags?: ITag2[]
  externalDocs?: IExternalDocumentation2
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
