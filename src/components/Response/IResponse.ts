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
import { ISchema2, ISchema2Definition } from '../Schema/ISchema'
import { IHeader2, IHeader2Definition, IHeader3, IHeader3Definition } from '../Header/IHeader'
import { IExample2, IExample2Definition } from '../Example/IExample'
import { IMediaType3, IMediaType3Definition } from '../MediaType/IMediaType'
import { ILink3, ILink3Definition } from '../Link/ILink'

export interface IResponse2Definition {
  [extension: `x-${string}`]: any
  description: string
  schema?: ISchema2Definition
  headers?: Record<string, IHeader2Definition>
  examples?: IExample2Definition
}

export interface IResponse2 extends IComponentInstance {
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

export interface IResponse3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  description: string
  headers?: Record<string, IHeader3>
  content?: Record<string, IMediaType3>
  links?: Record<string, ILink3>
}

