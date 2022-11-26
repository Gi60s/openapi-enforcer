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

let cachedSchema: ISchema.ISchemaDefinition<IParameter2Definition, IParameter2> | null = null

export class Parameter extends EnforcerComponent<IParameter2Definition, IParameter2> implements IParameter2 {
  [extension: `x${string}`]: any

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

  static getSchemaDefinition (_data: IParameterSchemaProcessor): ISchema.ISchemaDefinition<IParameter2Definition, IParameter2> {
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

    const result: ISchema.ISchemaDefinition<IParameter2Definition, IParameter2> = {
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

  get name (): string {
    return this.getProperty('name')
  }

  set name (value: string) {
    this.setProperty('name', value)
  }

  get in (): 'body'|'formData'|'header'|'path'|'query' {
    return this.getProperty('in')
  }

  set in (value: 'body'|'formData'|'header'|'path'|'query') {
    this.setProperty('in', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get required (): boolean | undefined {
    return this.getProperty('required')
  }

  set required (value: boolean | undefined) {
    this.setProperty('required', value)
  }

  get schema (): ISchema2 | undefined {
    return this.getProperty('schema')
  }

  set schema (value: ISchema2 | undefined) {
    this.setProperty('schema', value)
  }

  get type (): 'array'|'boolean'|'file'|'integer'|'number'|'string' | undefined {
    return this.getProperty('type')
  }

  set type (value: 'array'|'boolean'|'file'|'integer'|'number'|'string' | undefined) {
    this.setProperty('type', value)
  }

  get format (): string | undefined {
    return this.getProperty('format')
  }

  set format (value: string | undefined) {
    this.setProperty('format', value)
  }

  get allowEmptyValue (): boolean | undefined {
    return this.getProperty('allowEmptyValue')
  }

  set allowEmptyValue (value: boolean | undefined) {
    this.setProperty('allowEmptyValue', value)
  }

  get items (): IItems2 | undefined {
    return this.getProperty('items')
  }

  set items (value: IItems2 | undefined) {
    this.setProperty('items', value)
  }

  get collectionFormat (): 'csv'|'ssv'|'tsv'|'pipes'|'multi' | undefined {
    return this.getProperty('collectionFormat')
  }

  set collectionFormat (value: 'csv'|'ssv'|'tsv'|'pipes'|'multi' | undefined) {
    this.setProperty('collectionFormat', value)
  }

  get default (): any | undefined {
    return this.getProperty('default')
  }

  set default (value: any | undefined) {
    this.setProperty('default', value)
  }

  get maximum (): number | undefined {
    return this.getProperty('maximum')
  }

  set maximum (value: number | undefined) {
    this.setProperty('maximum', value)
  }

  get exclusiveMaximum (): boolean | undefined {
    return this.getProperty('exclusiveMaximum')
  }

  set exclusiveMaximum (value: boolean | undefined) {
    this.setProperty('exclusiveMaximum', value)
  }

  get minimum (): number | undefined {
    return this.getProperty('minimum')
  }

  set minimum (value: number | undefined) {
    this.setProperty('minimum', value)
  }

  get exclusiveMinimum (): number | undefined {
    return this.getProperty('exclusiveMinimum')
  }

  set exclusiveMinimum (value: number | undefined) {
    this.setProperty('exclusiveMinimum', value)
  }

  get maxLength (): number | undefined {
    return this.getProperty('maxLength')
  }

  set maxLength (value: number | undefined) {
    this.setProperty('maxLength', value)
  }

  get minLength (): number | undefined {
    return this.getProperty('minLength')
  }

  set minLength (value: number | undefined) {
    this.setProperty('minLength', value)
  }

  get pattern (): string | undefined {
    return this.getProperty('pattern')
  }

  set pattern (value: string | undefined) {
    this.setProperty('pattern', value)
  }

  get maxItems (): number | undefined {
    return this.getProperty('maxItems')
  }

  set maxItems (value: number | undefined) {
    this.setProperty('maxItems', value)
  }

  get minItems (): number | undefined {
    return this.getProperty('minItems')
  }

  set minItems (value: number | undefined) {
    this.setProperty('minItems', value)
  }

  get uniqueItems (): boolean | undefined {
    return this.getProperty('uniqueItems')
  }

  set uniqueItems (value: boolean | undefined) {
    this.setProperty('uniqueItems', value)
  }

  get enum (): any[] | undefined {
    return this.getProperty('enum')
  }

  set enum (value: any[] | undefined) {
    this.setProperty('enum', value)
  }

  get multipleOf (): number | undefined {
    return this.getProperty('multipleOf')
  }

  set multipleOf (value: number | undefined) {
    this.setProperty('multipleOf', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
