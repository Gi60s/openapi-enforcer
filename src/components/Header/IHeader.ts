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

interface IHeaderComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IHeader2Definition {
  [Extensions: `x-${string}`]: any
  description?: string
  type: 'array'|'boolean'|'integer'|'number'|'string'
  format?: string
  items?: I.IItems2Definition
  collectionFormat?: 'csv'|'ssv'|'tsv'|'pipes'
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

export interface IHeader2 extends IHeaderComponent {
  [Extensions]: Record<string, any>
  description?: string
  type: 'array'|'boolean'|'integer'|'number'|'string'
  format?: string
  items?: I.IItems2
  collectionFormat?: 'csv'|'ssv'|'tsv'|'pipes'
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

export interface IHeader3Definition {
  [Extensions: `x-${string}`]: any
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'simple'
  explode?: boolean
  allowReserved?: boolean
  schema?: I.ISchema3Definition | I.IReference3Definition
  example?: any
  examples?: Record<string, I.IExample3Definition | I.IReference3Definition>
  content?: Record<string, I.IMediaType3Definition>
}

export interface IHeader3 extends IHeaderComponent {
  [Extensions]: Record<string, any>
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'simple'
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
