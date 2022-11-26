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

import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IPathsSchemaProcessor } from '../IInternalTypes'
import {
  IPathItem3,
  IPathItem3Definition,
  IPaths3,
  IPaths3Definition,
  PathItem3
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { after, findPathMatches } from './common'
import * as config from '../../global-config'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IPaths3Definition, IPaths3> | null = null

export class Paths extends EnforcerComponent<IPaths3Definition, IPaths3> implements IPaths3 {
  [extension: `x${string}`]: any
  [key: `/${string}`]: IPathItem3

  constructor (definition: IPaths3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#paths-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#paths-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#paths-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#paths-object'
  }

  static getSchemaDefinition (_data: IPathsSchemaProcessor): ISchema.ISchemaDefinition<IPaths3Definition, IPaths3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const additionalProperties: ISchema.IComponent<IPathItem3Definition, IPathItem3> = {
      type: 'component',
      allowsRef: false,
      component: PathItem3
    }

    const result: ISchema.ISchemaDefinition<IPaths3Definition, IPaths3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.after = after
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IPaths3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  findMatches (path: string, options?: IFindPathMatchesOptions): IFindPathMatchesResult {
    return findPathMatches(this, path,
      config.normalize<IFindPathMatchesOptions>('components.paths.findPathMatches', options) as Required<IFindPathMatchesOptions>)
  }
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
