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
import { ISDProperty, ISDString, ISDObject, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IOAuthFlows3, IOAuthFlows3Definition, IOAuthFlows3a, IOAuthFlows3aDefinition } from '../OAuthFlows'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type ISecurityScheme = ISecurityScheme2 | ISecurityScheme3 | ISecurityScheme3a
export type ISecuritySchemeDefinition = ISecurityScheme2Definition | ISecurityScheme3Definition | ISecurityScheme3aDefinition
export type ISecurityScheme2SchemaProcessor = SchemaProcessor<ISecurityScheme2Definition, ISecurityScheme2>
export type ISecurityScheme3SchemaProcessor = SchemaProcessor<ISecurityScheme3Definition, ISecurityScheme3>
export type ISecurityScheme3aSchemaProcessor = SchemaProcessor<ISecurityScheme3aDefinition, ISecurityScheme3a>
export type ISecuritySchemeSchemaProcessor = ISecurityScheme2SchemaProcessor | ISecurityScheme3SchemaProcessor | ISecurityScheme3aSchemaProcessor

export interface ISecuritySchemeBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ISecurityScheme2Definition {
  [extensions: `x-${string}`]: any
  type: 'basic' | 'apiKey' | 'oauth2'
  description?: string
  name?: string
  in?: 'query' | 'header'
  flow?: 'implicit' | 'password' | 'application' | 'accessCode'
  authorizationUrl?: string
  tokenUrl?: string
  scopes?: Record<string, string>
}

export interface ISecurityScheme2 extends ISecuritySchemeBase {
  extensions: Record<string, any>
  type: 'basic' | 'apiKey' | 'oauth2'
  description?: string
  name?: string
  in?: 'query' | 'header'
  flow?: 'implicit' | 'password' | 'application' | 'accessCode'
  authorizationUrl?: string
  tokenUrl?: string
  scopes?: Record<string, string>
}

export interface ISecuritySchemeValidatorsMap2 {
  type: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  name: ISDProperty<ISDString>
  _in: ISDProperty<ISDString>
  flow: ISDProperty<ISDString>
  authorizationUrl: ISDProperty<ISDString>
  tokenUrl: ISDProperty<ISDString>
  scopes: ISDProperty<ISDObject<ISDString>>
}

export interface ISecurityScheme3Definition {
  [extensions: `x-${string}`]: any
  type?: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
  description?: string
  name?: string
  in?: 'query' | 'header' | 'cookie'
  scheme?: string
  bearerFormat?: string
  flows?: IOAuthFlows3Definition
  openIdConnectUrl?: string
}

export interface ISecurityScheme3 extends ISecuritySchemeBase {
  extensions: Record<string, any>
  type?: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
  description?: string
  name?: string
  in?: 'query' | 'header' | 'cookie'
  scheme?: string
  bearerFormat?: string
  flows?: IOAuthFlows3
  openIdConnectUrl?: string
}

export interface ISecuritySchemeValidatorsMap3 {
  type: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  name: ISDProperty<ISDString>
  _in: ISDProperty<ISDString>
  scheme: ISDProperty<ISDString>
  bearerFormat: ISDProperty<ISDString>
  flows: ISDProperty<ISDComponent<IOAuthFlows3Definition, IOAuthFlows3>>
  openIdConnectUrl: ISDProperty<ISDString>
}

export interface ISecurityScheme3aDefinition {
  [extensions: `x-${string}`]: any
  type?: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
  description?: string
  name?: string
  in?: 'query' | 'header' | 'cookie'
  scheme?: string
  bearerFormat?: string
  flows?: IOAuthFlows3aDefinition
  openIdConnectUrl?: string
}

export interface ISecurityScheme3a extends ISecuritySchemeBase {
  extensions: Record<string, any>
  type?: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
  description?: string
  name?: string
  in?: 'query' | 'header' | 'cookie'
  scheme?: string
  bearerFormat?: string
  flows?: IOAuthFlows3a
  openIdConnectUrl?: string
}

export interface ISecuritySchemeValidatorsMap3a {
  type: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  name: ISDProperty<ISDString>
  _in: ISDProperty<ISDString>
  scheme: ISDProperty<ISDString>
  bearerFormat: ISDProperty<ISDString>
  flows: ISDProperty<ISDComponent<IOAuthFlows3aDefinition, IOAuthFlows3a>>
  openIdConnectUrl: ISDProperty<ISDString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
