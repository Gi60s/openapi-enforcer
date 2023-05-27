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
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { ISDProperty, ISDString, ISDComponent, ISDArray } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IOperation2, IOperation2Definition, IOperation3, IOperation3Definition, IOperation3a, IOperation3aDefinition } from '../Operation'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IPathItem = IPathItem2 | IPathItem3 | IPathItem3a
export type IPathItemDefinition = IPathItem2Definition | IPathItem3Definition | IPathItem3aDefinition
export type IPathItem2SchemaProcessor = SchemaProcessor<IPathItem2Definition, IPathItem2>
export type IPathItem3SchemaProcessor = SchemaProcessor<IPathItem3Definition, IPathItem3>
export type IPathItem3aSchemaProcessor = SchemaProcessor<IPathItem3aDefinition, IPathItem3a>
export type IPathItemSchemaProcessor = IPathItem2SchemaProcessor | IPathItem3SchemaProcessor | IPathItem3aSchemaProcessor

export interface IPathItemBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
  // Put your code here.
  // <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IPathItem2Definition {
  [extensions: `x-${string}`]: any
  $ref?: string
  get?: IOperation2Definition
  put?: IOperation2Definition
  post?: IOperation2Definition
  delete?: IOperation2Definition
  options?: IOperation2Definition
  head?: IOperation2Definition
  patch?: IOperation2Definition
  parameters?: Array<IParameter2Definition | IReference2Definition>
}

export interface IPathItem2 extends IPathItemBase {
  extensions: Record<string, any>
  $ref?: string
  get?: IOperation2
  put?: IOperation2
  post?: IOperation2
  delete?: IOperation2
  options?: IOperation2
  head?: IOperation2
  patch?: IOperation2
  parameters?: Array<IParameter2 | IReference2>
}

export interface IPathItemValidatorsMap2 {
  $ref: ISDProperty<ISDString>
  get: ISDProperty<ISDComponent<IOperation2Definition, IOperation2>>
  put: ISDProperty<ISDComponent<IOperation2Definition, IOperation2>>
  post: ISDProperty<ISDComponent<IOperation2Definition, IOperation2>>
  _delete: ISDProperty<ISDComponent<IOperation2Definition, IOperation2>>
  options: ISDProperty<ISDComponent<IOperation2Definition, IOperation2>>
  head: ISDProperty<ISDComponent<IOperation2Definition, IOperation2>>
  patch: ISDProperty<ISDComponent<IOperation2Definition, IOperation2>>
  parameters: ISDProperty<ISDArray<ISDComponent<IParameter2Definition, IParameter2> | ISDComponent<IReference2Definition, IReference2>>>
}

export interface IPathItem3Definition {
  [extensions: `x-${string}`]: any
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
  parameters?: Array<IParameter3Definition | IReference3Definition>
}

export interface IPathItem3 extends IPathItemBase {
  extensions: Record<string, any>
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
  parameters?: Array<IParameter3 | IReference3>
}

export interface IPathItemValidatorsMap3 {
  $ref: ISDProperty<ISDString>
  summary: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  get: ISDProperty<ISDComponent<IOperation3Definition, IOperation3>>
  put: ISDProperty<ISDComponent<IOperation3Definition, IOperation3>>
  post: ISDProperty<ISDComponent<IOperation3Definition, IOperation3>>
  _delete: ISDProperty<ISDComponent<IOperation3Definition, IOperation3>>
  options: ISDProperty<ISDComponent<IOperation3Definition, IOperation3>>
  head: ISDProperty<ISDComponent<IOperation3Definition, IOperation3>>
  patch: ISDProperty<ISDComponent<IOperation3Definition, IOperation3>>
  trace: ISDProperty<ISDComponent<IOperation3Definition, IOperation3>>
  servers: ISDProperty<ISDArray<ISDComponent<IServer3Definition, IServer3>>>
  parameters: ISDProperty<ISDArray<ISDComponent<IParameter3Definition, IParameter3> | ISDComponent<IReference3Definition, IReference3>>>
}

export interface IPathItem3aDefinition {
  [extensions: `x-${string}`]: any
  $ref?: string
  summary?: string
  description?: string
  get?: IOperation3aDefinition
  put?: IOperation3aDefinition
  post?: IOperation3aDefinition
  delete?: IOperation3aDefinition
  options?: IOperation3aDefinition
  head?: IOperation3aDefinition
  patch?: IOperation3aDefinition
  trace?: IOperation3aDefinition
  servers?: IServer3aDefinition[]
  parameters?: Array<IParameter3aDefinition | IReference3aDefinition>
}

export interface IPathItem3a extends IPathItemBase {
  extensions: Record<string, any>
  $ref?: string
  summary?: string
  description?: string
  get?: IOperation3a
  put?: IOperation3a
  post?: IOperation3a
  delete?: IOperation3a
  options?: IOperation3a
  head?: IOperation3a
  patch?: IOperation3a
  trace?: IOperation3a
  servers?: IServer3a[]
  parameters?: Array<IParameter3a | IReference3a>
}

export interface IPathItemValidatorsMap3a {
  $ref: ISDProperty<ISDString>
  summary: ISDProperty<ISDString>
  description: ISDProperty<ISDString>
  get: ISDProperty<ISDComponent<IOperation3aDefinition, IOperation3a>>
  put: ISDProperty<ISDComponent<IOperation3aDefinition, IOperation3a>>
  post: ISDProperty<ISDComponent<IOperation3aDefinition, IOperation3a>>
  _delete: ISDProperty<ISDComponent<IOperation3aDefinition, IOperation3a>>
  options: ISDProperty<ISDComponent<IOperation3aDefinition, IOperation3a>>
  head: ISDProperty<ISDComponent<IOperation3aDefinition, IOperation3a>>
  patch: ISDProperty<ISDComponent<IOperation3aDefinition, IOperation3a>>
  trace: ISDProperty<ISDComponent<IOperation3aDefinition, IOperation3a>>
  servers: ISDProperty<ISDArray<ISDComponent<IServer3aDefinition, IServer3a>>>
  parameters: ISDProperty<ISDArray<ISDComponent<IParameter3aDefinition, IParameter3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
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
