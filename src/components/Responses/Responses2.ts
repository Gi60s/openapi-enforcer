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
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IResponses2Definition, I.IResponses2> | null = null

interface IValidatorsMap {
  _default: ISchema.IProperty<ISchema.IComponent<I.IResponse2Definition, I.IResponse2>>
}

const validators: IValidatorsMap = {
  _default: {
    name: 'default',
    schema: {
      type: 'component',
      allowsRef: true,
      component: I.Response2
    }
  }
}

const additionalProperties: ISchema.IComponent<I.IResponse2Definition, I.IResponse2> = {
  type: 'component',
  allowsRef: true,
  component: I.Response2
}

export class Responses extends EnforcerComponent<I.IResponses2Definition> implements I.IResponses2 {
  [extension: `x${string}`]: any
  [key: number]: I.IResponse2

  constructor (definition: I.IResponses2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'RESPONSES2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#responses-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IResponsesSchemaProcessor): ISchema.ISchemaDefinition<I.IResponses2Definition, I.IResponses2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IResponses2Definition, I.IResponses2> = {
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

  static validate (definition: I.IResponses2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get default (): I.IResponse2 | undefined {
    return this.getProperty('default')
  }

  set default (value: I.IResponse2 | undefined) {
    this.setProperty('default', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
