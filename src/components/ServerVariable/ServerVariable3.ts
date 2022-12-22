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
import { Extensions } from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IServerVariable3Definition, I.IServerVariable3> | null = null

interface IValidatorsMap {
  _enum: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  _default: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
}

const validators: IValidatorsMap = {
  _enum: {
    name: 'enum',
    schema: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  _default: {
    name: 'default',
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
  }
}

export class ServerVariable extends EnforcerComponent<I.IServerVariable3Definition> implements I.IServerVariable3 {
  [Extensions]: Record<string, any> = {}

  constructor (definition: I.IServerVariable3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'SERVER_VARIABLE3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#server-variable-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#server-variable-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#server-variable-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-variable-object'
  }

  static getSchemaDefinition (_data: I.IServerVariableSchemaProcessor): ISchema.ISchemaDefinition<I.IServerVariable3Definition, I.IServerVariable3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IServerVariable3Definition, I.IServerVariable3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators._enum,
        validators._default,
        validators.description
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.IServerVariable3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get enum (): string[] | undefined {
    return this[GetProperty]('enum')
  }

  set enum (value: string[] | undefined) {
    this[SetProperty]('enum', value)
  }

  get default (): string {
    return this[GetProperty]('default')
  }

  set default (value: string) {
    this[SetProperty]('default', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
