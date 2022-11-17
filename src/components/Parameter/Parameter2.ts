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
import { IParameterSchemaProcessor } from '../IInternalTypes'
import {
  IItems2,
  IItems2Definition,
  IParameter2,
  IParameter2Definition,
  ISchema2,
  ISchema2Definition,
  Items2,
  Schema2
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IParameter2Definition, IParameter2> | null = null

export class Parameter extends EnforcerComponent implements IParameter2 {
  [extension: `x-${string}`]: any
  name!: string
  in!: 'body'|'formData'|'header'|'path'|'query'
  description?: string
  required?: boolean
  schema?: ISchema2
  type?: 'array'|'boolean'|'file'|'integer'|'number'|'string'
  format?: string
  allowEmptyValue?: boolean
  items?: IItems2
  collectionFormat?: 'csv'|'ssv'|'tsv'|'pipes'|'multi'
  default?: any
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number

  constructor (definition: IParameter2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#parameter-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchema (_data: IParameterSchemaProcessor): ISchema.IDefinition<IParameter2Definition, IParameter2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const name: ISchema.IProperty<ISchema.IString> = {
      name: 'name',
      required: true,
      schema: {
        type: 'string'
      }
    }

    const _in: ISchema.IProperty<ISchema.IString> = {
      name: 'in',
      required: true,
      schema: {
        type: 'string',
        enum: ['body', 'formData', 'header', 'path', 'query']
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const required: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'required',
      schema: {
        type: 'boolean'
      }
    }

    const schema: ISchema.IProperty<ISchema.IComponent<ISchema2Definition, ISchema2>> = {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Schema2
      }
    }

    const type: ISchema.IProperty<ISchema.IString> = {
      name: 'type',
      schema: {
        type: 'string',
        enum: ['array', 'boolean', 'file', 'integer', 'number', 'string']
      }
    }

    const format: ISchema.IProperty<ISchema.IString> = {
      name: 'format',
      schema: {
        type: 'string'
      }
    }

    const allowEmptyValue: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'allowEmptyValue',
      schema: {
        type: 'boolean'
      }
    }

    const items: ISchema.IProperty<ISchema.IComponent<IItems2Definition, IItems2>> = {
      name: 'items',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Items2
      }
    }

    const collectionFormat: ISchema.IProperty<ISchema.IString> = {
      name: 'collectionFormat',
      schema: {
        type: 'string',
        enum: ['csv', 'ssv', 'tsv', 'pipes', 'multi']
      }
    }

    const _default: ISchema.IProperty<any> = {
      name: 'default',
      schema: {
        type: 'any'
      }
    }

    const maximum: ISchema.IProperty<ISchema.INumber> = {
      name: 'maximum',
      schema: {
        type: 'number'
      }
    }

    const exclusiveMaximum: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'exclusiveMaximum',
      schema: {
        type: 'boolean'
      }
    }

    const minimum: ISchema.IProperty<ISchema.INumber> = {
      name: 'minimum',
      schema: {
        type: 'number'
      }
    }

    const exclusiveMinimum: ISchema.IProperty<ISchema.INumber> = {
      name: 'exclusiveMinimum',
      schema: {
        type: 'number'
      }
    }

    const maxLength: ISchema.IProperty<ISchema.INumber> = {
      name: 'maxLength',
      schema: {
        type: 'number'
      }
    }

    const minLength: ISchema.IProperty<ISchema.INumber> = {
      name: 'minLength',
      schema: {
        type: 'number'
      }
    }

    const pattern: ISchema.IProperty<ISchema.IString> = {
      name: 'pattern',
      schema: {
        type: 'string'
      }
    }

    const maxItems: ISchema.IProperty<ISchema.INumber> = {
      name: 'maxItems',
      schema: {
        type: 'number'
      }
    }

    const minItems: ISchema.IProperty<ISchema.INumber> = {
      name: 'minItems',
      schema: {
        type: 'number'
      }
    }

    const uniqueItems: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'uniqueItems',
      schema: {
        type: 'boolean'
      }
    }

    const _enum: ISchema.IProperty<ISchema.IArray<any>> = {
      name: 'enum',
      schema: {
        type: 'array',
        items: {
          type: 'any'
        }
      }
    }

    const multipleOf: ISchema.IProperty<ISchema.INumber> = {
      name: 'multipleOf',
      schema: {
        type: 'number'
      }
    }

    const result: ISchema.IDefinition<IParameter2Definition, IParameter2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        name,
        _in,
        description,
        required,
        schema,
        type,
        format,
        allowEmptyValue,
        items,
        collectionFormat,
        _default,
        maximum,
        exclusiveMaximum,
        minimum,
        exclusiveMinimum,
        maxLength,
        minLength,
        pattern,
        maxItems,
        minItems,
        uniqueItems,
        _enum,
        multipleOf
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IParameter2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
