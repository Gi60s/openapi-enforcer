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
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition, ISD[path: `/${string}`]: PathItem } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Paths as PathsBase } from './Paths'
import { IPaths2, IPaths2Definition, IPaths2SchemaProcessor } from './IPaths'
// <!# Custom Content Begin: HEADER #!>
import { build, validate, findPathMatches } from './common'
import { IFindPathMatchesOptions, IFindPathMatchesResult } from '../PathItem'
import * as config from '../../global-config'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IPaths2Definition, IPaths2> | null = null

const additionalProperties: ISD[path: `/${string}`]: PathItem = {
  type: '[path: `/${string}`]: PathItem'
}

export class Paths extends PathsBase implements IPaths2 {
  public extensions: Record<string, any> = {};
  [path: `/${string}`]: PathItem

  constructor (definition: IPaths2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'PATHS2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#paths-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IPaths2SchemaProcessor): ISDSchemaDefinition<IPaths2Definition, IPaths2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISDSchemaDefinition<IPaths2Definition, IPaths2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.build = build
    result.validate = validate
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IPaths2Definition> | Paths | undefined): Paths {
    return new Paths(Object.assign({}, definition) as IPaths2Definition)
  }

  static async createAsync (definition?: Partial<IPaths2Definition> | Paths | string | undefined): Promise<Paths> {
    if (definition instanceof Paths) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IPaths2Definition>)
    }
  }

  static createDefinition<T extends Partial<IPaths2Definition>> (definition?: T | undefined): IPaths2Definition & T {
    return Object.assign({}, definition) as IPaths2Definition & T
  }

  static validate (definition: IPaths2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IPaths2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  findMatches (path: string, options?: IFindPathMatchesOptions): IFindPathMatchesResult {

    return findPathMatches(this, path,
      config.normalize<IFindPathMatchesOptions>('components.paths.findPathMatches', options) as Required<IFindPathMatchesOptions>)
  }
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
