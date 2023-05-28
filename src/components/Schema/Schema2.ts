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
import { Xml2, IXml2 } from '../Xml'
import { ExternalDocumentation2, IExternalDocumentation2 } from '../ExternalDocumentation'
import { Schema as SchemaBase } from './Schema'
import { ISchema2, ISchema2Definition, ISchema2SchemaProcessor, ISchemaValidatorsMap2 as IValidatorsMap } from './ISchema'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

export class Schema extends SchemaBase implements ISchema2 {
  public extensions: Record<string, any> = {}
  public format?: string
  public title?: string
  public description?: string
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
  public maxProperties?: number
  public minProperties?: number
  public uniqueItems?: boolean
  public enum?: any[]
  public multipleOf?: number
  public required?: string[]
  public type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  public items?: ISchema2
  public allOf?: ISchema2[]
  public properties?: Record<string, ISchema2>
  public additionalProperties?: ISchema2 | boolean
  public discriminator?: string
  public readOnly?: boolean
  public xml?: IXml2
  public externalDocs?: IExternalDocumentation2
  public example?: any

  constructor (definition: ISchema2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SCHEMA2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#schema-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: ISchema2SchemaProcessor): ISDSchemaDefinition<ISchema2Definition, ISchema2> {
    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<ISchema2Definition, ISchema2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.format,
        validators.title,
        validators.description,
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
        validators.maxProperties,
        validators.minProperties,
        validators.uniqueItems,
        validators._enum,
        validators.multipleOf,
        validators.required,
        validators.type,
        validators.items,
        validators.allOf,
        validators.properties,
        validators.additionalProperties,
        validators.discriminator,
        validators.readOnly,
        validators.xml,
        validators.externalDocs,
        validators.example
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    super.commonSchemaDefinition(_data, validators, result)
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    return result
  }

  static create (definition?: Partial<ISchema2Definition> | Schema | undefined): Schema {
    return new Schema(Object.assign({}, definition) as ISchema2Definition)
  }

  static async createAsync (definition?: Partial<ISchema2Definition> | Schema | string | undefined): Promise<Schema> {
    if (definition instanceof Schema) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ISchema2Definition>)
    }
  }

  static createDefinition<T extends Partial<ISchema2Definition>> (definition?: T | undefined): ISchema2Definition & T {
    return Object.assign({}, definition) as ISchema2Definition & T
  }

  static validate (definition: ISchema2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ISchema2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  discriminate (value: object): { key: string, name: string, schema: Schema } {
    return super.discriminate(value)
  }
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
const Schema2 = Schema
// <!# Custom Content End: AFTER_COMPONENT #!>

function getValidatorsMap (): IValidatorsMap {
  return {
    format: {
      name: 'format',
      schema: {
        type: 'string'
      }
    },
    title: {
      name: 'title',
      schema: {
        type: 'string'
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
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
    maxProperties: {
      name: 'maxProperties',
      schema: {
        type: 'number'
      }
    },
    minProperties: {
      name: 'minProperties',
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
    },
    required: {
      name: 'required',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    type: {
      name: 'type',
      schema: {
        type: 'string',
        enum: ['array', 'boolean', 'integer', 'number', 'object', 'string']
      }
    },
    items: {
      name: 'items',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Schema2
      }
    },
    allOf: {
      name: 'allOf',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Schema2
        }
      }
    },
    properties: {
      name: 'properties',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Schema2
        }
      }
    },
    additionalProperties: {
      name: 'additionalProperties',
      schema: {
        type: 'oneOf',
        oneOf: [
          {
            condition: data => typeof data.definition === 'object',
            schema: {
              type: 'component',
              allowsRef: true,
              component: Schema2
            }
          },
          {
            condition: data => typeof data.definition === 'boolean',
            schema: {
              type: 'boolean'
            }
          }
        ]
      }
    },
    discriminator: {
      name: 'discriminator',
      schema: {
        type: 'string'
      }
    },
    readOnly: {
      name: 'readOnly',
      schema: {
        type: 'boolean'
      }
    },
    xml: {
      name: 'xml',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Xml2
      }
    },
    externalDocs: {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation2
      }
    },
    example: {
      name: 'example',
      schema: {
        type: 'any'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
