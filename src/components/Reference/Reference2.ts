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
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IReference2Definition, I.IReference2> | null = null

interface IValidatorsMap {
  $ref: ISchema.IProperty<ISchema.IString>
}

export class Reference extends EnforcerComponent<I.IReference2Definition> implements I.IReference2 {
  constructor (definition: I.IReference2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'REFERENCE2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#reference-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IReferenceSchemaProcessor): ISchema.ISchemaDefinition<I.IReference2Definition, I.IReference2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IReference2Definition, I.IReference2> = {
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

  static create (definition?: Partial<I.IReference2Definition> | Reference | undefined): Reference {
    if (definition instanceof Reference) {
      return new Reference(Object.assign({}, definition as unknown) as I.IReference2Definition)
    } else {
      return new Reference(Object.assign({
        $ref: ''
      }, definition) as I.IReference2Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IReference2Definition> | Reference | string | undefined): Promise<Reference> {
    if (definition instanceof Reference) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IReference2Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IReference2Definition>> (definition?: T | undefined): I.IReference2Definition & T {
    return Object.assign({
      $ref: ''
    }, definition) as I.IReference2Definition & T
  }

  static validate (definition: I.IReference2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IReference2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
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
