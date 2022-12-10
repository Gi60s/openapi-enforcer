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
  ExternalDocumentation2,
  IExternalDocumentation2,
  IExternalDocumentation2Definition,
  ISchema2,
  ISchema2Definition,
  IXml2,
  IXml2Definition,
  Schema2,
  Xml2
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

interface IValidatorsMap {
  format: ISchema.IProperty<ISchema.IString>
  title: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  _default: ISchema.IProperty<any>
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
  type: ISchema.IProperty<ISchema.IString>
  items: ISchema.IProperty<ISchema.IComponent<ISchema2Definition, ISchema2>>
  allOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISchema2Definition, ISchema2>>>
  properties: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISchema2Definition, ISchema2>>>
  additionalProperties: ISchema.IProperty<ISchema.IOneOf>
  discriminator: ISchema.IProperty<ISchema.IString>
  readOnly: ISchema.IProperty<ISchema.IBoolean>
  xml: ISchema.IProperty<ISchema.IComponent<IXml2Definition, IXml2>>
  externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation2Definition, IExternalDocumentation2>>
  example: ISchema.IProperty<any>
}

const validators: IValidatorsMap = {
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
  type: {
    name: 'type',
    schema: {
      type: 'string'
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
          condition: () => true,
          schema: {
            type: 'component',
            allowsRef: true,
            component: Schema2
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

export class Schema extends EnforcerComponent<ISchema2Definition, ISchema2> implements ISchema2 {
  [extension: `x${string}`]: any

  constructor (definition: ISchema2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'SCHEMA2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#schema-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: ISchemaSchemaProcessor): ISchema.ISchemaDefinition<ISchema2Definition, ISchema2> {
    const result: ISchema.ISchemaDefinition<ISchema2Definition, ISchema2> = {
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
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    return result
  }

  static validate (definition: ISchema2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get format (): string | undefined {
    return this.getProperty('format')
  }

  set format (value: string | undefined) {
    this.setProperty('format', value)
  }

  get title (): string | undefined {
    return this.getProperty('title')
  }

  set title (value: string | undefined) {
    this.setProperty('title', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
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

  get type (): string | undefined {
    return this.getProperty('type')
  }

  set type (value: string | undefined) {
    this.setProperty('type', value)
  }

  get items (): ISchema2 | undefined {
    return this.getProperty('items')
  }

  set items (value: ISchema2 | undefined) {
    this.setProperty('items', value)
  }

  get allOf (): ISchema2[] | undefined {
    return this.getProperty('allOf')
  }

  set allOf (value: ISchema2[] | undefined) {
    this.setProperty('allOf', value)
  }

  get properties (): Record<string, ISchema2> | undefined {
    return this.getProperty('properties')
  }

  set properties (value: Record<string, ISchema2> | undefined) {
    this.setProperty('properties', value)
  }

  get additionalProperties (): ISchema2 | boolean | undefined {
    return this.getProperty('additionalProperties')
  }

  set additionalProperties (value: ISchema2 | boolean | undefined) {
    this.setProperty('additionalProperties', value)
  }

  get discriminator (): string | undefined {
    return this.getProperty('discriminator')
  }

  set discriminator (value: string | undefined) {
    this.setProperty('discriminator', value)
  }

  get readOnly (): boolean | undefined {
    return this.getProperty('readOnly')
  }

  set readOnly (value: boolean | undefined) {
    this.setProperty('readOnly', value)
  }

  get xml (): IXml2 | undefined {
    return this.getProperty('xml')
  }

  set xml (value: IXml2 | undefined) {
    this.setProperty('xml', value)
  }

  get externalDocs (): IExternalDocumentation2 | undefined {
    return this.getProperty('externalDocs')
  }

  set externalDocs (value: IExternalDocumentation2 | undefined) {
    this.setProperty('externalDocs', value)
  }

  get example (): any | undefined {
    return this.getProperty('example')
  }

  set example (value: any | undefined) {
    this.setProperty('example', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
