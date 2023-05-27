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
import { ISDProperty, ISDString, ISDComponent, ISDAny, ISDNumber, ISDBoolean, ISDArray } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IItems = IItems2 | IItems3a
export type IItemsDefinition = IItems2Definition | IItems3aDefinition
export type IItems2SchemaProcessor = SchemaProcessor<IItems2Definition, IItems2>
export type IItems3aSchemaProcessor = SchemaProcessor<IItems3aDefinition, IItems3a>
export type IItemsSchemaProcessor = IItems2SchemaProcessor | IItems3aSchemaProcessor

export interface IItemsBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IItems2Definition {
  [extensions: `x-${string}`]: any
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
  format?: string
  items?: IItems2Definition
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  default?: any
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
}

export interface IItems2 extends IItemsBase {
  extensions: Record<string, any>
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
  format?: string
  items?: IItems2
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  default?: any
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
}

export interface IItemsValidatorsMap2 {
  type: ISDProperty<ISDString>
  format: ISDProperty<ISDString>
  items: ISDProperty<ISDComponent<IItems2Definition, IItems2>>
  collectionFormat: ISDProperty<ISDString>
  _default: ISDProperty<ISDAny>
  maximum: ISDProperty<ISDNumber>
  exclusiveMaximum: ISDProperty<ISDBoolean>
  minimum: ISDProperty<ISDNumber>
  exclusiveMinimum: ISDProperty<ISDBoolean>
  maxLength: ISDProperty<ISDNumber>
  minLength: ISDProperty<ISDNumber>
  pattern: ISDProperty<ISDString>
  maxItems: ISDProperty<ISDNumber>
  minItems: ISDProperty<ISDNumber>
  uniqueItems: ISDProperty<ISDBoolean>
  _enum: ISDProperty<ISDArray<ISDAny>>
  multipleOf: ISDProperty<ISDNumber>
}

export interface IItems3aDefinition {
  [extensions: `x-${string}`]: any
}

export interface IItems3a extends IItemsBase {
  extensions: Record<string, any>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
