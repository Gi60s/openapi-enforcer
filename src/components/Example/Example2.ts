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
import { ISDSchemaDefinition, ISDAny } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Example as ExampleBase } from './Example'
import { IExample2, IExample2Definition, IExample2SchemaProcessor } from './IExample'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IExample2Definition, IExample2> | null = null

const additionalProperties: ISDAny = {
  type: 'any'
}

export class Example extends ExampleBase implements IExample2 {
  public properties!: {
    [contentType: string]: any
  }

  constructor (definition: IExample2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'example'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#example-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IExample2SchemaProcessor): ISDSchemaDefinition<IExample2Definition, IExample2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISDSchemaDefinition<IExample2Definition, IExample2> = {
      type: 'object',
      allowsSchemaExtensions: false,
      additionalProperties
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IExample2Definition> | Example | undefined): Example {
    return new Example(Object.assign({}, definition) as IExample2Definition)
  }

  static async createAsync (definition?: Partial<IExample2Definition> | Example | string | undefined): Promise<Example> {
    if (definition instanceof Example) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IExample2Definition>)
    }
  }

  static createDefinition<T extends Partial<IExample2Definition>> (definition?: T | undefined): IExample2Definition & T {
    return Object.assign({}, definition) as IExample2Definition & T
  }

  static validate (definition: IExample2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IExample2Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
