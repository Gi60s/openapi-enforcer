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
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IResponses3Definition, I.IResponses3> | null = null

interface IValidatorsMap {
  _default: ISchema.IProperty<ISchema.IComponent<I.IResponse3Definition, I.IResponse3>>
}

const additionalProperties: ISchema.IComponent<I.IResponse3Definition, I.IResponse3> = {
  type: 'component',
  allowsRef: true,
  component: I.Response3
}

export class Responses extends EnforcerComponent<I.IResponses3Definition> implements I.IResponses3 {
  [S.Extensions]: Record<string, any> = {};
  [key: number]: I.IResponse3
  public default?: I.IResponse3

  constructor (definition: I.IResponses3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'RESPONSES3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#responses-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#responses-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#responses-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#responses-object'
  }

  static getSchemaDefinition (_data: I.IResponsesSchemaProcessor): ISchema.ISchemaDefinition<I.IResponses3Definition, I.IResponses3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IResponses3Definition, I.IResponses3> = {
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

  static create (definition?: Partial<I.IResponses3Definition> | Responses | undefined): Responses {
    return new Responses(Object.assign({}, definition) as I.IResponses3Definition)
  }

  static async createAsync (definition?: Partial<I.IResponses3Definition> | Responses | string | undefined): Promise<Responses> {
    if (definition instanceof Responses) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IResponses3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IResponses3Definition>> (definition?: T | undefined): I.IResponses3Definition & T {
    return Object.assign({}, definition) as I.IResponses3Definition & T
  }

  static validate (definition: I.IResponses3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IResponses3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    _default: {
      name: 'default',
      schema: {
        type: 'component',
        allowsRef: true,
        component: I.Response3
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
