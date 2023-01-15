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
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import { isUrl } from '../validations'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IServer3Definition, I.IServer3> | null = null

interface IValidatorsMap {
  url: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  variables: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IServerVariable3Definition, I.IServerVariable3>>>
}

const validators: IValidatorsMap = {
  url: {
    name: 'url',
    required: true,
    schema: {
      type: 'string'
    }
  },
  description: {
    name: 'description',
    schema: {
      type: 'string'
    }
  },
  variables: {
    name: 'variables',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: I.ServerVariable3
      }
    }
  }
}

export class Server extends EnforcerComponent<I.IServer3Definition> implements I.IServer3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IServer3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'SERVER3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#server-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#server-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#server-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-object'
  }

  static getSchemaDefinition (_data: I.IServerSchemaProcessor): ISchema.ISchemaDefinition<I.IServer3Definition, I.IServer3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IServer3Definition, I.IServer3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.url,
        validators.description,
        validators.variables
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.validate = function (data): void {
      isUrl('url', data)
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IServer3Definition> | Server | undefined): Server {
    if (definition instanceof Server) {
      return new Server(Object.assign({}, definition))
    } else {
      return new Server(Object.assign({
        url: ""
      }, definition) as I.IServer3Definition)
    }
  }

  static validate (definition: I.IServer3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get url (): string {
    return this[GetProperty]('url')
  }

  set url (value: string) {
    this[SetProperty]('url', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get variables (): Record<string, I.IServerVariable3> | undefined {
    return this[GetProperty]('variables')
  }

  set variables (value: Record<string, I.IServerVariable3> | undefined) {
    this[SetProperty]('variables', value)
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
