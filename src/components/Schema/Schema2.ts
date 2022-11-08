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
import * as ISchema from '../IComponentSchema'
import { ISchemaProcessor } from '../ISchemaProcessor'
import {
  ExternalDocs2,
  IExternalDocs2,
  IExternalDocs2Definition,
  ISchema2,
  ISchema2Definition,
  IXml2,
  IXml2Definition,
  Schema2,
  Xml2
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

export class Schema extends EnforcerComponent implements ISchema2 {
  [extension: `x-${string}`]: any
  format?: string
  title?: string
  description?: string
  default?: any
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  maxProperties?: number
  minProperties?: number
  uniqueItems?: boolean
  enum?: any[]
  multipleOf?: number
  required?: string[]
  type?: string
  items?: ISchema2
  allOf?: ISchema2[]
  properties?: Record<string, ISchema2>
  additionalProperties?: ISchema2 | boolean
  discriminator?: string
  readOnly?: boolean
  xml?: IXml2
  externalDocs?: IExternalDocs2
  example?: any

  constructor (definition: ISchema2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#schema-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<ISchema2Definition, ISchema2> {
    const format: ISchema.IProperty<ISchema.IString> = {
      name: 'format',
      schema: {
        type: 'string'
      }
    }

    const title: ISchema.IProperty<ISchema.IString> = {
      name: 'title',
      schema: {
        type: 'string'
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
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
        type: 'array',  items: {
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
        type: 'array',  items: {
          type: 'string'
        }
      }
    }

    const type: ISchema.IProperty<ISchema.IString> = {
      name: 'type',
      schema: {
        type: 'string'
      }
    }

    const items: ISchema.IProperty<ISchema.IComponent<ISchema2Definition, ISchema2>> = {
      name: 'items',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Schema2
      }
    }

    const allOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISchema2Definition, ISchema2>>> = {
      name: 'allOf',
      schema: {
        type: 'array',  items: {
          type: 'component',    
      allowsRef: true,    
      component: Schema2
        }
      }
    }

    const properties: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISchema2Definition, ISchema2>>> = {
      name: 'properties',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Schema2
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
    }

    const discriminator: ISchema.IProperty<ISchema.IString> = {
      name: 'discriminator',
      schema: {
        type: 'string'
      }
    }

    const readOnly: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'readOnly',
      schema: {
        type: 'boolean'
      }
    }

    const xml: ISchema.IProperty<ISchema.IComponent<IXml2Definition, IXml2>> = {
      name: 'xml',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Xml2
      }
    }

    const externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocs2Definition, IExternalDocs2>> = {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocs2
      }
    }

    const example: ISchema.IProperty<any> = {
      name: 'example',
      schema: {
        type: 'any'
      }
    }

    const schema: ISchema.IDefinition<ISchema2Definition, ISchema2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        format,
        title,
        description,
        _default,
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
        type,
        items,
        allOf,
        properties,
        additionalProperties,
        discriminator,
        readOnly,
        xml,
        externalDocs,
        example
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    return schema
  }

  static validate (definition: ISchema2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
