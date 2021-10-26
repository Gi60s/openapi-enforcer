import {
  Version,
  Dereferenced,
  Referencable,
  Data,
  Reference,
  SchemaArray,
  SchemaComponent,
  Exception,
  ComponentSchema
} from './'
import { noop } from '../util'
import { Result } from '../Result'
import * as PartialSchema from './helpers/PartialSchema'
import * as Discriminator from './v3/Discriminator'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Xml from './Xml'
import * as DataType from './helpers/DataTypes'
import * as E from '../Exception/methods'
import { base as rootDataTypeStore, DataTypeStore } from './helpers/DataTypes'

export type Definition = Definition2 | Definition3

interface DefinitionBase<Definition> extends PartialSchema.Definition<Definition> {
  [key: `x-${string}`]: any
  additionalProperties?: Definition | boolean
  allOf?: Array<Definition | Reference>
  description?: string
  example?: any
  externalDocs?: ExternalDocumentation.Definition
  maxProperties?: number
  minProperties?: number
  properties?: Record<string, Definition | Reference>
  readOnly?: boolean
  required?: string[]
  title?: string
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  xml?: Xml.Definition
}

export interface Definition2 extends DefinitionBase<Definition2> {
  discriminator?: string
}

export interface Definition3 extends DefinitionBase<Definition3> {
  anyOf?: Array<Definition | Reference>
  deprecated?: boolean
  discriminator?: Discriminator.Definition
  not?: Definition3 | Reference
  nullable?: boolean
  oneOf?: Array<Definition | Reference>
  writeOnly?: boolean
}

const schemaDataType = new DataTypeStore(rootDataTypeStore)

export class Schema<HasReference=Dereferenced> extends PartialSchema.PartialSchema<Schema> {
  readonly [key: `x-${string}`]: any
  readonly foo!: Referencable<HasReference, Schema<HasReference>>
  readonly additionalProperties?: Referencable<HasReference, Schema<HasReference>> | boolean
  readonly allOf?: Array<Referencable<HasReference, Schema<HasReference>>>
  readonly description?: string
  readonly example?: any
  readonly externalDocs?: ExternalDocumentation.ExternalDocumentation
  readonly maxProperties?: number
  readonly minProperties?: number
  readonly properties?: Record<string, Referencable<HasReference, Schema<HasReference>>>
  readonly readOnly?: boolean
  readonly required?: string[]
  readonly title?: string
  readonly type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  readonly xml?: Xml.Xml

  readonly discriminator?: string | Discriminator.Discriminator
  readonly anyOf?: Array<Referencable<HasReference, Schema<HasReference>>>
  readonly deprecated?: boolean
  readonly not?: Referencable<HasReference, Schema<HasReference>>
  readonly nullable?: boolean
  readonly oneOf?: Array<Referencable<HasReference, Schema<HasReference>>>
  readonly writeOnly?: boolean

  constructor (definition: Definition, version?: Version) {
    super(Schema, definition, version, arguments[2])
  }

  deserialize (value: any): Result {
    // TODO: this function
    return new Result<any>(null)
  }

  populate (value: any): Result {
    // TODO: this function
    return new Result<any>(null)
  }

  random (value: any): Result {
    // TODO: this function
    return new Result<any>(null)
  }

  serialize (value: any): Result {
    // TODO: this function
    return new Result<any>(null)
  }

  validate (value: any): Exception | undefined {
    // TODO: this function
    return undefined
  }

  static dataType = schemaDataType

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#schema-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#schema-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#schema-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#schema-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#schema-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    const { major } = data.root
    const { reference } = data.component
    const { definition, exception } = data.context

    const schemaArray: SchemaArray = {
      type: 'array',
      items: {
        type: 'component',
        allowsRef: true,
        component: Schema
      }
    }
    const schemaChild: SchemaComponent = {
      type: 'component',
      allowsRef: true,
      component: Schema
    }

    // get some of the schema from the partial schema generator
    const schema = PartialSchema.schemaGenerator(Schema, data)

    // add 'object' as possible type
    const typePropertyDefinition = schema.properties?.find(s => s.name === 'type')
    if (typePropertyDefinition !== undefined) {
      typePropertyDefinition.schema.enum = ['array', 'boolean', 'integer', 'number', 'object', 'string']
    }

    const partialValidator = {
      before: schema.validator?.before ?? (() => true),
      after: schema.validator?.after ?? noop
    }
    if (schema.validator === undefined) schema.validator = {}
    schema.validator.before = () => {
      let success = true

      if ('additionalProperties' in definition) {
        // let this continue even if it fails here
        const value = definition.additionalProperties
        if (typeof value !== 'boolean' && typeof value !== 'object') {
          const invalidAdditionalPropertiesSchema = E.invalidAdditionalPropertiesSchema(value, {
            definition,
            locations: [{ node: definition, key: 'additionalProperties', type: 'value' }],
            reference
          })
          exception.at('additionalProperties').message(invalidAdditionalPropertiesSchema)
        }
      }

      success = success && partialValidator.before(data)

      return success
    }

    schema.validator.after = (data: Data) => {
      const { built } = data.context
      if (built.type === 'object') {
        PartialSchema.validateMaxMin(data, 'minProperties', 'maxProperties')
      }
      partialValidator.after(data)
    }

    // add additional properties
    schema.properties?.push(
      {
        name: 'additionalProperties',
        schema: {
          type: 'oneOf',
          oneOf: [
            {
              condition: (data: Data, { additionalProperties }: Definition) => typeof additionalProperties === 'object',
              schema: {
                type: 'boolean',
                default: true
              }
            },
            {
              condition: (data: Data, { additionalProperties }: Definition) => typeof additionalProperties !== 'object',
              schema: schemaChild
            }
          ],
          error (data) {
            return E.invalidAdditionalPropertiesSchema(definition, {
              definition,
              locations: [{ node: definition, key: 'additionalProperties', type: 'value' }],
              reference
            })
          }
        }
      },
      {
        name: 'allOf',
        schema: schemaArray
      },
      {
        name: 'anyOf',
        versions: ['3.x.x'],
        schema: schemaArray
      },
      {
        name: 'deprecated',
        versions: ['3.x.x'],
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'discriminator',
        schema: major === 2
          ? { type: 'string' }
          : {
              type: 'component',
              allowsRef: false,
              component: Discriminator.Discriminator
            }
      },
      {
        name: 'description',
        schema: {
          type: 'string'
        }
      },
      {
        name: 'externalDocs',
        schema: {
          type: 'component',
          allowsRef: false,
          component: ExternalDocumentation.ExternalDocumentation
        }
      },
      {
        name: 'maxProperties',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'minProperties',
        schema: {
          type: 'number'
        }
      },
      {
        name: 'not',
        schema: schemaChild
      },
      {
        name: 'nullable',
        versions: ['3.x.x'],
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'oneOf',
        schema: schemaArray
      },
      {
        name: 'properties',
        schema: {
          type: 'object',
          allowsSchemaExtensions: true,
          additionalProperties: schemaChild
        }
      },
      {
        name: 'readOnly',
        schema: {
          type: 'boolean',
          default: false
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
        name: 'writeOnly',
        versions: ['3.x.x'],
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'xml',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Xml.Xml
        }
      }
    )

    return schema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
