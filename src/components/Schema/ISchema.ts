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
import * as I from '../IInternalTypes'
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface ISchemaComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ISchema2Definition {
  [Extensions]: Record<string, any>
  format?: string
  title?: string
  description?: string
  default?: any
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  maxProperties?: number
  minProperties?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
  required?: string[]
  type?: string
  items?: I.ISchema2Definition
  allOf?: I.ISchema2Definition[]
  properties?: Record<string, I.ISchema2Definition>
  additionalProperties?: I.ISchema2Definition | boolean
  discriminator?: string
  readOnly?: boolean
  xml?: I.IXml2Definition
  externalDocs?: I.IExternalDocumentation2Definition
  example?: any
}

export interface ISchema2 extends ISchemaComponent {
  [Extensions]: Record<string, any>
  format?: string
  title?: string
  description?: string
  default?: any
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  maxProperties?: number
  minProperties?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
  required?: string[]
  type?: string
  items?: I.ISchema2
  allOf?: I.ISchema2[]
  properties?: Record<string, I.ISchema2>
  additionalProperties?: I.ISchema2 | boolean
  discriminator?: string
  readOnly?: boolean
  xml?: I.IXml2
  externalDocs?: I.IExternalDocumentation2
  example?: any
}

export interface ISchema3Definition {
  [Extensions]: Record<string, any>
  type?: string
  allOf?: I.ISchema3Definition[]
  oneOf?: I.ISchema3Definition[]
  anyOf?: I.ISchema3Definition[]
  not?: I.ISchema3Definition
  title?: string
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  maxProperties?: number
  minProperties?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
  required?: string[]
  items?: I.ISchema3Definition
  properties?: Record<string, I.ISchema3Definition>
  additionalProperties?: I.ISchema3Definition | boolean
  description?: string
  format?: string
  default?: any
  nullable?: boolean
  discriminator?: I.IDiscriminator3Definition
  readOnly?: boolean
  writeOnly?: boolean
  xml?: I.IXml3Definition
  externalDocs?: I.IExternalDocumentation3Definition
  example?: any
  deprecated?: boolean
}

export interface ISchema3 extends ISchemaComponent {
  [Extensions]: Record<string, any>
  type?: string
  allOf?: I.ISchema3[]
  oneOf?: I.ISchema3[]
  anyOf?: I.ISchema3[]
  not?: I.ISchema3
  title?: string
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  maxProperties?: number
  minProperties?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
  required?: string[]
  items?: I.ISchema3
  properties?: Record<string, I.ISchema3>
  additionalProperties?: I.ISchema3 | boolean
  description?: string
  format?: string
  default?: any
  nullable?: boolean
  discriminator?: I.IDiscriminator3
  readOnly?: boolean
  writeOnly?: boolean
  xml?: I.IXml3
  externalDocs?: I.IExternalDocumentation3
  example?: any
  deprecated?: boolean
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
