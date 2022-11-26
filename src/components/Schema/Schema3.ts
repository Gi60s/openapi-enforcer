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
import { ISchemaSchemaProcessor } from '../IInternalTypes'
import {
  Discriminator3,
  ExternalDocumentation3,
  IDiscriminator3,
  IDiscriminator3Definition,
  IExternalDocumentation3,
  IExternalDocumentation3Definition,
  ISchema3,
  ISchema3Definition,
  IXml3,
  IXml3Definition,
  Schema3,
  Xml3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export class Schema extends EnforcerComponent<ISchema3Definition, ISchema3> implements ISchema3 {
  [extension: `x${string}`]: any

  constructor (definition: ISchema3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#schema-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#schema-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#schema-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#schema-object'
  }

  static getSchemaDefinition (_data: ISchemaSchemaProcessor): ISchema.ISchemaDefinition<ISchema3Definition, ISchema3> {
    const type: ISchema.IProperty<ISchema.IString> = {
      name: 'type',
      schema: {
        type: 'string'
      }
    }

    const allOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISchema3Definition, ISchema3>>> = {
      name: 'allOf',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Schema3
        }
      }
    }

    const oneOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISchema3Definition, ISchema3>>> = {
      name: 'oneOf',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Schema3
        }
      }
    }

    const anyOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISchema3Definition, ISchema3>>> = {
      name: 'anyOf',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Schema3
        }
      }
    }

    const not: ISchema.IProperty<ISchema.IComponent<ISchema3Definition, ISchema3>> = {
      name: 'not',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3
      }
    }

    const title: ISchema.IProperty<ISchema.IString> = {
      name: 'title',
      schema: {
        type: 'string'
      }
    }

    const maximum: ISchema.IProperty<ISchema.INumber> = {
      name: 'maximum',
      schema: {
        type: 'number'
      }
    }

    const exclusiveMaximum: ISchema.IProperty<ISchema.INumber> = {
      name: 'exclusiveMaximum',
      schema: {
        type: 'number'
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

    const maxProperties: ISchema.IProperty<ISchema.INumber> = {
      name: 'maxProperties',
      schema: {
        type: 'number'
      }
    }

    const minProperties: ISchema.IProperty<ISchema.INumber> = {
      name: 'minProperties',
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

    const required: ISchema.IProperty<ISchema.IArray<ISchema.IString>> = {
      name: 'required',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }

    const items: ISchema.IProperty<ISchema.IComponent<ISchema3Definition, ISchema3>> = {
      name: 'items',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3
      }
    }

    const properties: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISchema3Definition, ISchema3>>> = {
      name: 'properties',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Schema3
        }
      }
    }

    const additionalProperties: ISchema.IProperty<ISchema.IOneOf> = {
      name: 'additionalProperties',
      schema: {
        type: 'oneOf',
        oneOf: [
          {
            condition: () => true,
            schema: {
              type: 'component',
              allowsRef: true,
              component: Schema3
            }
          },
          {
            condition: () => false,
            schema: {
              type: 'boolean'
            }
          }
        ],
        error: () => {}
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const format: ISchema.IProperty<ISchema.IString> = {
      name: 'format',
      schema: {
        type: 'string'
      }
    }

    const _default: ISchema.IProperty<any> = {
      name: 'default',
      schema: {
        type: 'any'
      }
    }

    const nullable: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'nullable',
      schema: {
        type: 'boolean'
      }
    }

    const discriminator: ISchema.IProperty<ISchema.IComponent<IDiscriminator3Definition, IDiscriminator3>> = {
      name: 'discriminator',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Discriminator3
      }
    }

    const readOnly: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'readOnly',
      schema: {
        type: 'boolean'
      }
    }

    const writeOnly: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'writeOnly',
      schema: {
        type: 'boolean'
      }
    }

    const xml: ISchema.IProperty<ISchema.IComponent<IXml3Definition, IXml3>> = {
      name: 'xml',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Xml3
      }
    }

    const externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation3Definition, IExternalDocumentation3>> = {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation3
      }
    }

    const example: ISchema.IProperty<any> = {
      name: 'example',
      schema: {
        type: 'any'
      }
    }

    const deprecated: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'deprecated',
      schema: {
        type: 'boolean'
      }
    }

    const result: ISchema.ISchemaDefinition<ISchema3Definition, ISchema3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        type,
        allOf,
        oneOf,
        anyOf,
        not,
        title,
        maximum,
        exclusiveMaximum,
        minimum,
        exclusiveMinimum,
        maxLength,
        minLength,
        pattern,
        maxItems,
        minItems,
        maxProperties,
        minProperties,
        uniqueItems,
        _enum,
        multipleOf,
        required,
        items,
        properties,
        additionalProperties,
        description,
        format,
        _default,
        nullable,
        discriminator,
        readOnly,
        writeOnly,
        xml,
        externalDocs,
        example,
        deprecated
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    return result
  }

  static validate (definition: ISchema3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get type (): string | undefined {
    return this.getProperty('type')
  }

  set type (value: string | undefined) {
    this.setProperty('type', value)
  }

  get allOf (): ISchema3[] | undefined {
    return this.getProperty('allOf')
  }

  set allOf (value: ISchema3[] | undefined) {
    this.setProperty('allOf', value)
  }

  get oneOf (): ISchema3[] | undefined {
    return this.getProperty('oneOf')
  }

  set oneOf (value: ISchema3[] | undefined) {
    this.setProperty('oneOf', value)
  }

  get anyOf (): ISchema3[] | undefined {
    return this.getProperty('anyOf')
  }

  set anyOf (value: ISchema3[] | undefined) {
    this.setProperty('anyOf', value)
  }

  get not (): ISchema3 | undefined {
    return this.getProperty('not')
  }

  set not (value: ISchema3 | undefined) {
    this.setProperty('not', value)
  }

  get title (): string | undefined {
    return this.getProperty('title')
  }

  set title (value: string | undefined) {
    this.setProperty('title', value)
  }

  get maximum (): number | undefined {
    return this.getProperty('maximum')
  }

  set maximum (value: number | undefined) {
    this.setProperty('maximum', value)
  }

  get exclusiveMaximum (): number | undefined {
    return this.getProperty('exclusiveMaximum')
  }

  set exclusiveMaximum (value: number | undefined) {
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

  get maxProperties (): number | undefined {
    return this.getProperty('maxProperties')
  }

  set maxProperties (value: number | undefined) {
    this.setProperty('maxProperties', value)
  }

  get minProperties (): number | undefined {
    return this.getProperty('minProperties')
  }

  set minProperties (value: number | undefined) {
    this.setProperty('minProperties', value)
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

  get required (): string[] | undefined {
    return this.getProperty('required')
  }

  set required (value: string[] | undefined) {
    this.setProperty('required', value)
  }

  get items (): ISchema3 | undefined {
    return this.getProperty('items')
  }

  set items (value: ISchema3 | undefined) {
    this.setProperty('items', value)
  }

  get properties (): Record<string, ISchema3> | undefined {
    return this.getProperty('properties')
  }

  set properties (value: Record<string, ISchema3> | undefined) {
    this.setProperty('properties', value)
  }

  get additionalProperties (): ISchema3 | boolean | undefined {
    return this.getProperty('additionalProperties')
  }

  set additionalProperties (value: ISchema3 | boolean | undefined) {
    this.setProperty('additionalProperties', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get format (): string | undefined {
    return this.getProperty('format')
  }

  set format (value: string | undefined) {
    this.setProperty('format', value)
  }

  get default (): any | undefined {
    return this.getProperty('default')
  }

  set default (value: any | undefined) {
    this.setProperty('default', value)
  }

  get nullable (): boolean | undefined {
    return this.getProperty('nullable')
  }

  set nullable (value: boolean | undefined) {
    this.setProperty('nullable', value)
  }

  get discriminator (): IDiscriminator3 | undefined {
    return this.getProperty('discriminator')
  }

  set discriminator (value: IDiscriminator3 | undefined) {
    this.setProperty('discriminator', value)
  }

  get readOnly (): boolean | undefined {
    return this.getProperty('readOnly')
  }

  set readOnly (value: boolean | undefined) {
    this.setProperty('readOnly', value)
  }

  get writeOnly (): boolean | undefined {
    return this.getProperty('writeOnly')
  }

  set writeOnly (value: boolean | undefined) {
    this.setProperty('writeOnly', value)
  }

  get xml (): IXml3 | undefined {
    return this.getProperty('xml')
  }

  set xml (value: IXml3 | undefined) {
    this.setProperty('xml', value)
  }

  get externalDocs (): IExternalDocumentation3 | undefined {
    return this.getProperty('externalDocs')
  }

  set externalDocs (value: IExternalDocumentation3 | undefined) {
    this.setProperty('externalDocs', value)
  }

  get example (): any | undefined {
    return this.getProperty('example')
  }

  set example (value: any | undefined) {
    this.setProperty('example', value)
  }

  get deprecated (): boolean | undefined {
    return this.getProperty('deprecated')
  }

  set deprecated (value: boolean | undefined) {
    this.setProperty('deprecated', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
