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
import { Xml3a, IXml3a } from '../Xml'
import { ExternalDocumentation3a, IExternalDocumentation3a } from '../ExternalDocumentation'
import { Discriminator3a, IDiscriminator3a } from '../Discriminator'
import { Schema as SchemaBase } from './Schema'
import { ISchema3a, ISchema3aDefinition, ISchema3aSchemaProcessor, ISchemaValidatorsMap3a as IValidatorsMap } from './ISchema'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ISchema3aDefinition, ISchema3a> | null = null

export class Schema extends SchemaBase implements ISchema3a {
  public extensions: Record<string, any> = {}
  public type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string' | Array<'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'>
  public allOf?: ISchema3a[]
  public oneOf?: ISchema3a[]
  public anyOf?: ISchema3a[]
  public not?: ISchema3a
  public title?: string
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
  public items?: ISchema3a
  public properties?: Record<string, ISchema3a>
  public additionalProperties?: ISchema3a | boolean
  public description?: string
  public format?: string
  public default?: any
  public nullable?: boolean
  public discriminator?: IDiscriminator3a
  public readOnly?: boolean
  public writeOnly?: boolean
  public xml?: IXml3a
  public externalDocs?: IExternalDocumentation3a
  public example?: any
  public deprecated?: boolean

  constructor (definition: ISchema3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SCHEMA3A'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#schema-object'
  }

  static getSchemaDefinition (_data: ISchema3aSchemaProcessor): ISDSchemaDefinition<ISchema3aDefinition, ISchema3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<ISchema3aDefinition, ISchema3a> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.type,
        validators.allOf,
        validators.oneOf,
        validators.anyOf,
        validators.not,
        validators.title,
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
        validators.items,
        validators.properties,
        validators.additionalProperties,
        validators.description,
        validators.format,
        validators._default,
        validators.nullable,
        validators.discriminator,
        validators.readOnly,
        validators.writeOnly,
        validators.xml,
        validators.externalDocs,
        validators.example,
        validators.deprecated
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<ISchema3aDefinition> | Schema | undefined): Schema {
    return new Schema(Object.assign({}, definition) as ISchema3aDefinition)
  }

  static async createAsync (definition?: Partial<ISchema3aDefinition> | Schema | string | undefined): Promise<Schema> {
    if (definition instanceof Schema) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ISchema3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<ISchema3aDefinition>> (definition?: T | undefined): ISchema3aDefinition & T {
    return Object.assign({}, definition) as ISchema3aDefinition & T
  }

  static validate (definition: ISchema3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ISchema3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
    type: {
      name: 'type',
      schema: {
        type: 'oneOf',
        oneOf: [
          {
            condition: data => Array.isArray(data.definition),
            schema: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['array', 'boolean', 'integer', 'number', 'object', 'string']
              }
            }
          },
          {
            condition: data => typeof data.definition === 'string',
            schema: {
              type: 'string',
              enum: ['array', 'boolean', 'integer', 'number', 'object', 'string']
            }
          }
        ]
      }
    },
    allOf: {
      name: 'allOf',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Schema3a
        }
      }
    },
    oneOf: {
      name: 'oneOf',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Schema3a
        }
      }
    },
    anyOf: {
      name: 'anyOf',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Schema3a
        }
      }
    },
    not: {
      name: 'not',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3a
      }
    },
    title: {
      name: 'title',
      schema: {
        type: 'string'
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
    items: {
      name: 'items',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3a
      }
    },
    properties: {
      name: 'properties',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Schema3a
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
              component: Schema3a
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
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    format: {
      name: 'format',
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
    nullable: {
      name: 'nullable',
      schema: {
        type: 'boolean'
      }
    },
    discriminator: {
      name: 'discriminator',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Discriminator3a
      }
    },
    readOnly: {
      name: 'readOnly',
      schema: {
        type: 'boolean'
      }
    },
    writeOnly: {
      name: 'writeOnly',
      schema: {
        type: 'boolean'
      }
    },
    xml: {
      name: 'xml',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Xml3a
      }
    },
    externalDocs: {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation3a
      }
    },
    example: {
      name: 'example',
      schema: {
        type: 'any'
      }
    },
    deprecated: {
      name: 'deprecated',
      schema: {
        type: 'boolean'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
