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
  IOperation2,
  IOperation2Definition,
  IOperation3,
  IOperation3Definition,
  IParameter2,
  IParameter2Definition,
  IParameter3,
  IParameter3Definition,
  IServer3,
  IServer3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IPathItemComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IPathItem2Definition {
  [extension: `x-${string}`]: any
  $ref?: string
  get?: IOperation2Definition
  put?: IOperation2Definition
  post?: IOperation2Definition
  delete?: IOperation2Definition
  options?: IOperation2Definition
  head?: IOperation2Definition
  patch?: IOperation2Definition
  parameters?: IParameter2Definition[]
}

export interface IPathItem2 extends IPathItemComponent {
  [extension: `x-${string}`]: any
  $ref?: string
  get?: IOperation2
  put?: IOperation2
  post?: IOperation2
  delete?: IOperation2
  options?: IOperation2
  head?: IOperation2
  patch?: IOperation2
  parameters?: IParameter2[]
}

export interface IPathItem3Definition {
  [extension: `x-${string}`]: any
  $ref?: string
  summary?: string
  description?: string
  get?: IOperation3Definition
  put?: IOperation3Definition
  post?: IOperation3Definition
  delete?: IOperation3Definition
  options?: IOperation3Definition
  head?: IOperation3Definition
  patch?: IOperation3Definition
  trace?: IOperation3Definition
  servers?: IServer3Definition[]
  parameters?: IParameter3Definition[]
}

export interface IPathItem3 extends IPathItemComponent {
  [extension: `x-${string}`]: any
  $ref?: string
  summary?: string
  description?: string
  get?: IOperation3
  put?: IOperation3
  post?: IOperation3
  delete?: IOperation3
  options?: IOperation3
  head?: IOperation3
  patch?: IOperation3
  trace?: IOperation3
  servers?: IServer3[]
  parameters?: IParameter3[]
}

// <!# Custom Content Begin: FOOTER #!>
export type IPathItemMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

export interface IFindPathMatchesOptions {
  trimTrailingSlashes?: boolean
  useCaseSensitivePaths?: boolean
}

export type IFindPathMatchesResult = Array<{
  params: Record<string, string>
  path: string
}>
// <!# Custom Content End: FOOTER #!>
