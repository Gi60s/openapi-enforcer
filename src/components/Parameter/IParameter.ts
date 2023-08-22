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
import { ISDProperty, ISDString, ISDBoolean, ISDComponent, ISDAny, ISDNumber, ISDArray, ISDObject } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ISchema2, ISchema2Definition, ISchema3, ISchema3Definition, ISchema3a, ISchema3aDefinition } from '../Schema'
import { IItems2, IItems2Definition } from '../Items'
import { IReference3Definition, IReference3aDefinition } from '../Reference'
import { IExample3, IExample3Definition, IExample3a, IExample3aDefinition } from '../Example'
import { IMediaType3, IMediaType3Definition, IMediaType3a, IMediaType3aDefinition } from '../MediaType'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IParameter = IParameter2 | IParameter3 | IParameter3a
export type IParameterDefinition = IParameter2Definition | IParameter3Definition | IParameter3aDefinition
export type IParameter2SchemaProcessor = SchemaProcessor<IParameter2Definition, IParameter2>
export type IParameter3SchemaProcessor = SchemaProcessor<IParameter3Definition, IParameter3>
export type IParameter3aSchemaProcessor = SchemaProcessor<IParameter3aDefinition, IParameter3a>
export type IParameterSchemaProcessor = IParameter2SchemaProcessor | IParameter3SchemaProcessor | IParameter3aSchemaProcessor

export interface IParameterBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IParameter2Definition {
  [extensions: `x-${string}`]: any
  name: string
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  description?: string
  required?: boolean
  schema?: ISchema2Definition
  type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'
  format?: string
  allowEmptyValue?: boolean
  items?: IItems2Definition
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi'
  default?: any
  maximum?: any
  exclusiveMaximum?: boolean
  minimum?: any
  exclusiveMinimum?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: any
}

export interface IParameter2 extends IParameterBase {
  extensions: Record<string, any>
  name: string
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  description?: string
  required?: boolean
  schema?: ISchema2
  type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'
  format?: string
  allowEmptyValue?: boolean
  items?: IItems2
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi'
  default?: any
  maximum?: any
  exclusiveMaximum?: boolean
  minimum?: any
  exclusiveMinimum?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: any
}

export interface IParameterValidatorsMap2 {
  name: ISDProperty<ISDString>
  _in: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  required: ISDProperty<ISDBoolean>
  schema: ISDProperty<ISDComponent<ISchema2Definition, ISchema2>>
  type: ISDProperty<ISDString>
  format: ISDProperty<ISDString>
  allowEmptyValue: ISDProperty<ISDBoolean>
  items: ISDProperty<ISDComponent<IItems2Definition, IItems2>>
  collectionFormat: ISDProperty<ISDString>
  _default: ISDProperty<ISDAny>
  maximum: ISDProperty<ISDAny>
  exclusiveMaximum: ISDProperty<ISDBoolean>
  minimum: ISDProperty<ISDAny>
  exclusiveMinimum: ISDProperty<ISDBoolean>
  maxLength: ISDProperty<ISDNumber>
  minLength: ISDProperty<ISDNumber>
  pattern: ISDProperty<ISDString>
  maxItems: ISDProperty<ISDNumber>
  minItems: ISDProperty<ISDNumber>
  uniqueItems: ISDProperty<ISDBoolean>
  _enum: ISDProperty<ISDArray<ISDAny>>
  multipleOf: ISDProperty<ISDAny>
}

export interface IParameter3Definition {
  [extensions: `x-${string}`]: any
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3Definition | IReference3Definition
  example?: any
  examples?: Record<string, IExample3Definition | IReference3Definition>
  content?: Record<string, IMediaType3Definition>
}

export interface IParameter3 extends IParameterBase {
  extensions: Record<string, any>
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3
  example?: any
  examples?: Record<string, IExample3>
  content?: Record<string, IMediaType3>
}

export interface IParameterValidatorsMap3 {
  name: ISDProperty<ISDString>
  _in: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  required: ISDProperty<ISDBoolean>
  deprecated: ISDProperty<ISDBoolean>
  allowEmptyValue: ISDProperty<ISDBoolean>
  style: ISDProperty<ISDString>
  explode: ISDProperty<ISDBoolean>
  allowReserved: ISDProperty<ISDBoolean>
  schema: ISDProperty<ISDComponent<ISchema3Definition, ISchema3>>
  example: ISDProperty<ISDAny>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3Definition, IExample3>>>
  content: ISDProperty<ISDObject<ISDComponent<IMediaType3Definition, IMediaType3>>>
}

export interface IParameter3aDefinition {
  [extensions: `x-${string}`]: any
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3aDefinition | IReference3aDefinition
  example?: any
  examples?: Record<string, IExample3aDefinition | IReference3aDefinition>
  content?: Record<string, IMediaType3aDefinition>
}

export interface IParameter3a extends IParameterBase {
  extensions: Record<string, any>
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3a
  example?: any
  examples?: Record<string, IExample3a>
  content?: Record<string, IMediaType3a>
}

export interface IParameterValidatorsMap3a {
  name: ISDProperty<ISDString>
  _in: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  required: ISDProperty<ISDBoolean>
  deprecated: ISDProperty<ISDBoolean>
  allowEmptyValue: ISDProperty<ISDBoolean>
  style: ISDProperty<ISDString>
  explode: ISDProperty<ISDBoolean>
  allowReserved: ISDProperty<ISDBoolean>
  schema: ISDProperty<ISDComponent<ISchema3aDefinition, ISchema3a>>
  example: ISDProperty<ISDAny>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3aDefinition, IExample3a>>>
  content: ISDProperty<ISDObject<ISDComponent<IMediaType3aDefinition, IMediaType3a>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
