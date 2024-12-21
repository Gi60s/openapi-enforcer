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

/* eslint-disable import/no-duplicates */
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Items as ItemsBase } from './Items'
import { IItems2, IItems2Definition, IItems2SchemaProcessor, IItemsValidatorsMap2 as IValidatorsMap } from './IItems'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IItems2Definition, IItems2> | null = null

export class Items extends ItemsBase implements IItems2 {
  public extensions: Record<string, any> = {}
  public type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'
  public format?: string
  public items?: IItems2
  public collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  public default?: any
  public maximum?: any
  public exclusiveMaximum?: boolean
  public minimum?: any
  public exclusiveMinimum?: boolean
  public maxLength?: number
  public minLength?: number
  public pattern?: string
  public maxItems?: number
  public minItems?: number
  public uniqueItems?: boolean
  public enum?: any[]
  public multipleOf?: any

  constructor (definition: IItems2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'items'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#items-object',
    '3.0.0': false,
    '3.0.1': false,
    '3.0.2': false,
    '3.0.3': false,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IItems2SchemaProcessor): ISDSchemaDefinition<IItems2Definition, IItems2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IItems2Definition, IItems2> = {
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

  static create (definition?: Partial<IItems2Definition> | Items | undefined): Items {
    if (definition instanceof Items) {
      return new Items(Object.assign({}, definition as unknown) as IItems2Definition)
    } else {
      return new Items(Object.assign({
        type: 'array'
      }, definition) as IItems2Definition)
    }
  }

  static async createAsync (definition?: Partial<IItems2Definition> | Items | string | undefined): Promise<Items> {
    if (definition instanceof Items) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IItems2Definition>)
    }
  }

  static createDefinition<T extends Partial<IItems2Definition>> (definition?: T | undefined): IItems2Definition & T {
    return Object.assign({
      type: 'array'
    }, definition) as IItems2Definition & T
  }

  static validate (definition: IItems2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IItems2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
const Items2 = Items
// <!# Custom Content End: AFTER_COMPONENT #!>

function getValidatorsMap (): IValidatorsMap {
  return {
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
        type: 'any'
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
        type: 'any'
      }
    },
    exclusiveMinimum: {
      name: 'exclusiveMinimum',
      schema: {
        type: 'boolean'
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
        type: 'any'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
