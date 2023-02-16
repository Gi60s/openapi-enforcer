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
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.ICallback3Definition, I.ICallback3> | null = null

const additionalProperties: ISchema.IComponent<I.IPathItem3Definition, I.IPathItem3> = {
  type: 'component',
  allowsRef: false,
  component: I.PathItem3
}

export class Callback extends EnforcerComponent<I.ICallback3Definition> implements I.ICallback3 {
  [S.Extensions]: Record<string, any> = {};
  [key: `http${string}`]: I.IPathItem3
  [key: `{$${string}`]: I.IPathItem3

  constructor (definition: I.ICallback3Definition, version?: IVersion) {
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

  static id: string = 'CALLBACK3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#callback-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#callback-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#callback-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#callback-object'
  }

  static getSchemaDefinition (_data: I.ICallbackSchemaProcessor): ISchema.ISchemaDefinition<I.ICallback3Definition, I.ICallback3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.ICallback3Definition, I.ICallback3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>

    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.ICallback3Definition> | Callback | undefined): Callback {
    return new Callback(Object.assign({}, definition) as I.ICallback3Definition)
  }

  static createDefinition<T extends Partial<I.ICallback3Definition>> (definition?: T | undefined): I.ICallback3Definition & T {
    return Object.assign({}, definition) as I.ICallback3Definition & T
  }

  static validate (definition: I.ICallback3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
