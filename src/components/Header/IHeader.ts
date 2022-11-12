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
import {
  IExample3,
  IExample3Definition,
  IItems2,
  IItems2Definition,
  IMediaType3,
  IMediaType3Definition,
  ISchema3,
  ISchema3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export interface IHeader2Definition {
  [extension: `x-${string}`]: any
  description?: string
  type: 'array'|'boolean'|'integer'|'number'|'string'
  format?: string
  items?: IItems2Definition
  collectionFormat?: 'csv'|'ssv'|'tsv'|'pipes'
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
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
}

export interface IHeader2 extends IComponentInstance {
  [extension: `x-${string}`]: any
  description?: string
  type: 'array'|'boolean'|'integer'|'number'|'string'
  format?: string
  items?: IItems2
  collectionFormat?: 'csv'|'ssv'|'tsv'|'pipes'
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
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
}

export interface IHeader3Definition {
  [extension: `x-${string}`]: any
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'simple'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3Definition
  example?: any
  examples?: Record<string, IExample3Definition>
  content?: Record<string, IMediaType3Definition>
}

export interface IHeader3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'simple'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3
  example?: any
  examples?: Record<string, IExample3>
  content?: Record<string, IMediaType3>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
