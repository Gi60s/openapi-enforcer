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
import { ISDProperty, ISDString, ISDComponent, ISDObject } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ISchema2, ISchema2Definition } from '../Schema'
import { IReference2, IReference2Definition } from '../Reference'
import { IExample2, IExample2Definition } from '../Example'

// <!# Custom Content Begin: HEADER #!>
// <!# Custom Content End: HEADER #!>

export type IResponse = IResponse2 | IResponse3 | IResponse3a
export type IResponseDefinition = IResponse2Definition | IResponse3Definition | IResponse3aDefinition
export type IResponse2SchemaProcessor = SchemaProcessor<IResponse2Definition, IResponse2>
export type IResponse3SchemaProcessor = SchemaProcessor<IResponse3Definition, IResponse3>
export type IResponse3aSchemaProcessor = SchemaProcessor<IResponse3aDefinition, IResponse3a>
export type IResponseSchemaProcessor = IResponse2SchemaProcessor | IResponse3SchemaProcessor | IResponse3aSchemaProcessor

export interface IResponseBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IResponse2Definition {
  [extensions: `x-${string}`]: any
  description: string
  schema?: ISchema2Definition | IReference2Definition
  headers?: Record<string, IHeader2Definition>
  examples?: IExample2Definition
}

export interface IResponse2 extends IResponseBase {
  extensions: Record<string, any>
  description: string
  schema?: ISchema2 | IReference2
  headers?: Record<string, IHeader2>
  examples?: IExample2
}

export interface IResponseValidatorsMap2 {
  description: ISDProperty<ISDString>
  schema: ISDProperty<ISDComponent<ISchema2Definition, ISchema2> | ISDComponent<IReference2Definition, IReference2>>
  headers: ISDProperty<ISDObject<ISDComponent<IHeader2Definition, IHeader2>>>
  examples: ISDProperty<ISDComponent<IExample2Definition, IExample2>>
}

export interface IResponse3Definition {
  [extensions: `x-${string}`]: any
  description: string
  headers?: Record<string, IHeader3Definition | IReference3Definition>
  content?: Record<string, IMediaType3Definition>
  links?: Record<string, ILink3Definition | IReference3Definition>
}

export interface IResponse3 extends IResponseBase {
  extensions: Record<string, any>
  description: string
  headers?: Record<string, IHeader3 | IReference3>
  content?: Record<string, IMediaType3>
  links?: Record<string, ILink3 | IReference3>
}

export interface IResponseValidatorsMap3 {
  description: ISDProperty<ISDString>
  headers: ISDProperty<ISDObject<ISDComponent<IHeader3Definition, IHeader3> | ISDComponent<IReference3Definition, IReference3>>>
  content: ISDProperty<ISDObject<ISDComponent<IMediaType3Definition, IMediaType3>>>
  links: ISDProperty<ISDObject<ISDComponent<ILink3Definition, ILink3> | ISDComponent<IReference3Definition, IReference3>>>
}

export interface IResponse3aDefinition {
  [extensions: `x-${string}`]: any
  description: string
  headers?: Record<string, IHeader3aDefinition | IReference3aDefinition>
  content?: Record<string, IMediaType3aDefinition>
  links?: Record<string, ILink3aDefinition | IReference3aDefinition>
}

export interface IResponse3a extends IResponseBase {
  extensions: Record<string, any>
  description: string
  headers?: Record<string, IHeader3a | IReference3a>
  content?: Record<string, IMediaType3a>
  links?: Record<string, ILink3a | IReference3a>
}

export interface IResponseValidatorsMap3a {
  description: ISDProperty<ISDString>
  headers: ISDProperty<ISDObject<ISDComponent<IHeader3aDefinition, IHeader3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  content: ISDProperty<ISDObject<ISDComponent<IMediaType3aDefinition, IMediaType3a>>>
  links: ISDProperty<ISDObject<ISDComponent<ILink3aDefinition, ILink3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
