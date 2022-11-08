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
  Example2,
  Header2,
  IExample2,
  IExample2Definition,
  IHeader2,
  IHeader2Definition,
  IResponse2,
  IResponse2Definition,
  ISchema2,
  ISchema2Definition,
  Schema2
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IResponse2Definition, IResponse2> | null = null

export class Response extends EnforcerComponent implements IResponse2 {
  [extension: `x-${string}`]: any
  description!: string
  schema?: ISchema2
  headers?: Record<string, IHeader2>
  examples?: IExample2

  constructor (definition: IResponse2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#response-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<IResponse2Definition, IResponse2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      required: true,
      schema: {
        type: 'string'
      }
    }

    const schema: ISchema.IProperty<ISchema.IComponent<ISchema2Definition, ISchema2>> = {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema2
      }
    }

    const headers: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IHeader2Definition, IHeader2>>> = {
      name: 'headers',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: Header2
        }
      }
    }

    const examples: ISchema.IProperty<ISchema.IComponent<IExample2Definition, IExample2>> = {
      name: 'examples',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Example2
      }
    }

    const schema: ISchema.IDefinition<IResponse2Definition, IResponse2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        description,
        schema,
        headers,
        examples
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: IResponse2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
