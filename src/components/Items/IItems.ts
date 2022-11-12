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
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export interface IItems2Definition {
  [extension: `x-${string}`]: any
  type: 'array'|'boolean'|'integer'|'number'|'string'
  format?: string
  items?: IItems2Definition
  collectionFormat?: 'csv'|'ssv'|'tsv'|'pipes'
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

export interface IItems2 extends IComponentInstance {
  [extension: `x-${string}`]: any
  type: 'array'|'boolean'|'integer'|'number'|'string'
  format?: string
  items?: IItems2
  collectionFormat?: 'csv'|'ssv'|'tsv'|'pipes'
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

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
