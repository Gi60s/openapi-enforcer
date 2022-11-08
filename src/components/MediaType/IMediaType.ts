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
  IEncoding3,
  IEncoding3Definition,
  IExample3,
  IExample3Definition,
  ISchema3,
  ISchema3Definition
} from '../'

export interface IMediaType3Definition {
  [extension: `x-${string}`]: any
  schema?: ISchema3Definition
  example?: any
  examples?: Record<string, IExample3Definition>
  encoding?: Record<string, IEncoding3Definition>
}
export interface IMediaType3 extends IComponentInstance {
  [extension: `x-${string}`]: any
  schema?: ISchema3
  example?: any
  examples?: Record<string, IExample3>
  encoding?: Record<string, IEncoding3>
}
