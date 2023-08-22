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
import { Example as ExampleBase } from './Example'
import { IExample3, IExample3Definition, IExample3SchemaProcessor, IExampleValidatorsMap3 as IValidatorsMap } from './IExample'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IExample3Definition, IExample3> | null = null

export class Example extends ExampleBase implements IExample3 {
  public extensions: Record<string, any> = {}
  public summary?: string
  public description?: string
  public value?: any
  public externalValue?: string

  constructor (definition: IExample3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'example'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#example-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#example-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#example-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#example-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IExample3SchemaProcessor): ISDSchemaDefinition<IExample3Definition, IExample3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IExample3Definition, IExample3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.summary,
        validators.description,
        validators.value,
        validators.externalValue
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IExample3Definition> | Example | undefined): Example {
    return new Example(Object.assign({}, definition) as IExample3Definition)
  }

  static async createAsync (definition?: Partial<IExample3Definition> | Example | string | undefined): Promise<Example> {
    if (definition instanceof Example) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IExample3Definition>)
    }
  }

  static createDefinition<T extends Partial<IExample3Definition>> (definition?: T | undefined): IExample3Definition & T {
    return Object.assign({}, definition) as IExample3Definition & T
  }

  static validate (definition: IExample3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IExample3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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

function getValidatorsMap (): IValidatorsMap {
  return {
    summary: {
      name: 'summary',
      schema: {
        type: 'string'
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    value: {
      name: 'value',
      schema: {
        type: 'any'
      }
    },
    externalValue: {
      name: 'externalValue',
      schema: {
        type: 'string'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
