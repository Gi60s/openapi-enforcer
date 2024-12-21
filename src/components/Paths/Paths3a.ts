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
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Paths as PathsBase } from './Paths'
import { IPaths3a, IPaths3aDefinition, IPaths3aSchemaProcessor } from './IPaths'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IPaths3aDefinition, IPaths3a> | null = null

export class Paths extends PathsBase implements IPaths3a {
  public extensions: Record<string, any> = {}

  constructor (definition: IPaths3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'paths'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#paths-object'
  }

  static getSchemaDefinition (_data: IPaths3aSchemaProcessor): ISDSchemaDefinition<IPaths3aDefinition, IPaths3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISDSchemaDefinition<IPaths3aDefinition, IPaths3a> = {
      type: 'object',
      allowsSchemaExtensions: true
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IPaths3aDefinition> | Paths | undefined): Paths {
    return new Paths(Object.assign({}, definition) as IPaths3aDefinition)
  }

  static async createAsync (definition?: Partial<IPaths3aDefinition> | Paths | string | undefined): Promise<Paths> {
    if (definition instanceof Paths) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IPaths3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IPaths3aDefinition>> (definition?: T | undefined): IPaths3aDefinition & T {
    return Object.assign({}, definition) as IPaths3aDefinition & T
  }

  static validate (definition: IPaths3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IPaths3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
