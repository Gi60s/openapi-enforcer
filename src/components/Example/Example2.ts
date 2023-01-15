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
import { EnforcerComponent, SetProperty, GetProperty } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IExample2Definition, I.IExample2> | null = null

const additionalProperties: any = {
  type: 'any'
}

export class Example extends EnforcerComponent<I.IExample2Definition> implements I.IExample2 {
  [key: string]: any

  constructor (definition: I.IExample2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    Object.keys(definition).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get () {
          return this[GetProperty](key)
        },
        set (value) {
          this[SetProperty](key, value)
        }
      })
    })
  }

  static id: string = 'EXAMPLE2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#example-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IExampleSchemaProcessor): ISchema.ISchemaDefinition<I.IExample2Definition, I.IExample2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IExample2Definition, I.IExample2> = {
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

  static create (definition?: Partial<I.IExample2Definition> | Example | undefined): Example {
    return new Example(Object.assign({}, definition) as I.IExample2Definition)
  }

  static validate (definition: I.IExample2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
