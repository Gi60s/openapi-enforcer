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
import { IExternalDocumentation2, IExternalDocumentation2Definition, IExternalDocumentation3, IExternalDocumentation3Definition } from '../ExternalDocumentation/IExternalDocumentation'
import { IParameter2, IParameter2Definition, IParameter3, IParameter3Definition } from '../Parameter/IParameter'
import { IResponses2, IResponses2Definition, IResponses3, IResponses3Definition } from '../Responses/IResponses'
import { ISecurityRequirement2, ISecurityRequirement2Definition, ISecurityRequirement3, ISecurityRequirement3Definition } from '../SecurityRequirement/ISecurityRequirement'
import { IRequestBody3, IRequestBody3Definition } from '../RequestBody/IRequestBody'
import { ICallback3, ICallback3Definition } from '../Callback/ICallback'
import { IServer3, IServer3Definition } from '../Server/IServer'

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
  schemes?: string[]
  deprecated?: boolean
  security?: ISecurityRequirement2Definition[]
}

export interface IOperation2 extends IComponentInstance {
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
  schemes?: string[]
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

export interface IOperation3 extends IComponentInstance {
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

