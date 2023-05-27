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
import { ISDProperty, ISDString, ISDComponent, ISDAny, ISDNumber, ISDBoolean, ISDArray, ISD='simple', ISDObject } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IItems2, IItems2Definition } from '../Items'
import { ISchema3, ISchema3Definition, ISchema3a, ISchema3aDefinition } from '../Schema'
import { IReference3, IReference3Definition, IReference3a, IReference3aDefinition } from '../Reference'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IHeader = IHeader2 | IHeader3 | IHeader3a
export type IHeaderDefinition = IHeader2Definition | IHeader3Definition | IHeader3aDefinition
export type IHeader2SchemaProcessor = SchemaProcessor<IHeader2Definition, IHeader2>
export type IHeader3SchemaProcessor = SchemaProcessor<IHeader3Definition, IHeader3>
export type IHeader3aSchemaProcessor = SchemaProcessor<IHeader3aDefinition, IHeader3a>
export type IHeaderSchemaProcessor = IHeader2SchemaProcessor | IHeader3SchemaProcessor | IHeader3aSchemaProcessor

export interface IHeaderBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IHeader2Definition {
  [extensions: `x-${string}`]: any
  description?: string
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

export interface IHeader2 extends IHeaderBase {
  extensions: Record<string, any>
  description?: string
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

export interface IHeaderValidatorsMap2 {
  description: ISDProperty<ISDString>
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

export interface IHeader3Definition {
  [extensions: `x-${string}`]: any
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: ='simple'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3Definition | IReference3Definition
  example?: any
  examples?: Record<string, IExample3Definition | IReference3Definition>
  content?: Record<string, IMediaType3Definition>
}

export interface IHeader3 extends IHeaderBase {
  extensions: Record<string, any>
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: ='simple'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3 | IReference3
  example?: any
  examples?: Record<string, IExample3 | IReference3>
  content?: Record<string, IMediaType3>
}

export interface IHeaderValidatorsMap3 {
  description: ISDProperty<ISDString>
  required: ISDProperty<ISDBoolean>
  deprecated: ISDProperty<ISDBoolean>
  allowEmptyValue: ISDProperty<ISDBoolean>
  style: ISDProperty<ISD='simple'>
  explode: ISDProperty<ISDBoolean>
  allowReserved: ISDProperty<ISDBoolean>
  schema: ISDProperty<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3>>
  example: ISDProperty<ISDAny>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3Definition, IExample3> | ISDComponent<IReference3Definition, IReference3>>>
  content: ISDProperty<ISDObject<ISDComponent<IMediaType3Definition, IMediaType3>>>
}

export interface IHeader3aDefinition {
  [extensions: `x-${string}`]: any
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: ='simple'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3aDefinition | IReference3aDefinition
  example?: any
  examples?: Record<string, IExample3aDefinition | IReference3aDefinition>
  content?: Record<string, IMediaType3aDefinition>
}

export interface IHeader3a extends IHeaderBase {
  extensions: Record<string, any>
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: ='simple'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3a | IReference3a
  example?: any
  examples?: Record<string, IExample3a | IReference3a>
  content?: Record<string, IMediaType3a>
}

export interface IHeaderValidatorsMap3a {
  description: ISDProperty<ISDString>
  required: ISDProperty<ISDBoolean>
  deprecated: ISDProperty<ISDBoolean>
  allowEmptyValue: ISDProperty<ISDBoolean>
  style: ISDProperty<ISD='simple'>
  explode: ISDProperty<ISDBoolean>
  allowReserved: ISDProperty<ISDBoolean>
  schema: ISDProperty<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a>>
  example: ISDProperty<ISDAny>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3aDefinition, IExample3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  content: ISDProperty<ISDObject<ISDComponent<IMediaType3aDefinition, IMediaType3a>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
