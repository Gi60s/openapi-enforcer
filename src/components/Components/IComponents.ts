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
import { ISchema3, ISchema3Definition, ISchema3a, ISchema3aDefinition } from '../Schema'
import { IReference3Definition, IReference3aDefinition } from '../Reference'
import { IResponse3, IResponse3Definition, IResponse3a, IResponse3aDefinition } from '../Response'
import { IParameter3, IParameter3Definition, IParameter3a, IParameter3aDefinition } from '../Parameter'
import { IExample3, IExample3Definition, IExample3a, IExample3aDefinition } from '../Example'
import { IRequestBody3, IRequestBody3Definition, IRequestBody3a, IRequestBody3aDefinition } from '../RequestBody'
import { IHeader3, IHeader3Definition, IHeader3a, IHeader3aDefinition } from '../Header'
import { ISecurityScheme3, ISecurityScheme3Definition, ISecurityScheme3a, ISecurityScheme3aDefinition } from '../SecurityScheme'
import { ILink3, ILink3Definition, ILink3a, ILink3aDefinition } from '../Link'
import { ICallback3, ICallback3Definition, ICallback3a, ICallback3aDefinition } from '../Callback'

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
  schemas?: Record<string, ISchema3>
  responses?: Record<string, IResponse3>
  parameters?: Record<string, IParameter3>
  examples?: Record<string, IExample3>
  requestBodies?: Record<string, IRequestBody3>
  headers?: Record<string, IHeader3>
  securitySchemes?: Record<string, ISecurityScheme3>
  links?: Record<string, ILink3>
  callbacks?: Record<string, ICallback3>
}

export interface IComponentsValidatorsMap3 {
  schemas: ISDProperty<ISDObject<ISDComponent<ISchema3Definition, ISchema3>>>
  responses: ISDProperty<ISDObject<ISDComponent<IResponse3Definition, IResponse3>>>
  parameters: ISDProperty<ISDObject<ISDComponent<IParameter3Definition, IParameter3>>>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3Definition, IExample3>>>
  requestBodies: ISDProperty<ISDObject<ISDComponent<IRequestBody3Definition, IRequestBody3>>>
  headers: ISDProperty<ISDObject<ISDComponent<IHeader3Definition, IHeader3>>>
  securitySchemes: ISDProperty<ISDObject<ISDComponent<ISecurityScheme3Definition, ISecurityScheme3>>>
  links: ISDProperty<ISDObject<ISDComponent<ILink3Definition, ILink3>>>
  callbacks: ISDProperty<ISDObject<ISDComponent<ICallback3Definition, ICallback3>>>
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
  schemas?: Record<string, ISchema3a>
  responses?: Record<string, IResponse3a>
  parameters?: Record<string, IParameter3a>
  examples?: Record<string, IExample3a>
  requestBodies?: Record<string, IRequestBody3a>
  headers?: Record<string, IHeader3a>
  securitySchemes?: Record<string, ISecurityScheme3a>
  links?: Record<string, ILink3a>
  callbacks?: Record<string, ICallback3a>
}

export interface IComponentsValidatorsMap3a {
  schemas: ISDProperty<ISDObject<ISDComponent<ISchema3aDefinition, ISchema3a>>>
  responses: ISDProperty<ISDObject<ISDComponent<IResponse3aDefinition, IResponse3a>>>
  parameters: ISDProperty<ISDObject<ISDComponent<IParameter3aDefinition, IParameter3a>>>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3aDefinition, IExample3a>>>
  requestBodies: ISDProperty<ISDObject<ISDComponent<IRequestBody3aDefinition, IRequestBody3a>>>
  headers: ISDProperty<ISDObject<ISDComponent<IHeader3aDefinition, IHeader3a>>>
  securitySchemes: ISDProperty<ISDObject<ISDComponent<ISecurityScheme3aDefinition, ISecurityScheme3a>>>
  links: ISDProperty<ISDObject<ISDComponent<ILink3aDefinition, ILink3a>>>
  callbacks: ISDProperty<ISDObject<ISDComponent<ICallback3aDefinition, ICallback3a>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
