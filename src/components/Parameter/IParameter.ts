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
import { IItems2, IItems2Definition } from '../Items/IItems'
import { IExample3, IExample3Definition } from '../Example/IExample'
import { IMediaType3, IMediaType3Definition } from '../MediaType/IMediaType'

export interface IParameter2Definition {
  [extension: `x-${string}`]: any
  name: string
  in: 'body'|'formData'|'header'|'path'|'query'
  description?: string
  required?: boolean
  schema?: ISchema2Definition
  type?: 'array'|'boolean'|'file'|'integer'|'number'|'string'
  format?: string
  allowEmptyValue?: boolean
  items?: IItems2Definition
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

export interface IParameter2 extends IComponentInstance {
  [extension: `x-${string}`]: any
  name: string
  in: 'body'|'formData'|'header'|'path'|'query'
  description?: string
  required?: boolean
  schema?: ISchema2
  type?: 'array'|'boolean'|'file'|'integer'|'number'|'string'
  format?: string
  allowEmptyValue?: boolean
  items?: IItems2
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
  [extension: `x-${string}`]: any
  name: string
  in: 'cookie'|'header'|'path'|'query'
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'deepObject'|'form'|'label'|'matrix'|'pipeDelimited'|'simple'|'spaceDelimited'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3Definition
  example?: any
  examples?: Record<string, IExample3Definition>
  content?: Record<string, IMediaType3Definition>
}

export interface IParameter3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  name: string
  in: 'cookie'|'header'|'path'|'query'
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'deepObject'|'form'|'label'|'matrix'|'pipeDelimited'|'simple'|'spaceDelimited'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3
  example?: any
  examples?: Record<string, IExample3>
  content?: Record<string, IMediaType3>
}

