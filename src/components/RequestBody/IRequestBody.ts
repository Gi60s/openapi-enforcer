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
import { IMediaType3, IMediaType3Definition } from '../MediaType/IMediaType'

export interface IRequestBody3Definition {
  [extension: `x-${string}`]: any
  description?: string
  content?: Record<string, IMediaType3Definition>
  required?: boolean
}

export interface IRequestBody3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  description?: string
  content?: Record<string, IMediaType3>
  required?: boolean
}

