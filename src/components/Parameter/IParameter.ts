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

interface IParameterComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IParameter2Definition {
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
  exclusiveMinimum?: number
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
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
}

export interface IParameter3Definition {
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

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
