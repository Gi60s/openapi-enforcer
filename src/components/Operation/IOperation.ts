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
  ICallback3,
  ICallback3Definition,
  IExternalDocumentation2,
  IExternalDocumentation2Definition,
  IExternalDocumentation3,
  IExternalDocumentation3Definition,
  IParameter2,
  IParameter2Definition,
  IParameter3,
  IParameter3Definition,
  IRequestBody3,
  IRequestBody3Definition,
  IResponses2,
  IResponses2Definition,
  IResponses3,
  IResponses3Definition,
  ISecurityRequirement2,
  ISecurityRequirement2Definition,
  ISecurityRequirement3,
  ISecurityRequirement3Definition,
  IServer3,
  IServer3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
import * as I from '../IInternalTypes'
import { ContentType } from '../../ContentType/ContentType'
// <!# Custom Content End: HEADER #!>

interface IOperationComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  getResponsesThatCanProduceContentType: (contentType: string | ContentType) => Array<{ code: number | 'default', response: IResponse2 }>
  willAcceptContentType: (contentType: string | ContentType) => boolean
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IOperation2Definition {
  [extension: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation2Definition
  operationId?: string
  consumes?: string[]
  produces?: string[]
  parameters?: IParameter2Definition[]
  responses: IResponses2Definition
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  deprecated?: boolean
  security?: ISecurityRequirement2Definition[]
}

export interface IOperation2 extends IOperationComponent {
  [extension: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation2
  operationId?: string
  consumes?: string[]
  produces?: string[]
  parameters?: IParameter2[]
  responses: IResponses2
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  deprecated?: boolean
  security?: ISecurityRequirement2[]
}

export interface IOperation3Definition {
  [extension: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation3Definition
  operationId?: string
  parameters?: IParameter3Definition[]
  requestBody?: IRequestBody3Definition
  responses: IResponses3Definition
  callbacks?: Record<string, ICallback3Definition>
  deprecated?: boolean
  security?: ISecurityRequirement3Definition[]
  servers?: IServer3Definition[]
}

export interface IOperation3 extends IOperationComponent {
  [extension: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation3
  operationId?: string
  parameters?: IParameter3[]
  requestBody?: IRequestBody3
  responses: IResponses3
  callbacks?: Record<string, ICallback3>
  deprecated?: boolean
  security?: ISecurityRequirement3[]
  servers?: IServer3[]
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
