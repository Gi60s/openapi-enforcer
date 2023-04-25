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
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import { build, validate, findPathMatches } from './common'
import { IFindPathMatchesOptions, IFindPathMatchesResult } from '../PathItem'
import * as config from '../../global-config'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IPaths2Definition, I.IPaths2> | null = null

const additionalProperties: ISchema.IComponent<I.IPathItem2Definition, I.IPathItem2> = {
  type: 'component',
  allowsRef: false,
  component: I.PathItem2
}

export class Paths extends EnforcerComponent<I.IPaths2Definition> implements I.IPaths2 {
  [S.Extensions]: Record<string, any> = {};
  [key: `/${string}`]: I.IPathItem2

  constructor (definition: I.IPaths2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    Object.keys(definition).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get () {
          return this.getProperty(key)
        },
        set (value) {
          this.setProperty(key, value)
        }
      })
    })
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
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IPathsSchemaProcessor): ISchema.ISchemaDefinition<I.IPaths2Definition, I.IPaths2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IPaths2Definition, I.IPaths2> = {
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

  static create (definition?: Partial<I.IPaths2Definition> | Paths | undefined): Paths {
    return new Paths(Object.assign({}, definition) as I.IPaths2Definition)
  }

  static async createAsync (definition?: Partial<I.IPaths2Definition> | Paths | string | undefined): Promise<Paths> {
    if (definition instanceof Paths) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IPaths2Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IPaths2Definition>> (definition?: T | undefined): I.IPaths2Definition & T {
    return Object.assign({}, definition) as I.IPaths2Definition & T
  }

  static validate (definition: I.IPaths2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IPaths2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
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

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
