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
import { IReference3a, IReference3aDefinition, IReference3aSchemaProcessor, IReferenceValidatorsMap3a as IValidatorsMap } from './IReference'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IReference3aDefinition, IReference3a> | null = null

export class Reference extends ReferenceBase implements IReference3a {
  public extensions: Record<string, any> = {}
  public $ref!: string

  constructor (definition: IReference3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'REFERENCE3A'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#reference-object'
  }

  static getSchemaDefinition (_data: IReference3aSchemaProcessor): ISDSchemaDefinition<IReference3aDefinition, IReference3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IReference3aDefinition, IReference3a> = {
      type: 'object',
      allowsSchemaExtensions: true,
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

  static create (definition?: Partial<IReference3aDefinition> | Reference | undefined): Reference {
    if (definition instanceof Reference) {
      return new Reference(Object.assign({}, definition as unknown) as IReference3aDefinition)
    } else {
      return new Reference(Object.assign({
        $ref: ''
      }, definition) as IReference3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<IReference3aDefinition> | Reference | string | undefined): Promise<Reference> {
    if (definition instanceof Reference) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IReference3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IReference3aDefinition>> (definition?: T | undefined): IReference3aDefinition & T {
    return Object.assign({
      $ref: ''
    }, definition) as IReference3aDefinition & T
  }

  static validate (definition: IReference3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IReference3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
