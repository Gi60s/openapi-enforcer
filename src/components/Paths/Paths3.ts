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

/* eslint-disable import/no-duplicates */
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { PathItem3, IPathItem3 } from '../PathItem'
import { Paths as PathsBase } from './Paths'
import { IPaths3, IPaths3Definition, IPaths3SchemaProcessor } from './IPaths'
// <!# Custom Content Begin: HEADER #!>
import { IPathItem3Definition } from '../PathItem'
import { build, validate, findPathMatches } from './common'
import { IFindPathMatchesOptions, IFindPathMatchesResult } from '../PathItem'
import * as config from '../../global-config'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IPaths3Definition, IPaths3> | null = null

const additionalProperties: ISDComponent<IPathItem3Definition, IPathItem3> = {
  type: 'component',
  allowsRef: false,
  component: PathItem3
}

export class Paths extends PathsBase implements IPaths3 {
  public extensions: Record<string, any> = {}
  public properties!: {
    [path: `/${string}`]: IPathItem3
  }

  constructor (definition: IPaths3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'paths'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#paths-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#paths-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#paths-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#paths-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IPaths3SchemaProcessor): ISDSchemaDefinition<IPaths3Definition, IPaths3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISDSchemaDefinition<IPaths3Definition, IPaths3> = {
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

  static create (definition?: Partial<IPaths3Definition> | Paths | undefined): Paths {
    return new Paths(Object.assign({}, definition) as IPaths3Definition)
  }

  static async createAsync (definition?: Partial<IPaths3Definition> | Paths | string | undefined): Promise<Paths> {
    if (definition instanceof Paths) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IPaths3Definition>)
    }
  }

  static createDefinition<T extends Partial<IPaths3Definition>> (definition?: T | undefined): IPaths3Definition & T {
    return Object.assign({}, definition) as IPaths3Definition & T
  }

  static validate (definition: IPaths3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IPaths3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
