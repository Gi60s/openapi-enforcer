import { IEnforcerExtensionDefinition } from './IIndex'

interface IExternalDocumentationBase {
  extensions: Record<string, any>
  description?: string
  url: string
}

export interface IExternalDocumentation2 extends IExternalDocumentationBase {}
export interface IExternalDocumentation3 extends IExternalDocumentationBase {}

interface IExternalDocumentationBaseDefinition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  description?: string
  url: string
}

export interface IExternalDocumentation2Definition extends IExternalDocumentationBaseDefinition {}
export interface IExternalDocumentation3Definition extends IExternalDocumentationBaseDefinition {}
