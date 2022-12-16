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
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IMediaType3Definition, I.IMediaType3> | null = null

interface IValidatorsMap {
  schema: ISchema.IProperty<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>
  example: ISchema.IProperty<any>
  examples: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IExample3Definition, I.IExample3>>>
  encoding: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IEncoding3Definition, I.IEncoding3>>>
}

const validators: IValidatorsMap = {
  schema: {
    name: 'schema',
    schema: {
      type: 'component',
      allowsRef: true,
      component: I.Schema3
    }
  },
  example: {
    name: 'example',
    schema: {
      type: 'any'
    }
  },
  examples: {
    name: 'examples',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: I.Example3
      }
    }
  },
  encoding: {
    name: 'encoding',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: I.Encoding3
      }
    }
  }
}

export class MediaType extends EnforcerComponent<I.IMediaType3Definition> implements I.IMediaType3 {
  [extension: `x${string}`]: any

  constructor (definition: I.IMediaType3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'MEDIA_TYPE3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#media-type-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#media-type-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#media-type-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#media-type-object'
  }

  static getSchemaDefinition (_data: I.IMediaTypeSchemaProcessor): ISchema.ISchemaDefinition<I.IMediaType3Definition, I.IMediaType3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IMediaType3Definition, I.IMediaType3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.schema,
        validators.example,
        validators.examples,
        validators.encoding
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.IMediaType3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get schema (): I.ISchema3 | undefined {
    return this.getProperty('schema')
  }

  set schema (value: I.ISchema3 | undefined) {
    this.setProperty('schema', value)
  }

  get example (): any | undefined {
    return this.getProperty('example')
  }

  set example (value: any | undefined) {
    this.setProperty('example', value)
  }

  get examples (): Record<string, I.IExample3> | undefined {
    return this.getProperty('examples')
  }

  set examples (value: Record<string, I.IExample3> | undefined) {
    this.setProperty('examples', value)
  }

  get encoding (): Record<string, I.IEncoding3> | undefined {
    return this.getProperty('encoding')
  }

  set encoding (value: Record<string, I.IEncoding3> | undefined) {
    this.setProperty('encoding', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
