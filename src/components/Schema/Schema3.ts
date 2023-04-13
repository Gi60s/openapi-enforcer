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
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import {
  ISchemaHookHandler,
  ISchemaHookResult,
  ISchemaHookType, ISchemaPopulateOptions,
  ISchemaRandomOptions,
  ISchemaValidateOptions
} from './ISchema'
import * as common from './common'
import { Result } from '../../Result'
// <!# Custom Content End: HEADER #!>

interface IValidatorsMap {
  type: ISchema.IProperty<ISchema.IString>
  allOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>>
  oneOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>>
  anyOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>>
  not: ISchema.IProperty<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>
  title: ISchema.IProperty<ISchema.IString>
  maximum: ISchema.IProperty<ISchema.INumber>
  exclusiveMaximum: ISchema.IProperty<ISchema.IBoolean>
  minimum: ISchema.IProperty<ISchema.INumber>
  exclusiveMinimum: ISchema.IProperty<ISchema.IBoolean>
  maxLength: ISchema.IProperty<ISchema.INumber>
  minLength: ISchema.IProperty<ISchema.INumber>
  pattern: ISchema.IProperty<ISchema.IString>
  maxItems: ISchema.IProperty<ISchema.INumber>
  minItems: ISchema.IProperty<ISchema.INumber>
  maxProperties: ISchema.IProperty<ISchema.INumber>
  minProperties: ISchema.IProperty<ISchema.INumber>
  uniqueItems: ISchema.IProperty<ISchema.IBoolean>
  _enum: ISchema.IProperty<ISchema.IArray<any>>
  multipleOf: ISchema.IProperty<ISchema.INumber>
  required: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  items: ISchema.IProperty<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>
  properties: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>>
  additionalProperties: ISchema.IProperty<ISchema.IOneOf>
  description: ISchema.IProperty<ISchema.IString>
  format: ISchema.IProperty<ISchema.IString>
  _default: ISchema.IProperty<any>
  nullable: ISchema.IProperty<ISchema.IBoolean>
  discriminator: ISchema.IProperty<ISchema.IComponent<I.IDiscriminator3Definition, I.IDiscriminator3>>
  readOnly: ISchema.IProperty<ISchema.IBoolean>
  writeOnly: ISchema.IProperty<ISchema.IBoolean>
  xml: ISchema.IProperty<ISchema.IComponent<I.IXml3Definition, I.IXml3>>
  externalDocs: ISchema.IProperty<ISchema.IComponent<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>>
  example: ISchema.IProperty<any>
  deprecated: ISchema.IProperty<ISchema.IBoolean>
}

export class Schema extends EnforcerComponent<I.ISchema3Definition> implements I.ISchema3 {
  [S.Extensions]: Record<string, any> = {}
  public type?: string
  public allOf?: I.ISchema3[]
  public oneOf?: I.ISchema3[]
  public anyOf?: I.ISchema3[]
  public not?: I.ISchema3
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
  public items?: I.ISchema3
  public properties?: Record<string, I.ISchema3>
  public additionalProperties?: I.ISchema3 | boolean
  public description?: string
  public format?: string
  public default?: any
  public nullable?: boolean
  public discriminator?: I.IDiscriminator3
  public readOnly?: boolean
  public writeOnly?: boolean
  public xml?: I.IXml3
  public externalDocs?: I.IExternalDocumentation3
  public example?: any
  public deprecated?: boolean

  constructor (definition: I.ISchema3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SCHEMA3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#schema-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#schema-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#schema-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#schema-object'
  }

  static getSchemaDefinition (_data: I.ISchemaSchemaProcessor): ISchema.ISchemaDefinition<I.ISchema3Definition, I.ISchema3> {
    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.ISchema3Definition, I.ISchema3> = {
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
    // TODO: The discriminator attribute is legal only when using one of the composite keywords oneOf, anyOf, allOf.
    const processor = _data
    const { definition } = processor
    processor.after = () => {
      // if this schema has an 'allOf' then check to see if any of the allOf schemas have a discriminator and if
      // so then mark it as used
      if (definition.allOf !== undefined) {
        const length = definition.allOf.length
        for (let i = 0; i < length; i++) {
          const childDefinition = definition.allOf[i]
          const discriminatorDefinition = 'discriminator' in childDefinition
            ? childDefinition.discriminator
            : undefined
          const match = discriminatorDefinition !== undefined
            ? processor.store.discriminatorSchemas.find(s => s.definition === discriminatorDefinition)
            : undefined
          if (match !== undefined) {
            match.used = true
            break
          }
        }
      }
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    return result
  }

  static create (definition?: Partial<I.ISchema3Definition> | Schema | undefined): Schema {
    return new Schema(Object.assign({}, definition) as I.ISchema3Definition)
  }

  static async createAsync (definition?: Partial<I.ISchema3Definition> | Schema | string | undefined): Promise<Schema> {
    if (definition instanceof Schema) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.ISchema3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.ISchema3Definition>> (definition?: T | undefined): I.ISchema3Definition & T {
    return Object.assign({}, definition) as I.ISchema3Definition & T
  }

  static validate (definition: I.ISchema3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.ISchema3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  hook (type: ISchemaHookType, handler: ISchemaHookHandler): ISchemaHookResult {
    return {
      done: false,
      hasException: false,
      value: null
    }
  }

  deserialize (value: string, options: { strict: boolean } | undefined): any {
    return common.deserialize(value, options)
  }

  discriminate (value: object): { key: string, name: string, schema: I.Schema2 } {
    return common.discriminate<I.Schema2>(value)
  }

  populate (params: Record<string, any>, value: object, options?: ISchemaPopulateOptions): Result<object> {
    return new Result({})
  }

  random (value: any, options?: ISchemaRandomOptions): Result<object> {
    return new Result({})
  }

  serialize (value: any): Result {
    return new Result({})
  }

  unhook (type: ISchemaHookType, handler: ISchemaHookHandler): void {

  }

  validate (value: any, options?: ISchemaValidateOptions): ExceptionStore | undefined {
    return undefined
  }
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    type: {
      name: 'type',
      schema: {
        type: 'string'
      }
    },
    allOf: {
      name: 'allOf',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: I.Schema3
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
          component: I.Schema3
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
          component: I.Schema3
        }
      }
    },
    not: {
      name: 'not',
      schema: {
        type: 'component',
        allowsRef: true,
        component: I.Schema3
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
        component: I.Schema3
      }
    },
    properties: {
      name: 'properties',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: I.Schema3
        }
      }
    },
    additionalProperties: {
      name: 'additionalProperties',
      schema: {
        type: 'oneOf',
        oneOf: [
          {
            condition: () => true,
            schema: {
              type: 'component',
              allowsRef: true,
              component: I.Schema3
            }
          },
          {
            condition: () => false,
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
        component: I.Discriminator3
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
        component: I.Xml3
      }
    },
    externalDocs: {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.ExternalDocumentation3
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
