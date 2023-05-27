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
import { ISDProperty, ISDComponent, ISDAny, ISDObject } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ISchema3, ISchema3Definition, ISchema3a, ISchema3aDefinition } from '../Schema'
import { IReference3, IReference3Definition, IReference3a, IReference3aDefinition } from '../Reference'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export type IMediaType = IMediaType3 | IMediaType3a
export type IMediaTypeDefinition = IMediaType3Definition | IMediaType3aDefinition
export type IMediaType3SchemaProcessor = SchemaProcessor<IMediaType3Definition, IMediaType3>
export type IMediaType3aSchemaProcessor = SchemaProcessor<IMediaType3aDefinition, IMediaType3a>
export type IMediaTypeSchemaProcessor = IMediaType3SchemaProcessor | IMediaType3aSchemaProcessor

export interface IMediaTypeBase extends IComponentInstance {
  // <!# Custom Content Begin: COMPONENT_SHARED_PROPERTIES #!>
// Put your code here.
// <!# Custom Content End: COMPONENT_SHARED_PROPERTIES #!>
}

export interface IMediaType3Definition {
  [extensions: `x-${string}`]: any
  schema?: ISchema3Definition | IReference3Definition
  example?: any
  examples?: Record<string, IExample3Definition | IReference3Definition>
  encoding?: Record<string, IEncoding3Definition>
}

export interface IMediaType3 extends IMediaTypeBase {
  extensions: Record<string, any>
  schema?: ISchema3 | IReference3
  example?: any
  examples?: Record<string, IExample3 | IReference3>
  encoding?: Record<string, IEncoding3>
}

export interface IMediaTypeValidatorsMap3 {
  schema: ISDProperty<ISDComponent<ISchema3Definition, ISchema3> | ISDComponent<IReference3Definition, IReference3>>
  example: ISDProperty<ISDAny>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3Definition, IExample3> | ISDComponent<IReference3Definition, IReference3>>>
  encoding: ISDProperty<ISDObject<ISDComponent<IEncoding3Definition, IEncoding3>>>
}

export interface IMediaType3aDefinition {
  [extensions: `x-${string}`]: any
  schema?: ISchema3aDefinition | IReference3aDefinition
  example?: any
  examples?: Record<string, IExample3aDefinition | IReference3aDefinition>
  encoding?: Record<string, IEncoding3aDefinition>
}

export interface IMediaType3a extends IMediaTypeBase {
  extensions: Record<string, any>
  schema?: ISchema3a | IReference3a
  example?: any
  examples?: Record<string, IExample3a | IReference3a>
  encoding?: Record<string, IEncoding3a>
}

export interface IMediaTypeValidatorsMap3a {
  schema: ISDProperty<ISDComponent<ISchema3aDefinition, ISchema3a> | ISDComponent<IReference3aDefinition, IReference3a>>
  example: ISDProperty<ISDAny>
  examples: ISDProperty<ISDObject<ISDComponent<IExample3aDefinition, IExample3a> | ISDComponent<IReference3aDefinition, IReference3a>>>
  encoding: ISDProperty<ISDObject<ISDComponent<IEncoding3aDefinition, IEncoding3a>>>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
