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
import { Schema2, ISchema2 } from '../Schema'
import { Items2, IItems2 } from '../Items'
import { Parameter as ParameterBase } from './Parameter'
import { IParameter2, IParameter2Definition, IParameter2SchemaProcessor, IParameterValidatorsMap2 as IValidatorsMap } from './IParameter'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IParameter2Definition, IParameter2> | null = null

export class Parameter extends ParameterBase implements IParameter2 {
  public extensions: Record<string, any> = {}
  public name!: string
  public in!: 'body' | 'formData' | 'header' | 'path' | 'query'
  public description?: string
  public required?: boolean
  public schema?: ISchema2
  public type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'
  public format?: string
  public allowEmptyValue?: boolean
  public items?: IItems2
  public collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi'
  public default?: any
  public maximum?: number
  public exclusiveMaximum?: boolean
  public minimum?: number
  public exclusiveMinimum?: boolean
  public maxLength?: number
  public minLength?: number
  public pattern?: string
  public maxItems?: number
  public minItems?: number
  public uniqueItems?: boolean
  public enum?: any[]
  public multipleOf?: number

  constructor (definition: IParameter2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'PARAMETER2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#parameter-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IParameter2SchemaProcessor): ISDSchemaDefinition<IParameter2Definition, IParameter2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IParameter2Definition, IParameter2> = {
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

  static create (definition?: Partial<IParameter2Definition> | Parameter | undefined): Parameter {
    if (definition instanceof Parameter) {
      return new Parameter(Object.assign({}, definition as unknown) as IParameter2Definition)
    } else {
      return new Parameter(Object.assign({
        name: '',
        in: 'body'
      }, definition) as IParameter2Definition)
    }
  }

  static async createAsync (definition?: Partial<IParameter2Definition> | Parameter | string | undefined): Promise<Parameter> {
    if (definition instanceof Parameter) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IParameter2Definition>)
    }
  }

  static createDefinition<T extends Partial<IParameter2Definition>> (definition?: T | undefined): IParameter2Definition & T {
    return Object.assign({
      name: '',
      in: 'body'
    }, definition) as IParameter2Definition & T
  }

  static validate (definition: IParameter2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IParameter2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

function getValidatorsMap (): IValidatorsMap {
  return {
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
        component: Schema2
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
        component: Items2
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
        type: 'number'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
