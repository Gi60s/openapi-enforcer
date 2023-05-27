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
import { ISDProperty, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IResponse2, IResponse2Definition, IResponse3, IResponse3Definition, IResponse3a, IResponse3aDefinition } from '../Response'
import { IReference2, IReference2Definition, IReference3, IReference3Definition, IReference3a, IReference3aDefinition } from '../Reference'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IResponses = IResponses2 | IResponses3 | IResponses3a
export type IResponsesDefinition = IResponses2Definition | IResponses3Definition | IResponses3aDefinition
export type IResponses2SchemaProcessor = SchemaProcessor<IResponses2Definition, IResponses2>
export type IResponses3SchemaProcessor = SchemaProcessor<IResponses3Definition, IResponses3>
export type IResponses3aSchemaProcessor = SchemaProcessor<IResponses3aDefinition, IResponses3a>
export type IResponsesSchemaProcessor = IResponses2SchemaProcessor | IResponses3SchemaProcessor | IResponses3aSchemaProcessor

export interface IResponsesBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IResponses2Definition {
  [extensions: `x-${string}`]: any
  Record<string, IResponse2Definition
  IReference2Definition>
  default?: IResponse2Definition | IReference2Definition
}

export interface IResponses2 extends IResponsesBase {
  extensions: Record<string, any>
  Record<string, IResponse2
  IReference2>
  default?: IResponse2 | IReference2
}

export interface IResponsesValidatorsMap2 {
  _default: ISDProperty<ISDComponent<IResponse2Definition, IResponse2> | ISDComponent<IReference2Definition, IReference2>>
}

export interface IResponses3Definition {
  [extensions: `x-${string}`]: any
  Record<string, IResponse3Definition
  IReference3Definition>
  default?: IResponse3Definition | IReference3Definition
}

export interface IResponses3 extends IResponsesBase {
  extensions: Record<string, any>
  Record<string, IResponse3
  IReference3>
  default?: IResponse3 | IReference3
}

export interface IResponsesValidatorsMap3 {
  _default: ISDProperty<ISDComponent<IResponse3Definition, IResponse3> | ISDComponent<IReference3Definition, IReference3>>
}

export interface IResponses3aDefinition {
  [extensions: `x-${string}`]: any
  default?: IResponse3aDefinition | IReference3aDefinition
}

export interface IResponses3a extends IResponsesBase {
  extensions: Record<string, any>
  default?: IResponse3a | IReference3a
}

export interface IResponsesValidatorsMap3a {
  _default: ISDProperty<ISDComponent<IResponse3aDefinition, IResponse3a> | ISDComponent<IReference3aDefinition, IReference3a>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
