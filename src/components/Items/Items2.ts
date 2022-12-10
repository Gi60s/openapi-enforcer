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
import { IItemsSchemaProcessor } from '../IInternalTypes'
import {
  IItems2,
  IItems2Definition,
  Items2
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IItems2Definition, IItems2> | null = null

interface IValidatorsMap {
  type: ISchema.IProperty<ISchema.IString>
  format: ISchema.IProperty<ISchema.IString>
  items: ISchema.IProperty<ISchema.IComponent<IItems2Definition, IItems2>>
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
  type: {
    name: 'type',
    required: true,
    schema: {
      type: 'string',
      enum: ['array', 'boolean', 'integer', 'number', 'string']
    }
  },
  format: {
    name: 'format',
    schema: {
      type: 'string'
    }
  },
  items: {
    name: 'items',
    schema: {
      type: 'component',
      allowsRef: false,
      component: Items2
    }
  },
  collectionFormat: {
    name: 'collectionFormat',
    schema: {
      type: 'string',
      enum: ['csv', 'ssv', 'tsv', 'pipes']
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

export class Items extends EnforcerComponent<IItems2Definition, IItems2> implements IItems2 {
  [extension: `x${string}`]: any

  constructor (definition: IItems2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'ITEMS2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#items-object',
    '3.0.0': false,
    '3.0.1': false,
    '3.0.2': false,
    '3.0.3': false
  }

  static getSchemaDefinition (_data: IItemsSchemaProcessor): ISchema.ISchemaDefinition<IItems2Definition, IItems2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IItems2Definition, IItems2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.type,
        validators.format,
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

  static validate (definition: IItems2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get type (): 'array'|'boolean'|'integer'|'number'|'string' {
    return this.getProperty('type')
  }

  set type (value: 'array'|'boolean'|'integer'|'number'|'string') {
    this.setProperty('type', value)
  }

  get format (): string | undefined {
    return this.getProperty('format')
  }

  set format (value: string | undefined) {
    this.setProperty('format', value)
  }

  get items (): IItems2 | undefined {
    return this.getProperty('items')
  }

  set items (value: IItems2 | undefined) {
    this.setProperty('items', value)
  }

  get collectionFormat (): 'csv'|'ssv'|'tsv'|'pipes' | undefined {
    return this.getProperty('collectionFormat')
  }

  set collectionFormat (value: 'csv'|'ssv'|'tsv'|'pipes' | undefined) {
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
