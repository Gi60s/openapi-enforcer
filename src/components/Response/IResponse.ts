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
// <!# Custom Content Begin: HEADER #!>
import { IContentType } from '../../ContentType/IContentType'
// <!# Custom Content End: HEADER #!>

interface IResponseComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  canProduceContentType: (code: number | 'default', contentType: string | IContentType) => boolean
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IResponse2Definition {
  [extension: `x-${string}`]: any
  description: string
  schema?: I.ISchema2Definition
  headers?: Record<string, I.IHeader2Definition>
  examples?: I.IExample2Definition
}

export interface IResponse2 extends IResponseComponent {
  [extension: `x-${string}`]: any
  description: string
  schema?: I.ISchema2
  headers?: Record<string, I.IHeader2>
  examples?: I.IExample2
}

export interface IResponse3Definition {
  [extension: `x-${string}`]: any
  description: string
  headers?: Record<string, I.IHeader3Definition>
  content?: Record<string, I.IMediaType3Definition>
  links?: Record<string, I.ILink3Definition>
}

export interface IResponse3 extends IResponseComponent {
  [extension: `x-${string}`]: any
  description: string
  headers?: Record<string, I.IHeader3>
  content?: Record<string, I.IMediaType3>
  links?: Record<string, I.ILink3>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
