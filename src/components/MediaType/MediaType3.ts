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
import { IMediaTypeSchemaProcessor } from '../IInternalTypes'
import {
  Encoding3,
  Example3,
  IEncoding3,
  IEncoding3Definition,
  IExample3,
  IExample3Definition,
  IMediaType3,
  IMediaType3Definition,
  ISchema3,
  ISchema3Definition,
  Schema3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IMediaType3Definition, IMediaType3> | null = null

export class MediaType extends EnforcerComponent<IMediaType3Definition, IMediaType3> implements IMediaType3 {
  [extension: `x${string}`]: any

  constructor (definition: IMediaType3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#media-type-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#media-type-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#media-type-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#media-type-object'
  }

  static getSchemaDefinition (_data: IMediaTypeSchemaProcessor): ISchema.ISchemaDefinition<IMediaType3Definition, IMediaType3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const schema: ISchema.IProperty<ISchema.IComponent<ISchema3Definition, ISchema3>> = {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3
      }
    }

    const example: ISchema.IProperty<any> = {
      name: 'example',
      schema: {
        type: 'any'
      }
    }

    const examples: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IExample3Definition, IExample3>>> = {
      name: 'examples',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Example3
        }
      }
    }

    const encoding: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IEncoding3Definition, IEncoding3>>> = {
      name: 'encoding',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: Encoding3
        }
      }
    }

    const result: ISchema.ISchemaDefinition<IMediaType3Definition, IMediaType3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        schema,
        example,
        examples,
        encoding
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IMediaType3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get schema (): ISchema3 | undefined {
    return this.getProperty('schema')
  }

  set schema (value: ISchema3 | undefined) {
    this.setProperty('schema', value)
  }

  get example (): any | undefined {
    return this.getProperty('example')
  }

  set example (value: any | undefined) {
    this.setProperty('example', value)
  }

  get examples (): Record<string, IExample3> | undefined {
    return this.getProperty('examples')
  }

  set examples (value: Record<string, IExample3> | undefined) {
    this.setProperty('examples', value)
  }

  get encoding (): Record<string, IEncoding3> | undefined {
    return this.getProperty('encoding')
  }

  set encoding (value: Record<string, IEncoding3> | undefined) {
    this.setProperty('encoding', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
