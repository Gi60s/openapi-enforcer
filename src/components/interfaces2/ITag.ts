import {
  IExternalDocumentation2,
  IExternalDocumentation3,
  IExternalDocumentation2Definition,
  IExternalDocumentation3Definition
} from './IExternalDocumentation'
import { IEnforcerExtensionDefinition } from './IIndex'

interface ITagBase {
  extensions: Record<string, any>
  name: string
  description?: string
  externalDocs?: IExternalDocumentation2 | IExternalDocumentation3
}

export interface ITag2 extends ITagBase {
  externalDocs?: IExternalDocumentation2
}
export interface ITag3 extends ITagBase {
  externalDocs?: IExternalDocumentation3
}

interface ITagBaseDefinition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  name: string
  description?: string
  externalDocs?: IExternalDocumentation2Definition | IExternalDocumentation3Definition
}

export interface ITag2Definition extends ITagBaseDefinition {
  externalDocs?: IExternalDocumentation2Definition
}
export interface ITag3Definition extends ITagBaseDefinition {
  externalDocs?: IExternalDocumentation3Definition
}
