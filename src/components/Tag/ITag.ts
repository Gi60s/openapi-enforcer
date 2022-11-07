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
import { IExternalDocumentation2, IExternalDocumentation2Definition, IExternalDocumentation3, IExternalDocumentation3Definition } from '../ExternalDocumentation/IExternalDocumentation'

export interface ITag2Definition {
  [extension: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: IExternalDocumentation2Definition
}

export interface ITag2 extends IComponentInstance {
  [extension: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: IExternalDocumentation2
}

export interface ITag3Definition {
  [extension: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: IExternalDocumentation3Definition
}

export interface ITag3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: IExternalDocumentation3
}

