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
import { ISDProperty, ISDObject, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IComponents = IComponents3 | IComponents3a
export type IComponentsDefinition = IComponents3Definition | IComponents3aDefinition
export type IComponents3SchemaProcessor = SchemaProcessor<IComponents3Definition, IComponents3>
export type IComponents3aSchemaProcessor = SchemaProcessor<IComponents3aDefinition, IComponents3a>
export type IComponentsSchemaProcessor = IComponents3SchemaProcessor | IComponents3aSchemaProcessor

export interface IComponentsBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IComponents3Definition {
  [extensions: `x-${string}`]: any
  schemas?: Record<string, ISchema3Definition | IReference3Definition>
  responses?: Record<string, IResponse3Definition | IReference3Definition>
  parameters?: Record<string, IParameter3Definition | IReference3Definition>
  examples?: Record<string, IExample3Definition | IReference3Definition>
  requestBodies?: Record<string, IRequestBody3Definition | IReference3Definition>
  headers?: Record<string, IHeader3Definition | IReference3Definition>
  securitySchemes?: Record<string, ISecurityScheme3Definition | IReference3Definition>
  links?: Record<string, ILink3Definition | IReference3Definition>
  callbacks?: Record<string, ICallback3Definition | IReference3Definition>
}

export interface IComponents3 extends IComponentsBase {
  extensions: Record<string, any>
  schemas?: Record<string, ISchema3 | IReference3>
  responses?: Record<string, IResponse3 | IReference3>
  parameters?: Record<string, IParameter3 | IReference3>
  examples?: Record<string, IExample3 | IReference3>
  requestBodies?: Record<string, IRequestBody3 | IReference3>
  headers?: Record<string, IHeader3 | IReference3>
  securitySchemes?: Record<string, ISecurityScheme3 | IReference3>
  links?: Record<string, ILink3 | IReference3>
  callbacks?: Record<string, ICallback3 | IReference3>
}

export interface IComponentsValidatorsMap3 {
  schemas: ISDProperty<ISDObject<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3>>>
  responses: ISDProperty<ISDObject<ISDComponent<IResponse3Definition, IResponse3> | ISDComponent<IReference3Definition, IReference3>>>
  parameters: ISDProperty<ISDObject<ISDComponent<IParameter3Definition, IParameter3> | ISDComponent<IReference3Definition, IReference3>>>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3Definition, IExample3> | ISDComponent<IReference3Definition, IReference3>>>
  requestBodies: ISDProperty<ISDObject<ISDComponent<IRequestBody3Definition, IRequestBody3> | ISDComponent<IReference3Definition, IReference3>>>
  headers: ISDProperty<ISDObject<ISDComponent<IHeader3Definition, IHeader3> | ISDComponent<IReference3Definition, IReference3>>>
  securitySchemes: ISDProperty<ISDObject<ISDComponent<ISecurityScheme3Definition, ISecurityScheme3> | ISDComponent<IReference3Definition, IReference3>>>
  links: ISDProperty<ISDObject<ISDComponent<ILink3Definition, ILink3> | ISDComponent<IReference3Definition, IReference3>>>
  callbacks: ISDProperty<ISDObject<ISDComponent<ICallback3Definition, ICallback3> | ISDComponent<IReference3Definition, IReference3>>>
}

export interface IComponents3aDefinition {
  [extensions: `x-${string}`]: any
  schemas?: Record<string, ISchema3aDefinition | IReference3aDefinition>
  responses?: Record<string, IResponse3aDefinition | IReference3aDefinition>
  parameters?: Record<string, IParameter3aDefinition | IReference3aDefinition>
  examples?: Record<string, IExample3aDefinition | IReference3aDefinition>
  requestBodies?: Record<string, IRequestBody3aDefinition | IReference3aDefinition>
  headers?: Record<string, IHeader3aDefinition | IReference3aDefinition>
  securitySchemes?: Record<string, ISecurityScheme3aDefinition | IReference3aDefinition>
  links?: Record<string, ILink3aDefinition | IReference3aDefinition>
  callbacks?: Record<string, ICallback3aDefinition | IReference3aDefinition>
}

export interface IComponents3a extends IComponentsBase {
  extensions: Record<string, any>
  schemas?: Record<string, ISchema3a | IReference3a>
  responses?: Record<string, IResponse3a | IReference3a>
  parameters?: Record<string, IParameter3a | IReference3a>
  examples?: Record<string, IExample3a | IReference3a>
  requestBodies?: Record<string, IRequestBody3a | IReference3a>
  headers?: Record<string, IHeader3a | IReference3a>
  securitySchemes?: Record<string, ISecurityScheme3a | IReference3a>
  links?: Record<string, ILink3a | IReference3a>
  callbacks?: Record<string, ICallback3a | IReference3a>
}

export interface IComponentsValidatorsMap3a {
  schemas: ISDProperty<ISDObject<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  responses: ISDProperty<ISDObject<ISDComponent<IResponse3aDefinition, IResponse3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  parameters: ISDProperty<ISDObject<ISDComponent<IParameter3aDefinition, IParameter3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3aDefinition, IExample3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  requestBodies: ISDProperty<ISDObject<ISDComponent<IRequestBody3aDefinition, IRequestBody3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  headers: ISDProperty<ISDObject<ISDComponent<IHeader3aDefinition, IHeader3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  securitySchemes: ISDProperty<ISDObject<ISDComponent<ISecurityScheme3aDefinition, ISecurityScheme3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  links: ISDProperty<ISDObject<ISDComponent<ILink3aDefinition, ILink3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  callbacks: ISDProperty<ISDObject<ISDComponent<ICallback3aDefinition, ICallback3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
