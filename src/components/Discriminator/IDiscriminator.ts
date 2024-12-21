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
import { ISDProperty, ISDString, ISDObject } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IDiscriminator = IDiscriminator3 | IDiscriminator3a
export type IDiscriminatorDefinition = IDiscriminator3Definition | IDiscriminator3aDefinition
export type IDiscriminator3SchemaProcessor = SchemaProcessor<IDiscriminator3Definition, IDiscriminator3>
export type IDiscriminator3aSchemaProcessor = SchemaProcessor<IDiscriminator3aDefinition, IDiscriminator3a>
export type IDiscriminatorSchemaProcessor = IDiscriminator3SchemaProcessor | IDiscriminator3aSchemaProcessor

export interface IDiscriminatorBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IDiscriminator3Definition {
  propertyName: string
  mapping?: Record<string, string>
}

export interface IDiscriminator3 extends IDiscriminatorBase {
  propertyName: string
  mapping?: Record<string, string>
}

export interface IDiscriminatorValidatorsMap3 {
  propertyName: ISDProperty<ISDString>
  mapping: ISDProperty<ISDObject<ISDString>>
}

export interface IDiscriminator3aDefinition {
  [extensions: `x-${string}`]: any
  propertyName: string
  mapping?: Record<string, string>
}

export interface IDiscriminator3a extends IDiscriminatorBase {
  extensions: Record<string, any>
  propertyName: string
  mapping?: Record<string, string>
}

export interface IDiscriminatorValidatorsMap3a {
  propertyName: ISDProperty<ISDString>
  mapping: ISDProperty<ISDObject<ISDString>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
