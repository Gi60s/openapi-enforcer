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
import { Response3, IResponse3 } from '../Response'
import { Responses as ResponsesBase } from './Responses'
import { IResponses3, IResponses3Definition, IResponses3SchemaProcessor, IResponsesValidatorsMap3 as IValidatorsMap } from './IResponses'
// <!# Custom Content Begin: HEADER #!>
import { IResponse3Definition } from '../Response'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IResponses3Definition, IResponses3> | null = null

const additionalProperties: ISDComponent<IResponse3Definition, IResponse3> = {
  type: 'component',
  allowsRef: false,
  component: Response3
}

export class Responses extends ResponsesBase implements IResponses3 {
  public extensions: Record<string, any> = {}
  public default?: IResponse3
  public properties!: {
    [code: number]: IResponse3
  }

  constructor (definition: IResponses3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'responses'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#responses-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#responses-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#responses-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#responses-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IResponses3SchemaProcessor): ISDSchemaDefinition<IResponses3Definition, IResponses3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IResponses3Definition, IResponses3> = {
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

  static create (definition?: Partial<IResponses3Definition> | Responses | undefined): Responses {
    return new Responses(Object.assign({}, definition) as IResponses3Definition)
  }

  static async createAsync (definition?: Partial<IResponses3Definition> | Responses | string | undefined): Promise<Responses> {
    if (definition instanceof Responses) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IResponses3Definition>)
    }
  }

  static createDefinition<T extends Partial<IResponses3Definition>> (definition?: T | undefined): IResponses3Definition & T {
    return Object.assign({}, definition) as IResponses3Definition & T
  }

  static validate (definition: IResponses3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IResponses3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
        component: Response3
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
