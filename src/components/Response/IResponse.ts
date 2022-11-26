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
  IExample2,
  IExample2Definition,
  IHeader2,
  IHeader2Definition,
  IHeader3,
  IHeader3Definition,
  ILink3,
  ILink3Definition,
  IMediaType3,
  IMediaType3Definition,
  ISchema2,
  ISchema2Definition
} from '../'
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
  schema?: ISchema2Definition
  headers?: Record<string, IHeader2Definition>
  examples?: IExample2Definition
}

export interface IResponse2 extends IResponseComponent {
  [extension: `x-${string}`]: any
  description: string
  schema?: ISchema2
  headers?: Record<string, IHeader2>
  examples?: IExample2
}

export interface IResponse3Definition {
  [extension: `x-${string}`]: any
  description: string
  headers?: Record<string, IHeader3Definition>
  content?: Record<string, IMediaType3Definition>
  links?: Record<string, ILink3Definition>
}

export interface IResponse3 extends IResponseComponent {
  [extension: `x-${string}`]: any
  description: string
  headers?: Record<string, IHeader3>
  content?: Record<string, IMediaType3>
  links?: Record<string, ILink3>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
