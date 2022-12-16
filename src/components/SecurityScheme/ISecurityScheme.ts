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
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface ISecuritySchemeComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ISecurityScheme2Definition {
  [extension: `x-${string}`]: any
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
  [extension: `x-${string}`]: any
  type: 'basic'|'apiKey'|'oauth2'
  description?: string
  name?: string
  in?: 'query'|'header'
  flow?: 'implicit'|'password'|'application'|'accessCode'
  authorizationUrl?: string
  tokenUrl?: string
  scopes?: Record<string, string>
}

export interface ISecurityScheme3Definition {
  [extension: `x-${string}`]: any
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
  [extension: `x-${string}`]: any
  type?: 'apiKey'|'http'|'oauth2'|'openIdConnect'
  description?: string
  name?: string
  in?: 'query'|'header'|'cookie'
  scheme?: string
  bearerFormat?: string
  flows?: I.IOAuthFlows3
  openIdConnectUrl?: string
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
