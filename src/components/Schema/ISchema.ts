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
import { ISDProperty, ISDString, ISDAny, ISDNumber, ISDBoolean, ISDArray, ISDComponent, ISDObject } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IReference2, IReference2Definition, IReference3, IReference3Definition, IReference3a, IReference3aDefinition } from '../Reference'
import { IXml2, IXml2Definition, IXml3, IXml3Definition, IXml3a, IXml3aDefinition } from '../Xml'
import { IExternalDocumentation2, IExternalDocumentation2Definition, IExternalDocumentation3, IExternalDocumentation3Definition, IExternalDocumentation3a, IExternalDocumentation3aDefinition } from '../ExternalDocumentation'
import { IDiscriminator3, IDiscriminator3Definition, IDiscriminator3a, IDiscriminator3aDefinition } from '../Discriminator'

// <!# Custom Content Begin: HEADER #!>
import { Result } from '../../Result'
import { ExceptionStore } from '../../Exception/ExceptionStore'

export interface ISchemaPopulateOptions {
  copy?: boolean
  conditions?: boolean
  defaults?: boolean
  depth?: number
  replacement?: string
  templateDefaults?: boolean
  templates?: boolean
  variables?: boolean
}

export interface ISchemaRandomOptions {
  additionalPropertiesPossibility?: number
  arrayVariation?: number
  copy?: false
  defaultPossibility?: number
  definedPropertyPossibility?: number
  maxDepth?: number
  numberVariation?: number
  uniqueItemRetry?: number
}

export interface ISchemaValidateOptions {
  readWriteMode?: 'read' | 'write'
}

export type ISchemaHookType = 'afterDeserialize' | 'afterSerialize' | 'afterValidate' | 'beforeDeserialize' | 'beforeSerialize' | 'beforeValidate'
export type ISchemaHookHandler = (value: any, schema: ISchema2 | ISchema3, exception: ExceptionStore) => void
export interface ISchemaHookResult {
  done: boolean
  hasException?: boolean
  value: any
}

// <!# Custom Content End: HEADER #!>

export type ISchema = ISchema2 | ISchema3 | ISchema3a
export type ISchemaDefinition = ISchema2Definition | ISchema3Definition | ISchema3aDefinition
export type ISchema2SchemaProcessor = SchemaProcessor<ISchema2Definition, ISchema2>
export type ISchema3SchemaProcessor = SchemaProcessor<ISchema3Definition, ISchema3>
export type ISchema3aSchemaProcessor = SchemaProcessor<ISchema3aDefinition, ISchema3a>
export type ISchemaSchemaProcessor = ISchema2SchemaProcessor | ISchema3SchemaProcessor | ISchema3aSchemaProcessor

export interface ISchemaBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  deserialize: (value: string, options?: { strict: boolean }) => any
  discriminate: (value: object) => { key: string, name: string, schema: ISchemaComponent }
  hook: (type: ISchemaHookType, handler: ISchemaHookHandler) => ISchemaHookResult
  populate: (params: Record<string, any>, value: object, options?: ISchemaPopulateOptions) => Result
  random: (value: any, options?: ISchemaRandomOptions) => Result<object>
  serialize: (value: any) => Result
  unhook: (type: ISchemaHookType, handler: ISchemaHookHandler) => void
  validate: (value: any, options?: ISchemaValidateOptions) => ExceptionStore | undefined
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface ISchema2Definition {
  [extensions: `x-${string}`]: any
  format?: string
  title?: string
  description?: string
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
  maxProperties?: number
  minProperties?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
  required?: string[]
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  items?: ISchema2Definition
  allOf?: Array<ISchema2Definition | IReference2Definition>
  properties?: Record<string, ISchema2Definition | IReference2Definition>
  additionalProperties?: ISchema2Definition | IReference2Definition | boolean
  discriminator?: string
  readOnly?: boolean
  xml?: IXml2Definition
  externalDocs?: IExternalDocumentation2Definition
  example?: any
}

export interface ISchema2 extends ISchemaBase {
  extensions: Record<string, any>
  format?: string
  title?: string
  description?: string
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
  maxProperties?: number
  minProperties?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
  required?: string[]
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  items?: ISchema2
  allOf?: Array<ISchema2 | IReference2>
  properties?: Record<string, ISchema2 | IReference2>
  additionalProperties?: ISchema2 | IReference2 | boolean
  discriminator?: string
  readOnly?: boolean
  xml?: IXml2
  externalDocs?: IExternalDocumentation2
  example?: any
}

export interface ISchemaValidatorsMap2 {
  format: ISDProperty<ISDString>
  title: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
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
  maxProperties: ISDProperty<ISDNumber>
  minProperties: ISDProperty<ISDNumber>
  uniqueItems: ISDProperty<ISDBoolean>
  _enum: ISDProperty<ISDArray<ISDAny>>
  multipleOf: ISDProperty<ISDNumber>
  required: ISDProperty<ISDArray<ISDString>>
  type: ISDProperty<ISDString>
  items: ISDProperty<ISDComponent<ISchema2Definition, ISchema2>>
  allOf: ISDProperty<ISDArray<ISDComponent<ISchema2Definition, ISchema2> | ISDComponent<IReference2Definition, IReference2>>>
  properties: ISDProperty<ISDObject<ISDComponent<ISchema2Definition, ISchema2> | ISDComponent<IReference2Definition, IReference2>>>
  additionalProperties: ISDProperty<ISDComponent<ISchema2Definition, ISchema2> | ISDComponent<IReference2Definition, IReference2> | ISDBoolean>
  discriminator: ISDProperty<ISDString>
  readOnly: ISDProperty<ISDBoolean>
  xml: ISDProperty<ISDComponent<IXml2Definition, IXml2>>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation2Definition, IExternalDocumentation2>>
  example: ISDProperty<ISDAny>
}

export interface ISchema3Definition {
  [extensions: `x-${string}`]: any
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  allOf?: Array<ISchema3Definition | IReference3Definition>
  oneOf?: Array<ISchema3Definition | IReference3Definition>
  anyOf?: Array<ISchema3Definition | IReference3Definition>
  not?: ISchema3Definition | IReference3Definition
  title?: string
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
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
  items?: ISchema3Definition | IReference3Definition
  properties?: Record<string, ISchema3Definition | IReference3Definition>
  additionalProperties?: ISchema3Definition | IReference3Definition | boolean
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

export interface ISchema3 extends ISchemaBase {
  extensions: Record<string, any>
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  allOf?: Array<ISchema3 | IReference3>
  oneOf?: Array<ISchema3 | IReference3>
  anyOf?: Array<ISchema3 | IReference3>
  not?: ISchema3 | IReference3
  title?: string
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
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
  items?: ISchema3 | IReference3
  properties?: Record<string, ISchema3 | IReference3>
  additionalProperties?: ISchema3 | IReference3 | boolean
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

export interface ISchemaValidatorsMap3 {
  type: ISDProperty<ISDString>
  allOf: ISDProperty<ISDArray<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3>>>
  oneOf: ISDProperty<ISDArray<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3>>>
  anyOf: ISDProperty<ISDArray<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3>>>
  not: ISDProperty<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3>>
  title: ISDProperty<ISDString>
  maximum: ISDProperty<ISDNumber>
  exclusiveMaximum: ISDProperty<ISDBoolean>
  minimum: ISDProperty<ISDNumber>
  exclusiveMinimum: ISDProperty<ISDBoolean>
  maxLength: ISDProperty<ISDNumber>
  minLength: ISDProperty<ISDNumber>
  pattern: ISDProperty<ISDString>
  maxItems: ISDProperty<ISDNumber>
  minItems: ISDProperty<ISDNumber>
  maxProperties: ISDProperty<ISDNumber>
  minProperties: ISDProperty<ISDNumber>
  uniqueItems: ISDProperty<ISDBoolean>
  _enum: ISDProperty<ISDArray<ISDAny>>
  multipleOf: ISDProperty<ISDNumber>
  required: ISDProperty<ISDArray<ISDString>>
  items: ISDProperty<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3>>
  properties: ISDProperty<ISDObject<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3>>>
  additionalProperties: ISDProperty<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3> | ISDBoolean>
  description: ISDProperty<ISDString>
  format: ISDProperty<ISDString>
  _default: ISDProperty<ISDAny>
  nullable: ISDProperty<ISDBoolean>
  discriminator: ISDProperty<ISDComponent<IDiscriminator3Definition, IDiscriminator3>>
  readOnly: ISDProperty<ISDBoolean>
  writeOnly: ISDProperty<ISDBoolean>
  xml: ISDProperty<ISDComponent<IXml3Definition, IXml3>>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation3Definition, IExternalDocumentation3>>
  example: ISDProperty<ISDAny>
  deprecated: ISDProperty<ISDBoolean>
}

export interface ISchema3aDefinition {
  [extensions: `x-${string}`]: any
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string' | Array<'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'>
  allOf?: Array<ISchema3aDefinition | IReference3aDefinition>
  oneOf?: Array<ISchema3aDefinition | IReference3aDefinition>
  anyOf?: Array<ISchema3aDefinition | IReference3aDefinition>
  not?: ISchema3aDefinition | IReference3aDefinition
  title?: string
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
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
  items?: ISchema3aDefinition | IReference3aDefinition
  properties?: Record<string, ISchema3aDefinition | IReference3aDefinition>
  additionalProperties?: ISchema3aDefinition | IReference3aDefinition | boolean
  description?: string
  format?: string
  default?: any
  nullable?: boolean
  discriminator?: IDiscriminator3aDefinition
  readOnly?: boolean
  writeOnly?: boolean
  xml?: IXml3aDefinition
  externalDocs?: IExternalDocumentation3aDefinition
  example?: any
  deprecated?: boolean
}

export interface ISchema3a extends ISchemaBase {
  extensions: Record<string, any>
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string' | Array<'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'>
  allOf?: Array<ISchema3a | IReference3a>
  oneOf?: Array<ISchema3a | IReference3a>
  anyOf?: Array<ISchema3a | IReference3a>
  not?: ISchema3a | IReference3a
  title?: string
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
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
  items?: ISchema3a | IReference3a
  properties?: Record<string, ISchema3a | IReference3a>
  additionalProperties?: ISchema3a | IReference3a | boolean
  description?: string
  format?: string
  default?: any
  nullable?: boolean
  discriminator?: IDiscriminator3a
  readOnly?: boolean
  writeOnly?: boolean
  xml?: IXml3a
  externalDocs?: IExternalDocumentation3a
  example?: any
  deprecated?: boolean
}

export interface ISchemaValidatorsMap3a {
  type: ISDProperty<ISDString | ISDArray<ISDString>>
  allOf: ISDProperty<ISDArray<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  oneOf: ISDProperty<ISDArray<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  anyOf: ISDProperty<ISDArray<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  not: ISDProperty<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a>>
  title: ISDProperty<ISDString>
  maximum: ISDProperty<ISDNumber>
  exclusiveMaximum: ISDProperty<ISDBoolean>
  minimum: ISDProperty<ISDNumber>
  exclusiveMinimum: ISDProperty<ISDBoolean>
  maxLength: ISDProperty<ISDNumber>
  minLength: ISDProperty<ISDNumber>
  pattern: ISDProperty<ISDString>
  maxItems: ISDProperty<ISDNumber>
  minItems: ISDProperty<ISDNumber>
  maxProperties: ISDProperty<ISDNumber>
  minProperties: ISDProperty<ISDNumber>
  uniqueItems: ISDProperty<ISDBoolean>
  _enum: ISDProperty<ISDArray<ISDAny>>
  multipleOf: ISDProperty<ISDNumber>
  required: ISDProperty<ISDArray<ISDString>>
  items: ISDProperty<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a>>
  properties: ISDProperty<ISDObject<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  additionalProperties: ISDProperty<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a> | ISDBoolean>
  description: ISDProperty<ISDString>
  format: ISDProperty<ISDString>
  _default: ISDProperty<ISDAny>
  nullable: ISDProperty<ISDBoolean>
  discriminator: ISDProperty<ISDComponent<IDiscriminator3aDefinition, IDiscriminator3a>>
  readOnly: ISDProperty<ISDBoolean>
  writeOnly: ISDProperty<ISDBoolean>
  xml: ISDProperty<ISDComponent<IXml3aDefinition, IXml3a>>
  externalDocs: ISDProperty<ISDComponent<IExternalDocumentation3aDefinition, IExternalDocumentation3a>>
  example: ISDProperty<ISDAny>
  deprecated: ISDProperty<ISDBoolean>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
