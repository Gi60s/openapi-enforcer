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
import { ISDProperty, ISDString, ISDComponent, ISDArray, ISDObject } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IInfo2, IInfo2Definition } from '../Info'
import { IPaths2, IPaths2Definition } from '../Paths'
import { ISchema2, ISchema2Definition } from '../Schema'
import { IParameter2, IParameter2Definition } from '../Parameter'
import { IResponse2, IResponse2Definition } from '../Response'
import { ISecurityScheme2, ISecurityScheme2Definition } from '../SecurityScheme'
import { ISecurityRequirement2, ISecurityRequirement2Definition } from '../SecurityRequirement'
import { ITag2, ITag2Definition } from '../Tag'
import { IExternalDocumentation2, IExternalDocumentation2Definition } from '../ExternalDocumentation'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type ISwagger = ISwagger2
export type ISwaggerDefinition = ISwagger2Definition
export type ISwagger2SchemaProcessor = SchemaProcessor<ISwagger2Definition, ISwagger2>
export type ISwaggerSchemaProcessor = ISwagger2SchemaProcessor

export interface ISwaggerBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ISwagger2Definition {
  [extensions: `x-${string}`]: any
  swagger: '2.0'
  info: IInfo2Definition
  host?: string
  basePath?: string
  schemes?: Array<'http' | 'https' | 'ws' | 'wss'>
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

export interface ISwagger2 extends ISwaggerBase {
  extensions: Record<string, any>
  swagger: '2.0'
  info: IInfo2
  host?: string
  basePath?: string
  schemes?: Array<'http' | 'https' | 'ws' | 'wss'>
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

export interface ISwaggerValidatorsMap2 {
  swagger: ISDProperty<ISDString>
  info: ISDProperty<ISDComponent<IInfo2Definition, IInfo2>>
  host: ISDProperty<ISDString>
  basePath: ISDProperty<ISDString>
  schemes: ISDProperty<ISDArray<ISDString>>
  consumes: ISDProperty<ISDArray<ISDString>>
  produces: ISDProperty<ISDArray<ISDString>>
  paths: ISDProperty<ISDComponent<IPaths2Definition, IPaths2>>
  definitions: ISDProperty<ISDObject<ISDComponent<ISchema2Definition, ISchema2>>>
  parameters: ISDProperty<ISDObject<ISDComponent<IParameter2Definition, IParameter2>>>
  responses: ISDProperty<ISDObject<ISDComponent<IResponse2Definition, IResponse2>>>
  securityDefinitions: ISDProperty<ISDObject<ISDComponent<ISecurityScheme2Definition, ISecurityScheme2>>>
  security: ISDProperty<ISDArray<ISDComponent<ISecurityRequirement2Definition, ISecurityRequirement2>>>
  tags: ISDProperty<ISDArray<ISDComponent<ITag2Definition, ITag2>>>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation2Definition, IExternalDocumentation2>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
