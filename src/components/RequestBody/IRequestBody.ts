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
import { ISDProperty, ISDString, ISDObject, ISDComponent, ISDBoolean } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IMediaType3, IMediaType3Definition, IMediaType3a, IMediaType3aDefinition } from '../MediaType'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IRequestBody = IRequestBody3 | IRequestBody3a
export type IRequestBodyDefinition = IRequestBody3Definition | IRequestBody3aDefinition
export type IRequestBody3SchemaProcessor = SchemaProcessor<IRequestBody3Definition, IRequestBody3>
export type IRequestBody3aSchemaProcessor = SchemaProcessor<IRequestBody3aDefinition, IRequestBody3a>
export type IRequestBodySchemaProcessor = IRequestBody3SchemaProcessor | IRequestBody3aSchemaProcessor

export interface IRequestBodyBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IRequestBody3Definition {
  [extensions: `x-${string}`]: any
  description?: string
  content?: Record<string, IMediaType3Definition>
  required?: boolean
}

export interface IRequestBody3 extends IRequestBodyBase {
  extensions: Record<string, any>
  description?: string
  content?: Record<string, IMediaType3>
  required?: boolean
}

export interface IRequestBodyValidatorsMap3 {
  description: ISDProperty<ISDString>
  content: ISDProperty<ISDObject<ISDComponent<IMediaType3Definition, IMediaType3>>>
  required: ISDProperty<ISDBoolean>
}

export interface IRequestBody3aDefinition {
  [extensions: `x-${string}`]: any
  description?: string
  content?: Record<string, IMediaType3aDefinition>
  required?: boolean
}

export interface IRequestBody3a extends IRequestBodyBase {
  extensions: Record<string, any>
  description?: string
  content?: Record<string, IMediaType3a>
  required?: boolean
}

export interface IRequestBodyValidatorsMap3a {
  description: ISDProperty<ISDString>
  content: ISDProperty<ISDObject<ISDComponent<IMediaType3aDefinition, IMediaType3a>>>
  required: ISDProperty<ISDBoolean>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
