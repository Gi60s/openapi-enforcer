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
import { IServerVariable3, IServerVariable3Definition, IServerVariable3a, IServerVariable3aDefinition } from '../ServerVariable'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IServer = IServer3 | IServer3a
export type IServerDefinition = IServer3Definition | IServer3aDefinition
export type IServer3SchemaProcessor = SchemaProcessor<IServer3Definition, IServer3>
export type IServer3aSchemaProcessor = SchemaProcessor<IServer3aDefinition, IServer3a>
export type IServerSchemaProcessor = IServer3SchemaProcessor | IServer3aSchemaProcessor

export interface IServerBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IServer3Definition {
  [extensions: `x-${string}`]: any
  url: string
  description?: string
  variables?: Record<string, IServerVariable3Definition>
}

export interface IServer3 extends IServerBase {
  extensions: Record<string, any>
  url: string
  description?: string
  variables?: Record<string, IServerVariable3>
}

export interface IServerValidatorsMap3 {
  url: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  variables: ISDProperty<ISDObject<ISDComponent<IServerVariable3Definition, IServerVariable3>>>
}

export interface IServer3aDefinition {
  [extensions: `x-${string}`]: any
  url: string
  description?: string
  variables?: Record<string, IServerVariable3aDefinition>
}

export interface IServer3a extends IServerBase {
  extensions: Record<string, any>
  url: string
  description?: string
  variables?: Record<string, IServerVariable3a>
}

export interface IServerValidatorsMap3a {
  url: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  variables: ISDProperty<ISDObject<ISDComponent<IServerVariable3aDefinition, IServerVariable3a>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
