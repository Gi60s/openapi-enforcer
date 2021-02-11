import { Exception } from 'exception-tree'
import * as Validator from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'
import * as ExternalDocumentation from './ExternalDocumentation'
import { Result } from 'result-value-exception'
import * as Xml from './Xml'

interface CustomDataTypeDefinition {
  constructors?: Function[]
  deserialize: (data: { exception: Exception, schema: Object, value: any }) => any
  isNumeric?: boolean
  random?: (data: { exception: Exception, schema: Object }) => any
  serialize: (data: { exception: Exception, schema: Object, value: any }) => any
  validate: (data: { exception: Exception, schema: Object, value: any }) => undefined
}

interface CustomDataTypeDefinitionPlus extends CustomDataTypeDefinition {
  type: string
  format: string
}

export interface CustomDataTypeDefinitionMap {
  boolean: { [k: string]: CustomDataTypeDefinitionPlus }
  integer: { [k: string]: CustomDataTypeDefinitionPlus }
  number: { [k: string]: CustomDataTypeDefinitionPlus }
  string: { [k: string]: CustomDataTypeDefinitionPlus }
}

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
  defineDataTypeFormat: (type: 'boolean' | 'integer' | 'number' | 'string', format: string, definition: CustomDataTypeDefinition | null) => undefined
  typeIsNumeric: (definition: Definition) => boolean
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
  discriminator?: {
    propertyName: string
    mapping: {
      [key: string]: string
    }
  }
  not?: Definition
  nullable?: boolean
  oneOf?: Definition[]
  writeOnly?: boolean
}

export type Definition = Definition2 | Definition3
type IDefinition = Definition

interface ObjectBase {
  [extension: string]: any
  additionalProperties?: Object | boolean
  allOf?: Object[]
  default?: any
  description?: string
  enum?: any[]
  example?: any
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  externalDocs?: ExternalDocumentation.Object
  format?: string
  items?: Object
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
  properties?: { [key: string]: Object }
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

export interface Object2 extends ObjectBase {
  discriminator?: string
}

export interface Object3 extends ObjectBase {
  anyOf?: Object[]
  deprecated?: boolean
  discriminator?: {
    propertyName: string
    mapping: {
      [key: string]: Object
    }
  }
  not?: Object
  nullable?: boolean
  oneOf?: Object[]
  writeOnly?: boolean
}

export type Object = Object2 | Object3

const dataTypeConstructors: Set<Function> = new Set()
const dataTypeWarnings: { [k: string]: boolean } = {}
const dataTypes: CustomDataTypeDefinitionMap = {
  boolean: {},
  integer: {},
  number: {},
  string: {}
}

class SchemaBase<Definition, Object> extends EnforcerComponent<Definition, Object> {
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

  // constructor (definition: D) {
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

  static defineDataTypeFormat (type: 'boolean' | 'integer' | 'number' | 'string', format: string, definition: CustomDataTypeDefinition | null): undefined {
    if (!(type in dataTypes)) throw Error('Invalid type specified. Must be one of: ' + Object.keys(dataTypes).join(', '))
    if (format === '' || typeof format !== 'string') throw Error('Invalid format specified. Must be a non-empty string')
    if (format in dataTypes[type]) throw Error('Format "' + format + '" is already defined')

    if (definition !== null) {
      if (typeof definition !== 'object' ||
        typeof definition.deserialize !== 'function' ||
        typeof definition.serialize !== 'function' ||
        typeof definition.validate !== 'function' ||
        ('random' in definition && typeof definition.random !== 'function')) throw Error('Invalid data type definition. Must be an object that defines handlers for "deserialize", "serialize", and "validate" with optional "random" handler.')

      if ('constructors' in definition) {
        if (!Array.isArray(definition.constructors)) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          throw Error('Invalid data type constructors value. Expected an array of functions. Received: ' + definition.constructors)
        }
        definition.constructors.forEach((fn: Function) => {
          if (typeof fn !== 'function') {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            throw Error('Invalid constructor specified. Expected a function, received: ' + fn)
          }
          dataTypeConstructors.add(fn)
        })
      } else {
        const key = type + '-' + format
        if (!dataTypeWarnings[key]) {
          dataTypeWarnings[key] = true
          console.warn('WARNING: Data type definition missing recommended "constructors" property for type "' + type + '" and format "' + format + '".')
        }
      }
    }

    // store the definition
    dataTypes[type][format] = Object.assign({}, definition, { type, format })

    return undefined
  }

  static typeIsNumeric (definition: IDefinition): boolean {
    const type = definition.type
    if (type !== 'boolean' && type !== 'integer' && type !== 'number' && type !== 'string') return false
    if (type === 'integer' || type === 'number') return true

    const format = definition.format
    if (format === undefined) return false

    const configuration = dataTypes[type][format]
    return typeof configuration === 'object' && 'isNumeric' in configuration ? configuration.isNumeric : false
  }
}

export function Factory2 (): FactoryResult<Definition, Object> {
  class Schema extends SchemaBase<Definition2, Object2> implements Object2 {
    readonly discriminator?: string

    // constructor (definition: Definition2) {
    //   super(definition)
    // }
  }

  return {
    component: Schema,
    validator: getValidatorSchema(Schema)
  }
}

export function Factory3 (): FactoryResult<Definition, Object> {
  class Schema extends SchemaBase<Definition3, Object3> implements Object3 {
    readonly anyOf?: Object[]
    readonly deprecated?: boolean
    readonly discriminator?: {
      readonly propertyName: string
      readonly mapping: {
        readonly [key: string]: Object
      }
    }

    readonly not?: Object
    readonly nullable?: boolean
    readonly oneOf?: Object[]
    readonly writeOnly?: boolean

    // constructor (definition: Definition3) {
    //   super(definition)
    // }
  }

  return {
    component: Schema,
    validator: getValidatorSchema(Schema)
  }
}

function getValidatorSchema (Schema: Class): Validator.SchemaConstructor<any, any> {
  // define common validator schemas for reuse below
  const d: { [key: string]: Validator.Schema } = {
    schema: {
      type: 'component',
      allowsRef: true,
      component: Schema
    },
    schemaArray: {
      type: 'array',
      items: {
        type: 'component',
        allowsRef: true,
        component: Schema
      }
    }
  }

  // there are common properties that all schemas include regardless of type, allOf, anyOf, oneOf, not, etc.
  const commonProperties2 = ['default', 'description', 'discriminator', 'enum', 'example', 'externalDocs', 'readOnly', 'title', 'xml']
  const commonProperties3 = ['default', 'deprecated', 'description', 'discriminator', 'enum', 'example', 'externalDocs', 'nullable', 'readOnly', 'title', 'writeOnly', 'xml']

  return function (data): Validator.SchemaObject {
    const { components, definition } = data
    const major: string = components.major
    const commonProperties = major === '2' ? commonProperties2 : commonProperties3
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
          after () {} // TODO: check that the format is defined for the specific type
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
            component: Schema
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
        schema: major === '2'
          ? { type: 'string' }
          : {
            type: 'object',
            required: () => ['propertyName'],
            allowsSchemaExtensions: false,
            properties: [
              {
                name: 'propertyName',
                schema: { type: 'string' }
              },
              {
                name: 'mapping',
                schema: {
                  type: 'object',
                  allowsSchemaExtensions: false,
                  additionalProperties: {
                    type: 'string',
                    after () { } // TODO: attempt lookup of mapping reference
                  }
                }
              }
            ]
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
          component: components.ExternalDocumentation
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
          component: components.Xml
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
    } else if ('anyOf' in definition && major === '3') {
      const keep = commonProperties.concat(['anyOf'])
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        properties: properties.filter(p => keep.includes(p.name))
      }

      // not
    } else if ('not' in definition && major === '3') {
      const keep = commonProperties.concat(['not'])
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        properties: properties.filter(p => keep.includes(p.name))
      }

      // oneOf
    } else if ('oneOf' in definition && major === '3') {
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
    } else if (Schema.typeIsNumeric(definition)) {
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
      console.log('v' + major + ' string: ' + keep.join(','))
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        properties: properties.filter(p => keep.includes(p.name))
      }

      // no known type
    } else {
      console.log('v' + major + ' unknown: ' + commonProperties.join(','))
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        properties: properties.filter(p => commonProperties.includes(p.name))
      }
    }
  }
}
