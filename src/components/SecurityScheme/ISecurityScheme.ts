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

interface ISecuritySchemeComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ISecurityScheme2Definition {
  [Extensions: `x-${string}`]: any
  type: 'basic'|'apiKey'|'oauth2'
  description?: string
  name?: string
  in?: 'query'|'header'
  flow?: 'implicit'|'password'|'application'|'accessCode'
  authorizationUrl?: string
  tokenUrl?: string
  scopes?: Record<string, string>
}

export interface ISecurityScheme2 extends ISecuritySchemeComponent {
  [Extensions]: Record<string, any>
  type: 'basic'|'apiKey'|'oauth2'
  description?: string
  name?: string
  in?: 'query'|'header'
  flow?: 'implicit'|'password'|'application'|'accessCode'
  authorizationUrl?: string
  tokenUrl?: string
  scopes?: Record<string, string>
}

export interface ISecuritySchemeValidatorsMap2 {
  type: Icsd.IProperty<Icsd.IString>
  description: Icsd.IProperty<Icsd.IString>
  name: Icsd.IProperty<Icsd.IString>
  _in: Icsd.IProperty<Icsd.IString>
  flow: Icsd.IProperty<Icsd.IString>
  authorizationUrl: Icsd.IProperty<Icsd.IString>
  tokenUrl: Icsd.IProperty<Icsd.IString>
  scopes: Icsd.IProperty<Icsd.IObject<Icsd.IString>>
}

export interface ISecurityScheme3Definition {
  [Extensions: `x-${string}`]: any
  type?: 'apiKey'|'http'|'oauth2'|'openIdConnect'
  description?: string
  name?: string
  in?: 'query'|'header'|'cookie'
  scheme?: string
  bearerFormat?: string
  flows?: I.IOAuthFlows3Definition
  openIdConnectUrl?: string
}

export interface ISecurityScheme3 extends ISecuritySchemeComponent {
  [Extensions]: Record<string, any>
  type?: 'apiKey'|'http'|'oauth2'|'openIdConnect'
  description?: string
  name?: string
  in?: 'query'|'header'|'cookie'
  scheme?: string
  bearerFormat?: string
  flows?: I.IOAuthFlows3
  openIdConnectUrl?: string
}

export interface ISecuritySchemeValidatorsMap3 {
  type: Icsd.IProperty<Icsd.IString>
  description: Icsd.IProperty<Icsd.IString>
  name: Icsd.IProperty<Icsd.IString>
  _in: Icsd.IProperty<Icsd.IString>
  scheme: Icsd.IProperty<Icsd.IString>
  bearerFormat: Icsd.IProperty<Icsd.IString>
  flows: Icsd.IProperty<Icsd.IComponent<I.IOAuthFlows3Definition, I.IOAuthFlows3>>
  openIdConnectUrl: Icsd.IProperty<Icsd.IString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
