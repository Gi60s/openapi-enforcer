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
import { Callback as CallbackBase } from './Callback'
import { ICallback3a, ICallback3aDefinition, ICallback3aSchemaProcessor } from './ICallback'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ICallback3aDefinition, ICallback3a> | null = null

export class Callback extends CallbackBase implements ICallback3a {
  public extensions: Record<string, any> = {}

  constructor (definition: ICallback3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'CALLBACK3A'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#callback-object'
  }

  static getSchemaDefinition (_data: ICallback3aSchemaProcessor): ISDSchemaDefinition<ICallback3aDefinition, ICallback3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISDSchemaDefinition<ICallback3aDefinition, ICallback3a> = {
      type: 'object',
      allowsSchemaExtensions: true
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<ICallback3aDefinition> | Callback | undefined): Callback {
    return new Callback(Object.assign({}, definition) as ICallback3aDefinition)
  }

  static async createAsync (definition?: Partial<ICallback3aDefinition> | Callback | string | undefined): Promise<Callback> {
    if (definition instanceof Callback) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ICallback3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<ICallback3aDefinition>> (definition?: T | undefined): ICallback3aDefinition & T {
    return Object.assign({}, definition) as ICallback3aDefinition & T
  }

  static validate (definition: ICallback3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ICallback3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
