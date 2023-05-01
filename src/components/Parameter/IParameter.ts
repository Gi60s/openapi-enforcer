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

interface IParameterComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IParameter2Definition {
  [Extensions: `x-${string}`]: any
  name: string
  in: 'body'|'formData'|'header'|'path'|'query'
  description?: string
  required?: boolean
  schema?: I.ISchema2Definition
  type?: 'array'|'boolean'|'file'|'integer'|'number'|'string'
  format?: string
  allowEmptyValue?: boolean
  items?: I.IItems2Definition
  collectionFormat?: 'csv'|'ssv'|'tsv'|'pipes'|'multi'
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

export interface IParameter2 extends IParameterComponent {
  [Extensions]: Record<string, any>
  name: string
  in: 'body'|'formData'|'header'|'path'|'query'
  description?: string
  required?: boolean
  schema?: I.ISchema2
  type?: 'array'|'boolean'|'file'|'integer'|'number'|'string'
  format?: string
  allowEmptyValue?: boolean
  items?: I.IItems2
  collectionFormat?: 'csv'|'ssv'|'tsv'|'pipes'|'multi'
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

export interface IParameterValidatorsMap2 {
  name: Icsd.IProperty<Icsd.IString>
  _in: Icsd.IProperty<Icsd.IString>
  description: Icsd.IProperty<Icsd.IString>
  required: Icsd.IProperty<Icsd.IBoolean>
  schema: Icsd.IProperty<Icsd.IComponent<I.ISchema2Definition, I.ISchema2>>
  type: Icsd.IProperty<Icsd.IString>
  format: Icsd.IProperty<Icsd.IString>
  allowEmptyValue: Icsd.IProperty<Icsd.IBoolean>
  items: Icsd.IProperty<Icsd.IComponent<I.IItems2Definition, I.IItems2>>
  collectionFormat: Icsd.IProperty<Icsd.IString>
  _default: Icsd.IProperty<any>
  maximum: Icsd.IProperty<Icsd.INumber>
  exclusiveMaximum: Icsd.IProperty<Icsd.IBoolean>
  minimum: Icsd.IProperty<Icsd.INumber>
  exclusiveMinimum: Icsd.IProperty<Icsd.IBoolean>
  maxLength: Icsd.IProperty<Icsd.INumber>
  minLength: Icsd.IProperty<Icsd.INumber>
  pattern: Icsd.IProperty<Icsd.IString>
  maxItems: Icsd.IProperty<Icsd.INumber>
  minItems: Icsd.IProperty<Icsd.INumber>
  uniqueItems: Icsd.IProperty<Icsd.IBoolean>
  _enum: Icsd.IProperty<Icsd.IArray<any>>
  multipleOf: Icsd.IProperty<Icsd.INumber>
}

export interface IParameter3Definition {
  [Extensions: `x-${string}`]: any
  name: string
  in: 'cookie'|'header'|'path'|'query'
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'deepObject'|'form'|'label'|'matrix'|'pipeDelimited'|'simple'|'spaceDelimited'
  explode?: boolean
  allowReserved?: boolean
  schema?: I.ISchema3Definition | I.IReference3Definition
  example?: any
  examples?: Record<string, I.IExample3Definition | I.IReference3Definition>
  content?: Record<string, I.IMediaType3Definition>
}

export interface IParameter3 extends IParameterComponent {
  [Extensions]: Record<string, any>
  name: string
  in: 'cookie'|'header'|'path'|'query'
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'deepObject'|'form'|'label'|'matrix'|'pipeDelimited'|'simple'|'spaceDelimited'
  explode?: boolean
  allowReserved?: boolean
  schema?: I.ISchema3
  example?: any
  examples?: Record<string, I.IExample3>
  content?: Record<string, I.IMediaType3>
}

export interface IParameterValidatorsMap3 {
  name: Icsd.IProperty<Icsd.IString>
  _in: Icsd.IProperty<Icsd.IString>
  description: Icsd.IProperty<Icsd.IString>
  required: Icsd.IProperty<Icsd.IBoolean>
  deprecated: Icsd.IProperty<Icsd.IBoolean>
  allowEmptyValue: Icsd.IProperty<Icsd.IBoolean>
  style: Icsd.IProperty<Icsd.IString>
  explode: Icsd.IProperty<Icsd.IBoolean>
  allowReserved: Icsd.IProperty<Icsd.IBoolean>
  schema: Icsd.IProperty<Icsd.IComponent<I.ISchema3Definition, I.ISchema3>>
  example: Icsd.IProperty<any>
  examples: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IExample3Definition, I.IExample3>>>
  content: Icsd.IProperty<Icsd.IObject<Icsd.IComponent<I.IMediaType3Definition, I.IMediaType3>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
