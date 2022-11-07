import { IComponentClass } from '../IComponent'

interface IExternalDocumentationBase<Definition, Component> extends IComponentClass<Definition, Component> {
  [key: `x${string}`]: any
  description?: string
  url: string
}

export interface IExternalDocumentation2 extends IExternalDocumentationBase<IExternalDocumentation2Definition, IExternalDocumentation2> {}
export interface IExternalDocumentation3 extends IExternalDocumentationBase<IExternalDocumentation3Definition, IExternalDocumentation3> {}

interface IExternalDocumentationBaseDefinition {
  [key: `x-${string}`]: any
  description?: string
  url: string
}

export interface IExternalDocumentation2Definition extends IExternalDocumentationBaseDefinition {}
export interface IExternalDocumentation3Definition extends IExternalDocumentationBaseDefinition {}
