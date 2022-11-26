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
import { IEncodingSchemaProcessor } from '../IInternalTypes'
import {
  Header3,
  IEncoding3,
  IEncoding3Definition,
  IHeader3,
  IHeader3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IEncoding3Definition, IEncoding3> | null = null

export class Encoding extends EnforcerComponent<IEncoding3Definition, IEncoding3> implements IEncoding3 {
  [extension: `x${string}`]: any

  constructor (definition: IEncoding3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#encoding-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#encoding-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#encoding-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#encoding-object'
  }

  static getSchemaDefinition (_data: IEncodingSchemaProcessor): ISchema.ISchemaDefinition<IEncoding3Definition, IEncoding3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const contentType: ISchema.IProperty<ISchema.IString> = {
      name: 'contentType',
      schema: {
        type: 'string'
      }
    }

    const headers: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IHeader3Definition, IHeader3>>> = {
      name: 'headers',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Header3
        }
      }
    }

    const style: ISchema.IProperty<ISchema.IString> = {
      name: 'style',
      schema: {
        type: 'string'
      }
    }

    const explode: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'explode',
      schema: {
        type: 'boolean'
      }
    }

    const allowReserved: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'allowReserved',
      schema: {
        type: 'boolean'
      }
    }

    const result: ISchema.ISchemaDefinition<IEncoding3Definition, IEncoding3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        contentType,
        headers,
        style,
        explode,
        allowReserved
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IEncoding3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get contentType (): string | undefined {
    return this.getProperty('contentType')
  }

  set contentType (value: string | undefined) {
    this.setProperty('contentType', value)
  }

  get headers (): Record<string, IHeader3> | undefined {
    return this.getProperty('headers')
  }

  set headers (value: Record<string, IHeader3> | undefined) {
    this.setProperty('headers', value)
  }

  get style (): string | undefined {
    return this.getProperty('style')
  }

  set style (value: string | undefined) {
    this.setProperty('style', value)
  }

  get explode (): boolean | undefined {
    return this.getProperty('explode')
  }

  set explode (value: boolean | undefined) {
    this.setProperty('explode', value)
  }

  get allowReserved (): boolean | undefined {
    return this.getProperty('allowReserved')
  }

  set allowReserved (value: boolean | undefined) {
    this.setProperty('allowReserved', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
