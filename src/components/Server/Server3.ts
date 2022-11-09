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
import * as ISchema from '../IComponentSchema'
import { ISchemaProcessor } from '../ISchemaProcessor'
import {
  IServer3,
  IServer3Definition,
  IServerVariable3,
  IServerVariable3Definition,
  ServerVariable3
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { isUrl } from '../validations'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IServer3Definition, IServer3> | null = null

export class Server extends EnforcerComponent implements IServer3 {
  [extension: `x-${string}`]: any
  url!: string
  description?: string
  variables?: Record<string, IServerVariable3>

  constructor (definition: IServer3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#server-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#server-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#server-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#server-object'
  }

  static getSchema (_data: ISchemaProcessor): ISchema.IDefinition<IServer3Definition, IServer3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const url: ISchema.IProperty<ISchema.IString> = {
      name: 'url',
      required: true,
      schema: {
        type: 'string'
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const variables: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IServerVariable3Definition, IServerVariable3>>> = {
      name: 'variables',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: ServerVariable3
        }
      }
    }

    const result: ISchema.IDefinition<IServer3Definition, IServer3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        url,
        description,
        variables
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    schema.after = function (data: ISchemaProcessor<any, any>, mode: 'build' | 'validate'): void {
      if (mode === 'validate') {
        isUrl('url', data)
      }
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IServer3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
