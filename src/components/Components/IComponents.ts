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
import * as I from '../IInternalTypes'
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IComponentsComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IComponents3Definition {
  [Extensions: `x-${string}`]: any
  schemas?: Record<string, I.ISchema3Definition | I.IReference3Definition>
  responses?: Record<string, I.IResponse3Definition | I.IReference3Definition>
  parameters?: Record<string, I.IParameter3Definition | I.IReference3Definition>
  examples?: Record<string, I.IExample3Definition | I.IReference3Definition>
  requestBodies?: Record<string, I.IRequestBody3Definition | I.IReference3Definition>
  headers?: Record<string, I.IHeader3Definition | I.IReference3Definition>
  securitySchemes?: Record<string, I.ISecurityScheme3Definition | I.IReference3Definition>
  links?: Record<string, I.ILink3Definition | I.IReference3Definition>
  callbacks?: Record<string, I.ICallback3Definition | I.IReference3Definition>
}

export interface IComponents3 extends IComponentsComponent {
  [Extensions]: Record<string, any>
  schemas?: Record<string, I.ISchema3>
  responses?: Record<string, I.IResponse3>
  parameters?: Record<string, I.IParameter3>
  examples?: Record<string, I.IExample3>
  requestBodies?: Record<string, I.IRequestBody3>
  headers?: Record<string, I.IHeader3>
  securitySchemes?: Record<string, I.ISecurityScheme3>
  links?: Record<string, I.ILink3>
  callbacks?: Record<string, I.ICallback3>
}

export interface IComponentsValidatorsMap3 {
  schemas: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.ISchema3Definition, I.ISchema3>>>
  responses: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IResponse3Definition, I.IResponse3>>>
  parameters: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IParameter3Definition, I.IParameter3>>>
  examples: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IExample3Definition, I.IExample3>>>
  requestBodies: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IRequestBody3Definition, I.IRequestBody3>>>
  headers: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IHeader3Definition, I.IHeader3>>>
  securitySchemes: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.ISecurityScheme3Definition, I.ISecurityScheme3>>>
  links: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.ILink3Definition, I.ILink3>>>
  callbacks: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.ICallback3Definition, I.ICallback3>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
