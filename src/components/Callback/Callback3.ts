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
import { ISDSchemaDefinition, ISDObject, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { PathItem3, IPathItem3, IPathItem3Definition } from '../PathItem'
import { Callback as CallbackBase } from './Callback'
import { ICallback3, ICallback3Definition, ICallback3SchemaProcessor } from './ICallback'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ICallback3Definition, ICallback3> | null = null

const additionalProperties: ISDObject<ISDComponent<IPathItem3Definition, IPathItem3>> = {
  type: 'object',
  additionalProperties: {
    type: 'component',
    allowsRef: false,
    component: PathItem3
  }
}

export class Callback extends CallbackBase implements ICallback3 {
  public extensions: Record<string, any> = {};
  [path: `http${string}`]: IPathItem3
  [path: `{$${string}`]: IPathItem3

  constructor (definition: ICallback3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'CALLBACK3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#callback-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#callback-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#callback-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#callback-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: ICallback3SchemaProcessor): ISDSchemaDefinition<ICallback3Definition, ICallback3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISDSchemaDefinition<ICallback3Definition, ICallback3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>

    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<ICallback3Definition> | Callback | undefined): Callback {
    return new Callback(Object.assign({}, definition) as ICallback3Definition)
  }

  static async createAsync (definition?: Partial<ICallback3Definition> | Callback | string | undefined): Promise<Callback> {
    if (definition instanceof Callback) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ICallback3Definition>)
    }
  }

  static createDefinition<T extends Partial<ICallback3Definition>> (definition?: T | undefined): ICallback3Definition & T {
    return Object.assign({}, definition) as ICallback3Definition & T
  }

  static validate (definition: ICallback3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ICallback3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
