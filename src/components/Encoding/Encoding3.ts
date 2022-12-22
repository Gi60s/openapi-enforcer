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

let cachedSchema: ISchema.ISchemaDefinition<I.IEncoding3Definition, I.IEncoding3> | null = null

interface IValidatorsMap {
  contentType: ISchema.IProperty<ISchema.IString>
  headers: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IHeader3Definition, I.IHeader3>>>
  style: ISchema.IProperty<ISchema.IString>
  explode: ISchema.IProperty<ISchema.IBoolean>
  allowReserved: ISchema.IProperty<ISchema.IBoolean>
}

const validators: IValidatorsMap = {
  contentType: {
    name: 'contentType',
    schema: {
      type: 'string'
    }
  },
  headers: {
    name: 'headers',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: I.Header3
      }
    }
  },
  style: {
    name: 'style',
    schema: {
      type: 'string'
    }
  },
  explode: {
    name: 'explode',
    schema: {
      type: 'boolean'
    }
  },
  allowReserved: {
    name: 'allowReserved',
    schema: {
      type: 'boolean'
    }
  }
}

export class Encoding extends EnforcerComponent<I.IEncoding3Definition> implements I.IEncoding3 {
  [Extensions]: Record<string, any> = {}

  constructor (definition: I.IEncoding3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'ENCODING3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#encoding-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#encoding-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#encoding-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#encoding-object'
  }

  static getSchemaDefinition (_data: I.IEncodingSchemaProcessor): ISchema.ISchemaDefinition<I.IEncoding3Definition, I.IEncoding3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IEncoding3Definition, I.IEncoding3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.contentType,
        validators.headers,
        validators.style,
        validators.explode,
        validators.allowReserved
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.IEncoding3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get contentType (): string | undefined {
    return this[GetProperty]('contentType')
  }

  set contentType (value: string | undefined) {
    this[SetProperty]('contentType', value)
  }

  get headers (): Record<string, I.IHeader3> | undefined {
    return this[GetProperty]('headers')
  }

  set headers (value: Record<string, I.IHeader3> | undefined) {
    this[SetProperty]('headers', value)
  }

  get style (): string | undefined {
    return this[GetProperty]('style')
  }

  set style (value: string | undefined) {
    this[SetProperty]('style', value)
  }

  get explode (): boolean | undefined {
    return this[GetProperty]('explode')
  }

  set explode (value: boolean | undefined) {
    this[SetProperty]('explode', value)
  }

  get allowReserved (): boolean | undefined {
    return this[GetProperty]('allowReserved')
  }

  set allowReserved (value: boolean | undefined) {
    this[SetProperty]('allowReserved', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
