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
import { IContact2, IContact2Definition, IContact3, IContact3Definition, IContact3a, IContact3aDefinition } from '../Contact'
import { ILicense2, ILicense2Definition, ILicense3, ILicense3Definition, ILicense3a, ILicense3aDefinition } from '../License'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IInfo = IInfo2 | IInfo3 | IInfo3a
export type IInfoDefinition = IInfo2Definition | IInfo3Definition | IInfo3aDefinition
export type IInfo2SchemaProcessor = SchemaProcessor<IInfo2Definition, IInfo2>
export type IInfo3SchemaProcessor = SchemaProcessor<IInfo3Definition, IInfo3>
export type IInfo3aSchemaProcessor = SchemaProcessor<IInfo3aDefinition, IInfo3a>
export type IInfoSchemaProcessor = IInfo2SchemaProcessor | IInfo3SchemaProcessor | IInfo3aSchemaProcessor

export interface IInfoBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IInfo2Definition {
  [extensions: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact2Definition
  license?: ILicense2Definition
  version: string
}

export interface IInfo2 extends IInfoBase {
  extensions: Record<string, any>
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact2
  license?: ILicense2
  version: string
}

export interface IInfoValidatorsMap2 {
  title: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  termsOfService: ISDProperty<ISDString>
  contact: ISDProperty<ISDComponent<IContact2Definition, IContact2>>
  license: ISDProperty<ISDComponent<ILicense2Definition, ILicense2>>
  version: ISDProperty<ISDString>
}

export interface IInfo3Definition {
  [extensions: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact3Definition
  license?: ILicense3Definition
  version: string
}

export interface IInfo3 extends IInfoBase {
  extensions: Record<string, any>
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact3
  license?: ILicense3
  version: string
}

export interface IInfoValidatorsMap3 {
  title: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  termsOfService: ISDProperty<ISDString>
  contact: ISDProperty<ISDComponent<IContact3Definition, IContact3>>
  license: ISDProperty<ISDComponent<ILicense3Definition, ILicense3>>
  version: ISDProperty<ISDString>
}

export interface IInfo3aDefinition {
  [extensions: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact3aDefinition
  license?: ILicense3aDefinition
  version: string
}

export interface IInfo3a extends IInfoBase {
  extensions: Record<string, any>
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact3a
  license?: ILicense3a
  version: string
}

export interface IInfoValidatorsMap3a {
  title: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  termsOfService: ISDProperty<ISDString>
  contact: ISDProperty<ISDComponent<IContact3aDefinition, IContact3a>>
  license: ISDProperty<ISDComponent<ILicense3aDefinition, ILicense3a>>
  version: ISDProperty<ISDString>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
