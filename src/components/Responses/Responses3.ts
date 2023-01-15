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

let cachedSchema: ISchema.ISchemaDefinition<I.IResponses3Definition, I.IResponses3> | null = null

interface IValidatorsMap {
  _default: ISchema.IProperty<ISchema.IComponent<I.IResponse3Definition, I.IResponse3>>
}

const validators: IValidatorsMap = {
  _default: {
    name: 'default',
    schema: {
      type: 'component',
      allowsRef: true,
      component: I.Response3
    }
  }
}

const additionalProperties: ISchema.IComponent<I.IResponse3Definition, I.IResponse3> = {
  type: 'component',
  allowsRef: true,
  component: I.Response3
}

export class Responses extends EnforcerComponent<I.IResponses3Definition> implements I.IResponses3 {
  [S.Extensions]: Record<string, any> = {};
  [key: number]: I.IResponse3

  constructor (definition: I.IResponses3Definition, version?: IVersion) {
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

  static id: string = 'RESPONSES3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#responses-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#responses-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#responses-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#responses-object'
  }

  static getSchemaDefinition (_data: I.IResponsesSchemaProcessor): ISchema.ISchemaDefinition<I.IResponses3Definition, I.IResponses3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IResponses3Definition, I.IResponses3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties,
      properties: [
        validators._default
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.IResponses3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get default (): I.IResponse3 | undefined {
    return this[GetProperty]('default')
  }

  set default (value: I.IResponse3 | undefined) {
    this[SetProperty]('default', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>