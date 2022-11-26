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
import { IReferenceSchemaProcessor } from '../IInternalTypes'
import {
  IReference3,
  IReference3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IReference3Definition, IReference3> | null = null

export class Reference extends EnforcerComponent<IReference3Definition, IReference3> implements IReference3 {

  constructor (definition: IReference3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#reference-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#reference-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#reference-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#reference-object'
  }

  static getSchemaDefinition (_data: IReferenceSchemaProcessor): ISchema.ISchemaDefinition<IReference3Definition, IReference3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const $ref: ISchema.IProperty<ISchema.IString> = {
      name: '$ref',
      required: true,
      schema: {
        type: 'string'
      }
    }

    const result: ISchema.ISchemaDefinition<IReference3Definition, IReference3> = {
      type: 'object',
      allowsSchemaExtensions: false,
      properties: [
        $ref
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IReference3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get $ref (): string {
    return this.getProperty('$ref')
  }

  set $ref (value: string) {
    this.setProperty('$ref', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
