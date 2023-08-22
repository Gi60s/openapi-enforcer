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
import { Reference as ReferenceBase } from './Reference'
import { IReference3, IReference3Definition, IReference3SchemaProcessor, IReferenceValidatorsMap3 as IValidatorsMap } from './IReference'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IReference3Definition, IReference3> | null = null

export class Reference extends ReferenceBase implements IReference3 {
  public $ref!: string

  constructor (definition: IReference3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'reference'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#reference-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#reference-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#reference-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#reference-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IReference3SchemaProcessor): ISDSchemaDefinition<IReference3Definition, IReference3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IReference3Definition, IReference3> = {
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

  static create (definition?: Partial<IReference3Definition> | Reference | undefined): Reference {
    if (definition instanceof Reference) {
      return new Reference(Object.assign({}, definition as unknown) as IReference3Definition)
    } else {
      return new Reference(Object.assign({
        $ref: ''
      }, definition) as IReference3Definition)
    }
  }

  static async createAsync (definition?: Partial<IReference3Definition> | Reference | string | undefined): Promise<Reference> {
    if (definition instanceof Reference) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IReference3Definition>)
    }
  }

  static createDefinition<T extends Partial<IReference3Definition>> (definition?: T | undefined): IReference3Definition & T {
    return Object.assign({
      $ref: ''
    }, definition) as IReference3Definition & T
  }

  static validate (definition: IReference3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IReference3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
