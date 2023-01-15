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
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IParameter2Definition, I.IParameter2> | null = null

interface IValidatorsMap {
  name: ISchema.IProperty<ISchema.IString>
  _in: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  required: ISchema.IProperty<ISchema.IBoolean>
  schema: ISchema.IProperty<ISchema.IComponent<I.ISchema2Definition, I.ISchema2>>
  type: ISchema.IProperty<ISchema.IString>
  format: ISchema.IProperty<ISchema.IString>
  allowEmptyValue: ISchema.IProperty<ISchema.IBoolean>
  items: ISchema.IProperty<ISchema.IComponent<I.IItems2Definition, I.IItems2>>
  collectionFormat: ISchema.IProperty<ISchema.IString>
  _default: ISchema.IProperty<any>
  maximum: ISchema.IProperty<ISchema.INumber>
  exclusiveMaximum: ISchema.IProperty<ISchema.IBoolean>
  minimum: ISchema.IProperty<ISchema.INumber>
  exclusiveMinimum: ISchema.IProperty<ISchema.INumber>
  maxLength: ISchema.IProperty<ISchema.INumber>
  minLength: ISchema.IProperty<ISchema.INumber>
  pattern: ISchema.IProperty<ISchema.IString>
  maxItems: ISchema.IProperty<ISchema.INumber>
  minItems: ISchema.IProperty<ISchema.INumber>
  uniqueItems: ISchema.IProperty<ISchema.IBoolean>
  _enum: ISchema.IProperty<ISchema.IArray<any>>
  multipleOf: ISchema.IProperty<ISchema.INumber>
}

const validators: IValidatorsMap = {
  name: {
    name: 'name',
    required: true,
    schema: {
      type: 'string'
    }
  },
  _in: {
    name: 'in',
    required: true,
    schema: {
      type: 'string',
      enum: ['body', 'formData', 'header', 'path', 'query']
    }
  },
  description: {
    name: 'description',
    schema: {
      type: 'string'
    }
  },
  required: {
    name: 'required',
    schema: {
      type: 'boolean'
    }
  },
  schema: {
    name: 'schema',
    schema: {
      type: 'component',
      allowsRef: false,
      component: I.Schema2
    }
  },
  type: {
    name: 'type',
    schema: {
      type: 'string',
      enum: ['array', 'boolean', 'file', 'integer', 'number', 'string']
    }
  },
  format: {
    name: 'format',
    schema: {
      type: 'string'
    }
  },
  allowEmptyValue: {
    name: 'allowEmptyValue',
    schema: {
      type: 'boolean'
    }
  },
  items: {
    name: 'items',
    schema: {
      type: 'component',
      allowsRef: false,
      component: I.Items2
    }
  },
  collectionFormat: {
    name: 'collectionFormat',
    schema: {
      type: 'string',
      enum: ['csv', 'ssv', 'tsv', 'pipes', 'multi']
    }
  },
  _default: {
    name: 'default',
    schema: {
      type: 'any'
    }
  },
  maximum: {
    name: 'maximum',
    schema: {
      type: 'number'
    }
  },
  exclusiveMaximum: {
    name: 'exclusiveMaximum',
    schema: {
      type: 'boolean'
    }
  },
  minimum: {
    name: 'minimum',
    schema: {
      type: 'number'
    }
  },
  exclusiveMinimum: {
    name: 'exclusiveMinimum',
    schema: {
      type: 'number'
    }
  },
  maxLength: {
    name: 'maxLength',
    schema: {
      type: 'number'
    }
  },
  minLength: {
    name: 'minLength',
    schema: {
      type: 'number'
    }
  },
  pattern: {
    name: 'pattern',
    schema: {
      type: 'string'
    }
  },
  maxItems: {
    name: 'maxItems',
    schema: {
      type: 'number'
    }
  },
  minItems: {
    name: 'minItems',
    schema: {
      type: 'number'
    }
  },
  uniqueItems: {
    name: 'uniqueItems',
    schema: {
      type: 'boolean'
    }
  },
  _enum: {
    name: 'enum',
    schema: {
      type: 'array',
      items: {
        type: 'any'
      }
    }
  },
  multipleOf: {
    name: 'multipleOf',
    schema: {
      type: 'number'
    }
  }
}

export class Parameter extends EnforcerComponent<I.IParameter2Definition> implements I.IParameter2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IParameter2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'PARAMETER2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#parameter-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IParameterSchemaProcessor): ISchema.ISchemaDefinition<I.IParameter2Definition, I.IParameter2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IParameter2Definition, I.IParameter2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.name,
        validators._in,
        validators.description,
        validators.required,
        validators.schema,
        validators.type,
        validators.format,
        validators.allowEmptyValue,
        validators.items,
        validators.collectionFormat,
        validators._default,
        validators.maximum,
        validators.exclusiveMaximum,
        validators.minimum,
        validators.exclusiveMinimum,
        validators.maxLength,
        validators.minLength,
        validators.pattern,
        validators.maxItems,
        validators.minItems,
        validators.uniqueItems,
        validators._enum,
        validators.multipleOf
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IParameter2Definition> | Parameter | undefined): Parameter {
    if (definition instanceof Parameter) {
      return new Parameter(Object.assign({}, definition))
    } else {
      return new Parameter(Object.assign({
        name: "",
        in: "body"
      }, definition) as I.IParameter2Definition)
    }
  }

  static validate (definition: I.IParameter2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get name (): string {
    return this[GetProperty]('name')
  }

  set name (value: string) {
    this[SetProperty]('name', value)
  }

  get in (): 'body'|'formData'|'header'|'path'|'query' {
    return this[GetProperty]('in')
  }

  set in (value: 'body'|'formData'|'header'|'path'|'query') {
    this[SetProperty]('in', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get required (): boolean | undefined {
    return this[GetProperty]('required')
  }

  set required (value: boolean | undefined) {
    this[SetProperty]('required', value)
  }

  get schema (): I.ISchema2 | undefined {
    return this[GetProperty]('schema')
  }

  set schema (value: I.ISchema2 | undefined) {
    this[SetProperty]('schema', value)
  }

  get type (): 'array'|'boolean'|'file'|'integer'|'number'|'string' | undefined {
    return this[GetProperty]('type')
  }

  set type (value: 'array'|'boolean'|'file'|'integer'|'number'|'string' | undefined) {
    this[SetProperty]('type', value)
  }

  get format (): string | undefined {
    return this[GetProperty]('format')
  }

  set format (value: string | undefined) {
    this[SetProperty]('format', value)
  }

  get allowEmptyValue (): boolean | undefined {
    return this[GetProperty]('allowEmptyValue')
  }

  set allowEmptyValue (value: boolean | undefined) {
    this[SetProperty]('allowEmptyValue', value)
  }

  get items (): I.IItems2 | undefined {
    return this[GetProperty]('items')
  }

  set items (value: I.IItems2 | undefined) {
    this[SetProperty]('items', value)
  }

  get collectionFormat (): 'csv'|'ssv'|'tsv'|'pipes'|'multi' | undefined {
    return this[GetProperty]('collectionFormat')
  }

  set collectionFormat (value: 'csv'|'ssv'|'tsv'|'pipes'|'multi' | undefined) {
    this[SetProperty]('collectionFormat', value)
  }

  get default (): any | undefined {
    return this[GetProperty]('default')
  }

  set default (value: any | undefined) {
    this[SetProperty]('default', value)
  }

  get maximum (): number | undefined {
    return this[GetProperty]('maximum')
  }

  set maximum (value: number | undefined) {
    this[SetProperty]('maximum', value)
  }

  get exclusiveMaximum (): boolean | undefined {
    return this[GetProperty]('exclusiveMaximum')
  }

  set exclusiveMaximum (value: boolean | undefined) {
    this[SetProperty]('exclusiveMaximum', value)
  }

  get minimum (): number | undefined {
    return this[GetProperty]('minimum')
  }

  set minimum (value: number | undefined) {
    this[SetProperty]('minimum', value)
  }

  get exclusiveMinimum (): number | undefined {
    return this[GetProperty]('exclusiveMinimum')
  }

  set exclusiveMinimum (value: number | undefined) {
    this[SetProperty]('exclusiveMinimum', value)
  }

  get maxLength (): number | undefined {
    return this[GetProperty]('maxLength')
  }

  set maxLength (value: number | undefined) {
    this[SetProperty]('maxLength', value)
  }

  get minLength (): number | undefined {
    return this[GetProperty]('minLength')
  }

  set minLength (value: number | undefined) {
    this[SetProperty]('minLength', value)
  }

  get pattern (): string | undefined {
    return this[GetProperty]('pattern')
  }

  set pattern (value: string | undefined) {
    this[SetProperty]('pattern', value)
  }

  get maxItems (): number | undefined {
    return this[GetProperty]('maxItems')
  }

  set maxItems (value: number | undefined) {
    this[SetProperty]('maxItems', value)
  }

  get minItems (): number | undefined {
    return this[GetProperty]('minItems')
  }

  set minItems (value: number | undefined) {
    this[SetProperty]('minItems', value)
  }

  get uniqueItems (): boolean | undefined {
    return this[GetProperty]('uniqueItems')
  }

  set uniqueItems (value: boolean | undefined) {
    this[SetProperty]('uniqueItems', value)
  }

  get enum (): any[] | undefined {
    return this[GetProperty]('enum')
  }

  set enum (value: any[] | undefined) {
    this[SetProperty]('enum', value)
  }

  get multipleOf (): number | undefined {
    return this[GetProperty]('multipleOf')
  }

  set multipleOf (value: number | undefined) {
    this[SetProperty]('multipleOf', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
