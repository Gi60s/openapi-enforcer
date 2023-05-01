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
import * as Icsd from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IDiscriminatorComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IDiscriminator3Definition {
  propertyName: string
  mapping?: Record<string, string>
}

export interface IDiscriminator3 extends IDiscriminatorComponent {
  propertyName: string
  mapping?: Record<string, string>
}

export interface IDiscriminatorValidatorsMap3 {
  propertyName: Icsd.IProperty<Icsd.IString>
  mapping: Icsd.IProperty<Icsd.IObject<Icsd.IString>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
