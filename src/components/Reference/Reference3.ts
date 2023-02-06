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

let cachedSchema: ISchema.ISchemaDefinition<I.IReference3Definition, I.IReference3> | null = null

interface IValidatorsMap {
  $ref: ISchema.IProperty<ISchema.IString>
}

export class Reference extends EnforcerComponent<I.IReference3Definition> implements I.IReference3 {
  constructor (definition: I.IReference3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'REFERENCE3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#reference-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#reference-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#reference-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#reference-object'
  }

  static getSchemaDefinition (_data: I.IReferenceSchemaProcessor): ISchema.ISchemaDefinition<I.IReference3Definition, I.IReference3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IReference3Definition, I.IReference3> = {
      type: 'object',
      allowsSchemaExtensions: false,
      properties: [
        validators.$ref
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IReference3Definition> | Reference | undefined): Reference {
    if (definition instanceof Reference) {
      return new Reference(Object.assign({}, definition))
    } else {
      return new Reference(Object.assign({
        $ref: ""
      }, definition) as I.IReference3Definition)
    }
  }

  static createDefinition (definition?: Partial<I.IReference3Definition> | undefined): I.IReference3Definition {
    return Object.assign({
      $ref: ""
    }, definition) as I.IReference3Definition
  }

  static validate (definition: I.IReference3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get $ref (): string {
    return this[GetProperty]('$ref')
  }

  set $ref (value: string) {
    this[SetProperty]('$ref', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    $ref: {
      name: '$ref',
      required: true,
      schema: {
        type: 'string'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
