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
import { ISDProperty, ISDString, ISDAny } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IExample = IExample2 | IExample3 | IExample3a
export type IExampleDefinition = IExample2Definition | IExample3Definition | IExample3aDefinition
export type IExample2SchemaProcessor = SchemaProcessor<IExample2Definition, IExample2>
export type IExample3SchemaProcessor = SchemaProcessor<IExample3Definition, IExample3>
export type IExample3aSchemaProcessor = SchemaProcessor<IExample3aDefinition, IExample3a>
export type IExampleSchemaProcessor = IExample2SchemaProcessor | IExample3SchemaProcessor | IExample3aSchemaProcessor

export interface IExampleBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IExample2Definition {
  [key: string]: Record<string, any>
}

export interface IExample2 extends IExampleBase {
  [key: string]: Record<string, any>
}

export interface IExample3Definition {
  [extensions: `x-${string}`]: any
  summary?: string
  description?: string
  value?: any
  externalValue?: string
}

export interface IExample3 extends IExampleBase {
  extensions: Record<string, any>
  summary?: string
  description?: string
  value?: any
  externalValue?: string
}

export interface IExampleValidatorsMap3 {
  summary: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  value: ISDProperty<ISDAny>
  externalValue: ISDProperty<ISDString>
}

export interface IExample3aDefinition {
  [extensions: `x-${string}`]: any
  summary?: string
  description?: string
  value?: any
  externalValue?: string
}

export interface IExample3a extends IExampleBase {
  extensions: Record<string, any>
  summary?: string
  description?: string
  value?: any
  externalValue?: string
}

export interface IExampleValidatorsMap3a {
  summary: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  value: ISDProperty<ISDAny>
  externalValue: ISDProperty<ISDString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
