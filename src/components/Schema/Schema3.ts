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
import { loadAsync, loadAsyncAndThrow } from '../../Loader/Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IValidatorsMap {
  type: ISchema.IProperty<ISchema.IString>
  allOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>>
  oneOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>>
  anyOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>>
  not: ISchema.IProperty<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>
  title: ISchema.IProperty<ISchema.IString>
  maximum: ISchema.IProperty<ISchema.INumber>
  exclusiveMaximum: ISchema.IProperty<ISchema.INumber>
  minimum: ISchema.IProperty<ISchema.INumber>
  exclusiveMinimum: ISchema.IProperty<ISchema.INumber>
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

  constructor (definition: I.ISchema3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
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
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
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
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get type (): string | undefined {
    return this[GetProperty]('type')
  }

  set type (value: string | undefined) {
    this[SetProperty]('type', value)
  }

  get allOf (): I.ISchema3[] | undefined {
    return this[GetProperty]('allOf')
  }

  set allOf (value: I.ISchema3[] | undefined) {
    this[SetProperty]('allOf', value)
  }

  get oneOf (): I.ISchema3[] | undefined {
    return this[GetProperty]('oneOf')
  }

  set oneOf (value: I.ISchema3[] | undefined) {
    this[SetProperty]('oneOf', value)
  }

  get anyOf (): I.ISchema3[] | undefined {
    return this[GetProperty]('anyOf')
  }

  set anyOf (value: I.ISchema3[] | undefined) {
    this[SetProperty]('anyOf', value)
  }

  get not (): I.ISchema3 | undefined {
    return this[GetProperty]('not')
  }

  set not (value: I.ISchema3 | undefined) {
    this[SetProperty]('not', value)
  }

  get title (): string | undefined {
    return this[GetProperty]('title')
  }

  set title (value: string | undefined) {
    this[SetProperty]('title', value)
  }

  get maximum (): number | undefined {
    return this[GetProperty]('maximum')
  }

  set maximum (value: number | undefined) {
    this[SetProperty]('maximum', value)
  }

  get exclusiveMaximum (): number | undefined {
    return this[GetProperty]('exclusiveMaximum')
  }

  set exclusiveMaximum (value: number | undefined) {
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

  get maxProperties (): number | undefined {
    return this[GetProperty]('maxProperties')
  }

  set maxProperties (value: number | undefined) {
    this[SetProperty]('maxProperties', value)
  }

  get minProperties (): number | undefined {
    return this[GetProperty]('minProperties')
  }

  set minProperties (value: number | undefined) {
    this[SetProperty]('minProperties', value)
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

  get required (): string[] | undefined {
    return this[GetProperty]('required')
  }

  set required (value: string[] | undefined) {
    this[SetProperty]('required', value)
  }

  get items (): I.ISchema3 | undefined {
    return this[GetProperty]('items')
  }

  set items (value: I.ISchema3 | undefined) {
    this[SetProperty]('items', value)
  }

  get properties (): Record<string, I.ISchema3> | undefined {
    return this[GetProperty]('properties')
  }

  set properties (value: Record<string, I.ISchema3> | undefined) {
    this[SetProperty]('properties', value)
  }

  get additionalProperties (): I.ISchema3 | boolean | undefined {
    return this[GetProperty]('additionalProperties')
  }

  set additionalProperties (value: I.ISchema3 | boolean | undefined) {
    this[SetProperty]('additionalProperties', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get format (): string | undefined {
    return this[GetProperty]('format')
  }

  set format (value: string | undefined) {
    this[SetProperty]('format', value)
  }

  get default (): any | undefined {
    return this[GetProperty]('default')
  }

  set default (value: any | undefined) {
    this[SetProperty]('default', value)
  }

  get nullable (): boolean | undefined {
    return this[GetProperty]('nullable')
  }

  set nullable (value: boolean | undefined) {
    this[SetProperty]('nullable', value)
  }

  get discriminator (): I.IDiscriminator3 | undefined {
    return this[GetProperty]('discriminator')
  }

  set discriminator (value: I.IDiscriminator3 | undefined) {
    this[SetProperty]('discriminator', value)
  }

  get readOnly (): boolean | undefined {
    return this[GetProperty]('readOnly')
  }

  set readOnly (value: boolean | undefined) {
    this[SetProperty]('readOnly', value)
  }

  get writeOnly (): boolean | undefined {
    return this[GetProperty]('writeOnly')
  }

  set writeOnly (value: boolean | undefined) {
    this[SetProperty]('writeOnly', value)
  }

  get xml (): I.IXml3 | undefined {
    return this[GetProperty]('xml')
  }

  set xml (value: I.IXml3 | undefined) {
    this[SetProperty]('xml', value)
  }

  get externalDocs (): I.IExternalDocumentation3 | undefined {
    return this[GetProperty]('externalDocs')
  }

  set externalDocs (value: I.IExternalDocumentation3 | undefined) {
    this[SetProperty]('externalDocs', value)
  }

  get example (): any | undefined {
    return this[GetProperty]('example')
  }

  set example (value: any | undefined) {
    this[SetProperty]('example', value)
  }

  get deprecated (): boolean | undefined {
    return this[GetProperty]('deprecated')
  }

  set deprecated (value: boolean | undefined) {
    this[SetProperty]('deprecated', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
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
        type: 'number'
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
