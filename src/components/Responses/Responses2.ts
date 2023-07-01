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
import { ISDSchemaDefinition, ISDObject, ISDComponent } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Response2, IResponse2 } from '../Response'
import { Responses as ResponsesBase } from './Responses'
import { IResponses2, IResponses2Definition, IResponses2SchemaProcessor, IResponsesValidatorsMap2 as IValidatorsMap } from './IResponses'
// <!# Custom Content Begin: HEADER #!>
import { IResponse2Definition } from '../Response'
import { IReference2Definition, IReference2 } from '../Reference'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IResponses2Definition, IResponses2> | null = null

const additionalProperties: ISDObject<ISDComponent<IResponse2Definition, IResponse2>> = {
  type: 'object',
  additionalProperties: {
    type: 'component',
    allowsRef: true,
    component: Response2
  }
}

export class Responses extends ResponsesBase implements IResponses2 {
  public extensions: Record<string, any> = {}
  public default?: IResponse2
  [key: number]: Record<string, IResponse2>

  constructor (definition: IResponses2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'RESPONSES2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#responses-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IResponses2SchemaProcessor): ISDSchemaDefinition<IResponses2Definition, IResponses2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IResponses2Definition, IResponses2> = {
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

  static create (definition?: Partial<IResponses2Definition> | Responses | undefined): Responses {
    return new Responses(Object.assign({}, definition) as IResponses2Definition)
  }

  static async createAsync (definition?: Partial<IResponses2Definition> | Responses | string | undefined): Promise<Responses> {
    if (definition instanceof Responses) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IResponses2Definition>)
    }
  }

  static createDefinition<T extends Partial<IResponses2Definition>> (definition?: T | undefined): IResponses2Definition & T {
    return Object.assign({}, definition) as IResponses2Definition & T
  }

  static validate (definition: IResponses2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IResponses2Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
        component: Response2
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
