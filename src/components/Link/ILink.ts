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
import { ISDProperty, ISDString, ISDObject, ISDAny, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IServer3, IServer3Definition, IServer3a, IServer3aDefinition } from '../Server'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type ILink = ILink3 | ILink3a
export type ILinkDefinition = ILink3Definition | ILink3aDefinition
export type ILink3SchemaProcessor = SchemaProcessor<ILink3Definition, ILink3>
export type ILink3aSchemaProcessor = SchemaProcessor<ILink3aDefinition, ILink3a>
export type ILinkSchemaProcessor = ILink3SchemaProcessor | ILink3aSchemaProcessor

export interface ILinkBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ILink3Definition {
  [extensions: `x-${string}`]: any
  operationRef?: string
  operationId?: string
  parameters?: Record<string, any>
  requestBody?: any
  description?: string
  server?: IServer3Definition
}

export interface ILink3 extends ILinkBase {
  extensions: Record<string, any>
  operationRef?: string
  operationId?: string
  parameters?: Record<string, any>
  requestBody?: any
  description?: string
  server?: IServer3
}

export interface ILinkValidatorsMap3 {
  operationRef: ISDProperty<ISDString>
  operationId: ISDProperty<ISDString>
  parameters: ISDProperty<ISDObject<ISDAny>>
  requestBody: ISDProperty<ISDAny>
  description: ISDProperty<ISDString>
  server: ISDProperty<ISDComponent<IServer3Definition, IServer3>>
}

export interface ILink3aDefinition {
  [extensions: `x-${string}`]: any
  operationRef?: string
  operationId?: string
  parameters?: Record<string, any>
  requestBody?: any
  description?: string
  server?: IServer3aDefinition
}

export interface ILink3a extends ILinkBase {
  extensions: Record<string, any>
  operationRef?: string
  operationId?: string
  parameters?: Record<string, any>
  requestBody?: any
  description?: string
  server?: IServer3a
}

export interface ILinkValidatorsMap3a {
  operationRef: ISDProperty<ISDString>
  operationId: ISDProperty<ISDString>
  parameters: ISDProperty<ISDObject<ISDAny>>
  requestBody: ISDProperty<ISDAny>
  description: ISDProperty<ISDString>
  server: ISDProperty<ISDComponent<IServer3aDefinition, IServer3a>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
