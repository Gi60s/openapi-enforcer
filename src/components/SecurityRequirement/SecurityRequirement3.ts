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
import * as ISchema from '../IComponentSchema'
import { ISecurityRequirementSchemaProcessor } from '../IInternalTypes'
import {
  ISecurityRequirement3,
  ISecurityRequirement3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<ISecurityRequirement3Definition, ISecurityRequirement3> | null = null

export class SecurityRequirement extends EnforcerComponent implements ISecurityRequirement3 {
  [key: string]: string[]
  constructor (definition: ISecurityRequirement3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-requirement-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-requirement-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-requirement-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-requirement-object'
  }

  static getSchema (_data: ISecurityRequirementSchemaProcessor): ISchema.IDefinition<ISecurityRequirement3Definition, ISecurityRequirement3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const additionalProperties: ISchema.IArray<ISchema.IString> = {
      type: 'array',
      items: {
        type: 'string'
      }
    }

    const result: ISchema.IDefinition<ISecurityRequirement3Definition, ISecurityRequirement3> = {
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

  static validate (definition: ISecurityRequirement3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
