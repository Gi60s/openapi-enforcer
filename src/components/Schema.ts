import { ComponentDefinition } from '../component-registry'
import * as DataTypeFormat from '../data-type-format'
import * as Discriminator from './Discriminator'
import { Exception } from 'exception-tree'
import * as Validator from '../definition-validator'
import { EnforcerComponent, Statics, v3 } from './'
import * as ExternalDocumentation from './ExternalDocumentation'
import { Result } from 'result-value-exception'
import * as Xml from './Xml'
// import { smart } from '../util'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
  dataTypes: DataTypeFormat.Controller
  // defineDataTypeFormat: (type: 'boolean' | 'integer' | 'number' | 'string', format: string, definition: CustomDataTypeDefinition | null) => undefined
  // getDataTypeFormats: (type: 'boolean' | 'integer' | 'number' | 'string') => string[]
  // typeIsNumeric: (definition: Definition) => boolean
}

interface DefinitionBase {
  [extension: string]: any
  additionalProperties?: Definition | boolean
  allOf?: Definition[]
  default?: any
  description?: string
  enum?: any[]
  example?: any
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  externalDocs?: ExternalDocumentation.Definition
  format?: string
  items?: Definition
  maximum?: number
  maxItems?: number
  maxLength?: number
  maxProperties?: number
  minimum?: number
  minItems?: number
  minLength?: number
  minProperties?: number
  multipleOf?: number
  pattern?: string
  properties?: { [key: string]: Definition }
  readOnly?: boolean
  required?: string[]
  title?: string
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  uniqueItems?: boolean
  xml?: Xml.Definition
}

export interface Definition2 extends DefinitionBase {
  discriminator?: string
}

export interface Definition3 extends DefinitionBase {
  anyOf?: Definition[]
  deprecated?: boolean
  discriminator?: Discriminator.Definition
  not?: Definition
  nullable?: boolean
  oneOf?: Definition[]
  writeOnly?: boolean
}

export type Definition = Definition2 | Definition3
// type IDefinition = Definition

interface ObjectBase<ObjectType=Object> {
  [extension: string]: any
  additionalProperties?: ObjectType | boolean
  allOf?: ObjectType[]
  default?: any
  description?: string
  enum?: any[]
  example?: any
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  externalDocs?: ExternalDocumentation.Object
  format?: string
  items?: ObjectType
  maximum?: number
  maxItems?: number
  maxLength?: number
  maxProperties?: number
  minimum?: number
  minItems?: number
  minLength?: number
  minProperties?: number
  multipleOf?: number
  pattern?: string
  properties?: { [key: string]: ObjectType }
  readOnly?: boolean
  required?: string[]
  title?: string
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  uniqueItems?: boolean
  xml?: Xml.Object

  deserialize: (value: any) => Result<any>
  populate: (value: any) => Result<any>
  random: (value: any) => Result<any>
  serialize: (value: any) => Result<any>
  validate: (value: any) => Exception | undefined
}

export interface Object2 extends ObjectBase<Object2> {
  discriminator?: string
}

export interface Object3 extends ObjectBase<Object3> {
  anyOf?: Object3[]
  deprecated?: boolean
  discriminator?: Discriminator.Object
  not?: Object3
  nullable?: boolean
  oneOf?: Object3[]
  writeOnly?: boolean
}

export type Object = Object2 | Object3

export const versions = Object.freeze({
  '2.0': 'http://spec.openapis.org/oas/v2.0#schema-object',
  '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#schema-object',
  '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#schema-object',
  '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#schema-object',
  '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#schema-object'
})

export const Component = class Schema extends EnforcerComponent<Definition, Object> {
  readonly additionalProperties?: Object | boolean
  readonly allOf?: Object[]
  readonly default?: any
  readonly description?: string
  readonly enum?: any[]
  readonly example?: any
  readonly exclusiveMaximum?: boolean
  readonly exclusiveMinimum?: boolean
  readonly externalDocs?: ExternalDocumentation.Object
  readonly format?: string
  readonly items?: Object
  readonly maximum?: number
  readonly maxItems?: number
  readonly maxLength?: number
  readonly maxProperties?: number
  readonly minimum?: number
  readonly minItems?: number
  readonly minLength?: number
  readonly minProperties?: number
  readonly multipleOf?: number
  readonly pattern?: string
  readonly properties?: { [key: string]: Object }
  readonly readOnly?: boolean
  readonly required?: string[]
  readonly title?: string
  readonly type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  readonly uniqueItems?: boolean
  readonly xml?: Xml.Object
  
  readonly discriminator?: string | Discriminator.Object
  readonly anyOf?: Object3[]
  readonly deprecated?: boolean
  readonly not?: Object3
  readonly nullable?: boolean
  readonly oneOf?: Object3[]
  readonly writeOnly?: boolean

  // constructor (definition: Definition2) {
  //   super(definition)
  // }

  deserialize (value: any): Result<any> {
    // TODO: this function
    return new Result<any>()
  }

  populate (value: any): Result<any> {
    // TODO: this function
    return new Result<any>()
  }

  random (value: any): Result<any> {
    // TODO: this function
    return new Result<any>()
  }

  serialize (value: any): Result<any> {
    // TODO: this function
    return new Result<any>()
  }

  validate (value: any): Exception | undefined {
    // TODO: this function
    return undefined
  }
}

export function validator (data: Validator.Data<Definition, Object>): Validator.SchemaObject {
  // define common validator schemas for reuse below
  const d: { [key: string]: Validator.Schema } = {
    schema: {
      type: 'component',
      allowsRef: true,
      component: Component
    },
    schemaArray: {
      type: 'array',
      items: {
        type: 'component',
        allowsRef: true,
        component: Component
      }
    }
  }

  // there are common properties that all schemas include regardless of type, allOf, anyOf, oneOf, not, etc.
  const commonProperties2 = ['default', 'description', 'discriminator', 'enum', 'example', 'externalDocs', 'readOnly', 'title', 'xml']
  const commonProperties3 = ['default', 'deprecated', 'description', 'discriminator', 'enum', 'example', 'externalDocs', 'nullable', 'readOnly', 'title', 'writeOnly', 'xml']

  const { components, definition } = data
  const version: string = components.$version
  const commonProperties = version === '2' ? commonProperties2 : commonProperties3
  const root = definition as Definition
  const dataTypeDefinition: DataTypeFormat.Definition<SchemaType> = Schema.dataTypes.getDefinition(definition.type, definition.format)

  const properties: Array<{ name: string, schema: Validator.Schema }> = [
    {
      name: 'type',
      schema: {
        type: 'string',
        enum: () => ['array', 'boolean', 'integer', 'number', 'object', 'string']
      }
    },
    {
      name: 'format',
      schema: {
        type: 'string',
        after ({ alert, definition }) {
          if (dataTypeDefinition === undefined && definition !== undefined) {
            alert('warn', 'SCH001', `Data type format ${root.type} ${definition} is not defined. Standard ${root.type} processing will be used.`)
          }
        }
      }
    },
    {
      name: 'additionalProperties',
      schema: typeof definition.additionalProperties === 'object'
        ? {
          type: 'boolean',
          default: () => true
        }
        : {
          type: 'component',
          allowsRef: true,
          component: Component
        }
    },
    {
      name: 'allOf',
      schema: d.schemaArray
    },
    {
      name: 'anyOf',
      schema: d.schemaArray
    },
    {
      name: 'deprecated',
      schema: {
        type: 'boolean',
        default: () => false
      }
    },
    {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    {
      name: 'discriminator',
      schema: version === '2'
        ? { type: 'string' }
        : {
          type: 'component',
          allowsRef: false,
          component: (components as v3).Discriminator
        }
    },
    {
      name: 'enum',
      schema: {
        type: 'array',
        items: {
          type: 'any',
          after () {} // TODO: validate that each enum matches schema
        }
      }
    },
    {
      name: 'exclusiveMaximum',
      schema: {
        type: 'boolean',
        default: () => false
      }
    },
    {
      name: 'exclusiveMinimum',
      schema: {
        type: 'boolean',
        default: () => false
      }
    },
    {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation.Component
      }
    },
    {
      name: 'items',
      schema: d.schema
    },
    {
      name: 'maximum',
      schema: {
        type: 'number',
        after () {} // TODO: make sure max > min and that max is integer if type is integer
      }
    },
    {
      name: 'maxItems',
      schema: {
        type: 'number',
        after () {} // TODO: make sure max > min and that max is integer if type is integer
      }
    },
    {
      name: 'maxLength',
      schema: {
        type: 'number',
        after () {} // TODO: make sure max > min and that max is integer if type is integer
      }
    },
    {
      name: 'maxProperties',
      schema: {
        type: 'number',
        after () {} // TODO: make sure max > min and that max is integer if type is integer
      }
    },
    {
      name: 'minimum',
      schema: {
        type: 'number',
        after () {} // TODO: make sure max > min and that max is integer if type is integer
      }
    },
    {
      name: 'minItems',
      schema: {
        type: 'number',
        after () {} // TODO: make sure max > min and that max is integer if type is integer
      }
    },
    {
      name: 'minLength',
      schema: {
        type: 'number',
        after () {} // TODO: make sure max > min and that max is integer if type is integer
      }
    },
    {
      name: 'minProperties',
      schema: {
        type: 'number',
        after () {} // TODO: make sure max > min and that max is integer if type is integer
      }
    },
    {
      name: 'multipleOf',
      schema: {
        type: 'number',
        after () {}
      }
    },
    {
      name: 'not',
      schema: d.schema
    },
    {
      name: 'nullable',
      schema: {
        type: 'boolean',
        default: () => false
      }
    },
    {
      name: 'oneOf',
      schema: d.schemaArray
    },
    {
      name: 'pattern',
      schema: {
        type: 'string',
        after () {} // TODO: must be valid regex
      }
    },
    {
      name: 'properties',
      schema: {
        type: 'object',
        allowsSchemaExtensions: true,
        additionalProperties: d.schema
      }
    },
    {
      name: 'readOnly',
      schema: {
        type: 'boolean',
        default: () => false
      }
    },
    {
      name: 'required',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    {
      name: 'title',
      schema: {
        type: 'string'
      }
    },
    {
      name: 'uniqueItems',
      schema: {
        type: 'boolean',
        default: () => false
      }
    },
    {
      name: 'writeOnly',
      schema: {
        type: 'boolean',
        default: () => false
      }
    },
    {
      name: 'xml',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Xml.Component
      }
    },

    // these properties are for after most of schema is built out
    {
      name: 'default',
      schema: {
        type: 'any',
        after () { } // TODO: validate that default matches schema
      }
    },
    {
      name: 'enum',
      schema: {
        type: 'any',
        after () { } // TODO: validate that default matches schema
      }
    },
    {
      name: 'example',
      schema: {
        type: 'any',
        after () {} // TODO: validate that example matches schema
      }
    }
  ]

  // allOf
  if ('allOf' in definition.allOf) {
    const keep = commonProperties.concat(['allOf'])
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: properties.filter(p => keep.includes(p.name))
    }

    // anyOf
  } else if ('anyOf' in definition && version === '3') {
    const keep = commonProperties.concat(['anyOf'])
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: properties.filter(p => keep.includes(p.name))
    }

    // not
  } else if ('not' in definition && version === '3') {
    const keep = commonProperties.concat(['not'])
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: properties.filter(p => keep.includes(p.name))
    }

    // oneOf
  } else if ('oneOf' in definition && version === '3') {
    const keep = commonProperties.concat(['oneOf'])
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: properties.filter(p => keep.includes(p.name))
    }

    // array
  } else if (definition.type === 'array') {
    const keep = commonProperties.concat(['items', 'maxItems', 'minItems', 'type', 'uniqueItems'])
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      required: () => ['items'],
      properties: properties.filter(p => keep.includes(p.name))
    }

    // boolean
  } else if (definition.type === 'boolean') {
    const keep = commonProperties.concat(['format', 'type'])
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: properties.filter(p => keep.includes(p.name))
    }

    // numeric
  } else if (dataTypeDefinition.isNumeric) {
    const keep = commonProperties.concat(['exclusiveMaximum', 'exclusiveMinimum', 'format', 'maximum', 'minimum', 'multipleOf', 'type'])
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: properties.filter(p => keep.includes(p.name))
    }

    // object
  } else if (definition.type === 'object') {
    const keep = commonProperties.concat(['additionalProperties', 'maxProperties', 'minProperties', 'properties', 'required', 'type'])
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: properties.filter(p => keep.includes(p.name))
    }

    // string
  } else if (definition.type === 'string') {
    const keep = commonProperties.concat(['format', 'maxLength', 'minLength', 'pattern', 'type'])
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: properties.filter(p => keep.includes(p.name))
    }

    // no known type
  } else {
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: properties.filter(p => commonProperties.includes(p.name))
    }
  }
}

export const register: ComponentDefinition = {
  component: Component,
  dataTypes: DataTypeFormat.Factory(),
  validator,
  versions
}