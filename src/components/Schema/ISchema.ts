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
import { ISchema2, ISchema2Definition, ISchema3, ISchema3Definition } from '../Schema/ISchema'
import { IXml2, IXml2Definition, IXml3, IXml3Definition } from '../Xml/IXml'
import { IExternalDocs2, IExternalDocs2Definition } from '../ExternalDocs/IExternalDocs'
import { IDiscriminator3, IDiscriminator3Definition } from '../Discriminator/IDiscriminator'
import { IExternalDocumentation3, IExternalDocumentation3Definition } from '../ExternalDocumentation/IExternalDocumentation'

export interface ISchema2Definition {
  [extension: `x-${string}`]: any
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
  items?: ISchema2Definition
  allOf?: ISchema2Definition[]
  properties?: Record<string, ISchema2Definition>
  additionalProperties?: ISchema2Definition | boolean
  discriminator?: string
  readOnly?: boolean
  xml?: IXml2Definition
  externalDocs?: IExternalDocs2Definition
  example?: any
}

export interface ISchema2 extends IComponentInstance {
  [extension: `x-${string}`]: any
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
  items?: ISchema2
  allOf?: ISchema2[]
  properties?: Record<string, ISchema2>
  additionalProperties?: ISchema2 | boolean
  discriminator?: string
  readOnly?: boolean
  xml?: IXml2
  externalDocs?: IExternalDocs2
  example?: any
}

export interface ISchema3Definition {
  [extension: `x-${string}`]: any
  type?: string
  allOf?: ISchema3Definition[]
  oneOf?: ISchema3Definition[]
  anyOf?: ISchema3Definition[]
  not?: ISchema3Definition
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
  items?: ISchema3Definition
  properties?: Record<string, ISchema3Definition>
  additionalProperties?: ISchema3Definition | boolean
  description?: string
  format?: string
  default?: any
  nullable?: boolean
  discriminator?: IDiscriminator3Definition
  readOnly?: boolean
  writeOnly?: boolean
  xml?: IXml3Definition
  externalDocs?: IExternalDocumentation3Definition
  example?: any
  deprecated?: boolean
}

export interface ISchema3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  type?: string
  allOf?: ISchema3[]
  oneOf?: ISchema3[]
  anyOf?: ISchema3[]
  not?: ISchema3
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
  items?: ISchema3
  properties?: Record<string, ISchema3>
  additionalProperties?: ISchema3 | boolean
  description?: string
  format?: string
  default?: any
  nullable?: boolean
  discriminator?: IDiscriminator3
  readOnly?: boolean
  writeOnly?: boolean
  xml?: IXml3
  externalDocs?: IExternalDocumentation3
  example?: any
  deprecated?: boolean
}

