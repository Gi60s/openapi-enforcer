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
import { ISDProperty, ISDString } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IExternalDocumentation = IExternalDocumentation2 | IExternalDocumentation3 | IExternalDocumentation3a
export type IExternalDocumentationDefinition = IExternalDocumentation2Definition | IExternalDocumentation3Definition | IExternalDocumentation3aDefinition
export type IExternalDocumentation2SchemaProcessor = SchemaProcessor<IExternalDocumentation2Definition, IExternalDocumentation2>
export type IExternalDocumentation3SchemaProcessor = SchemaProcessor<IExternalDocumentation3Definition, IExternalDocumentation3>
export type IExternalDocumentation3aSchemaProcessor = SchemaProcessor<IExternalDocumentation3aDefinition, IExternalDocumentation3a>
export type IExternalDocumentationSchemaProcessor = IExternalDocumentation2SchemaProcessor | IExternalDocumentation3SchemaProcessor | IExternalDocumentation3aSchemaProcessor

export interface IExternalDocumentationBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IExternalDocumentation2Definition {
  [extensions: `x-${string}`]: any
  description?: string
  url: string
}

export interface IExternalDocumentation2 extends IExternalDocumentationBase {
  extensions: Record<string, any>
  description?: string
  url: string
}

export interface IExternalDocumentationValidatorsMap2 {
  description: ISDProperty<ISDString>
  url: ISDProperty<ISDString>
}

export interface IExternalDocumentation3Definition {
  [extensions: `x-${string}`]: any
  description?: string
  url: string
}

export interface IExternalDocumentation3 extends IExternalDocumentationBase {
  extensions: Record<string, any>
  description?: string
  url: string
}

export interface IExternalDocumentationValidatorsMap3 {
  description: ISDProperty<ISDString>
  url: ISDProperty<ISDString>
}

export interface IExternalDocumentation3aDefinition {
  [extensions: `x-${string}`]: any
  description?: string
  url: string
}

export interface IExternalDocumentation3a extends IExternalDocumentationBase {
  extensions: Record<string, any>
  description?: string
  url: string
}

export interface IExternalDocumentationValidatorsMap3a {
  description: ISDProperty<ISDString>
  url: ISDProperty<ISDString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
