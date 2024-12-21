import { IEnforcerExtensionDefinition } from './IIndex'

interface ISecurityScheme {
  extensions: Record<string, any>
  description?: string
  in: string
  name: string
  type: string
}

export interface ISecurityScheme2 extends ISecurityScheme {
  authorizationUrl?: string
  flow?: string
  scopes?: Record<string, string>
  tokenUrl?: string
}

export interface ISecurityScheme3 extends ISecurityScheme {
  bearerFormat?: string
  flows?: string
  openIdConnectUrl?: string
  scheme?: string
}

interface ISecuritySchemeBaseDefinition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  description?: string
  in: string
  name: string
  type: string
}

export interface ISecurityScheme2Definition extends ISecuritySchemeBaseDefinition {
  authorizationUrl: string
  flow: string
  scopes: Record<string, string>
  tokenUrl: string
}

export interface ISecurityScheme3Definition extends ISecuritySchemeBaseDefinition {
  bearerFormat?: string
  flows: string
  openIdConnectUrl: string
  scheme: string
}
