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

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IEncoding = IEncoding3 | IEncoding3a
export type IEncodingDefinition = IEncoding3Definition | IEncoding3aDefinition
export type IEncoding3SchemaProcessor = SchemaProcessor<IEncoding3Definition, IEncoding3>
export type IEncoding3aSchemaProcessor = SchemaProcessor<IEncoding3aDefinition, IEncoding3a>
export type IEncodingSchemaProcessor = IEncoding3SchemaProcessor | IEncoding3aSchemaProcessor

export interface IEncodingBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IEncoding3Definition {
  [extensions: `x-${string}`]: any
  contentType?: string
  headers?: Record<string, IHeader3Definition | IReference3Definition>
  style?: string
  explode?: boolean
  allowReserved?: boolean
}

export interface IEncoding3 extends IEncodingBase {
  extensions: Record<string, any>
  contentType?: string
  headers?: Record<string, IHeader3>
  style?: string
  explode?: boolean
  allowReserved?: boolean
}

export interface IEncodingValidatorsMap3 {
  contentType: ISDProperty<ISDString>
  headers: ISDProperty<ISDObject<ISDComponent<IHeader3Definition, IHeader3> | ISDComponent<IReference3Definition, IReference3>>>
  style: ISDProperty<ISDString>
  explode: ISDProperty<ISDBoolean>
  allowReserved: ISDProperty<ISDBoolean>
}

export interface IEncoding3aDefinition {
  [extensions: `x-${string}`]: any
  contentType?: string
  headers?: Record<string, IHeader3aDefinition | IReference3aDefinition>
  style?: string
  explode?: boolean
  allowReserved?: boolean
}

export interface IEncoding3a extends IEncodingBase {
  extensions: Record<string, any>
  contentType?: string
  headers?: Record<string, IHeader3a>
  style?: string
  explode?: boolean
  allowReserved?: boolean
}

export interface IEncodingValidatorsMap3a {
  contentType: ISDProperty<ISDString>
  headers: ISDProperty<ISDObject<ISDComponent<IHeader3aDefinition, IHeader3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  style: ISDProperty<ISDString>
  explode: ISDProperty<ISDBoolean>
  allowReserved: ISDProperty<ISDBoolean>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
