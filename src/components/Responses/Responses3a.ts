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
import { ISDSchemaDefinition, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Response3a, IResponse3a } from '../Response'
import { Responses as ResponsesBase } from './Responses'
import { IResponses3a, IResponses3aDefinition, IResponses3aSchemaProcessor, IResponsesValidatorsMap3a as IValidatorsMap } from './IResponses'
// <!# Custom Content Begin: HEADER #!>
import { IResponse3aDefinition } from '../Response'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IResponses3aDefinition, IResponses3a> | null = null

const additionalProperties: ISDComponent<IResponse3aDefinition, IResponse3a> = {
  type: 'component',
  allowsRef: false,
  component: Response3a
}

export class Responses extends ResponsesBase implements IResponses3a {
  public extensions: Record<string, any> = {}
  public default?: IResponse3a
  public properties!: {
    [code: number]: IResponse3a
  }

  constructor (definition: IResponses3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'responses'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#responses-object'
  }

  static getSchemaDefinition (_data: IResponses3aSchemaProcessor): ISDSchemaDefinition<IResponses3aDefinition, IResponses3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IResponses3aDefinition, IResponses3a> = {
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

  static create (definition?: Partial<IResponses3aDefinition> | Responses | undefined): Responses {
    return new Responses(Object.assign({}, definition) as IResponses3aDefinition)
  }

  static async createAsync (definition?: Partial<IResponses3aDefinition> | Responses | string | undefined): Promise<Responses> {
    if (definition instanceof Responses) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IResponses3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IResponses3aDefinition>> (definition?: T | undefined): IResponses3aDefinition & T {
    return Object.assign({}, definition) as IResponses3aDefinition & T
  }

  static validate (definition: IResponses3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IResponses3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
    _default: {
      name: 'default',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Response3a
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
