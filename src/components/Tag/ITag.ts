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
import { ISDProperty, ISDString, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IExternalDocumentation2, IExternalDocumentation2Definition, IExternalDocumentation3, IExternalDocumentation3Definition, IExternalDocumentation3a, IExternalDocumentation3aDefinition } from '../ExternalDocumentation'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type ITag = ITag2 | ITag3 | ITag3a
export type ITagDefinition = ITag2Definition | ITag3Definition | ITag3aDefinition
export type ITag2SchemaProcessor = SchemaProcessor<ITag2Definition, ITag2>
export type ITag3SchemaProcessor = SchemaProcessor<ITag3Definition, ITag3>
export type ITag3aSchemaProcessor = SchemaProcessor<ITag3aDefinition, ITag3a>
export type ITagSchemaProcessor = ITag2SchemaProcessor | ITag3SchemaProcessor | ITag3aSchemaProcessor

export interface ITagBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ITag2Definition {
  [extensions: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: IExternalDocumentation2Definition
}

export interface ITag2 extends ITagBase {
  extensions: Record<string, any>
  name: string
  description?: string
  externalDocs?: IExternalDocumentation2
}

export interface ITagValidatorsMap2 {
  name: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation2Definition, IExternalDocumentation2>>
}

export interface ITag3Definition {
  [extensions: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: IExternalDocumentation3Definition
}

export interface ITag3 extends ITagBase {
  extensions: Record<string, any>
  name: string
  description?: string
  externalDocs?: IExternalDocumentation3
}

export interface ITagValidatorsMap3 {
  name: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation3Definition, IExternalDocumentation3>>
}

export interface ITag3aDefinition {
  [extensions: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: IExternalDocumentation3aDefinition
}

export interface ITag3a extends ITagBase {
  extensions: Record<string, any>
  name: string
  description?: string
  externalDocs?: IExternalDocumentation3a
}

export interface ITagValidatorsMap3a {
  name: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation3aDefinition, IExternalDocumentation3a>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
