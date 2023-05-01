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
import * as Icsd from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as I from '../IInternalTypes'
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IPathItemComponent extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IPathItem2Definition {
  [Extensions: `x-${string}`]: any
  $ref?: string
  get?: I.IOperation2Definition
  put?: I.IOperation2Definition
  post?: I.IOperation2Definition
  delete?: I.IOperation2Definition
  options?: I.IOperation2Definition
  head?: I.IOperation2Definition
  patch?: I.IOperation2Definition
  parameters?: Array<I.IParameter2Definition | I.IReference2Definition>
}

export interface IPathItem2 extends IPathItemComponent {
  [Extensions]: Record<string, any>
  $ref?: string
  get?: I.IOperation2
  put?: I.IOperation2
  post?: I.IOperation2
  delete?: I.IOperation2
  options?: I.IOperation2
  head?: I.IOperation2
  patch?: I.IOperation2
  parameters?: I.IParameter2[]
}

export interface IPathItemValidatorsMap2 {
  $ref: Icsd.IProperty<Icsd.IString>
  get: Icsd.IProperty<Icsd.IComponent<I.IOperation2Definition, I.IOperation2>>
  put: Icsd.IProperty<Icsd.IComponent<I.IOperation2Definition, I.IOperation2>>
  post: Icsd.IProperty<Icsd.IComponent<I.IOperation2Definition, I.IOperation2>>
  _delete: Icsd.IProperty<Icsd.IComponent<I.IOperation2Definition, I.IOperation2>>
  options: Icsd.IProperty<Icsd.IComponent<I.IOperation2Definition, I.IOperation2>>
  head: Icsd.IProperty<Icsd.IComponent<I.IOperation2Definition, I.IOperation2>>
  patch: Icsd.IProperty<Icsd.IComponent<I.IOperation2Definition, I.IOperation2>>
  parameters: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.IParameter2Definition, I.IParameter2>>>
}

export interface IPathItem3Definition {
  [Extensions: `x-${string}`]: any
  $ref?: string
  summary?: string
  description?: string
  get?: I.IOperation3Definition
  put?: I.IOperation3Definition
  post?: I.IOperation3Definition
  delete?: I.IOperation3Definition
  options?: I.IOperation3Definition
  head?: I.IOperation3Definition
  patch?: I.IOperation3Definition
  trace?: I.IOperation3Definition
  servers?: I.IServer3Definition[]
  parameters?: Array<I.IParameter3Definition | I.IReference3Definition>
}

export interface IPathItem3 extends IPathItemComponent {
  [Extensions]: Record<string, any>
  $ref?: string
  summary?: string
  description?: string
  get?: I.IOperation3
  put?: I.IOperation3
  post?: I.IOperation3
  delete?: I.IOperation3
  options?: I.IOperation3
  head?: I.IOperation3
  patch?: I.IOperation3
  trace?: I.IOperation3
  servers?: I.IServer3[]
  parameters?: I.IParameter3[]
}

export interface IPathItemValidatorsMap3 {
  $ref: Icsd.IProperty<Icsd.IString>
  summary: Icsd.IProperty<Icsd.IString>
  description: Icsd.IProperty<Icsd.IString>
  get: Icsd.IProperty<Icsd.IComponent<I.IOperation3Definition, I.IOperation3>>
  put: Icsd.IProperty<Icsd.IComponent<I.IOperation3Definition, I.IOperation3>>
  post: Icsd.IProperty<Icsd.IComponent<I.IOperation3Definition, I.IOperation3>>
  _delete: Icsd.IProperty<Icsd.IComponent<I.IOperation3Definition, I.IOperation3>>
  options: Icsd.IProperty<Icsd.IComponent<I.IOperation3Definition, I.IOperation3>>
  head: Icsd.IProperty<Icsd.IComponent<I.IOperation3Definition, I.IOperation3>>
  patch: Icsd.IProperty<Icsd.IComponent<I.IOperation3Definition, I.IOperation3>>
  trace: Icsd.IProperty<Icsd.IComponent<I.IOperation3Definition, I.IOperation3>>
  servers: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.IServer3Definition, I.IServer3>>>
  parameters: Icsd.IProperty<Icsd.IArray<Icsd.IComponent<I.IParameter3Definition, I.IParameter3>>>
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
