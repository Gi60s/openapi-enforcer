import {
  initializeData,
  SpecMap,
  Version,
  Data,
  Reference,
  SchemaArray,
  SchemaComponent,
  SchemaObject,
  Exception,
  Dereferenced, Referencable
} from './'
import { no, yes } from '../util'
import { Result } from '../Result'
import * as PartialSchema from './helpers/PartialSchema'
import * as Discriminator from './Discriminator'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Xml from './Xml'
import * as DataType from './helpers/DataTypes'

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

export class Schema<HasReference=Dereferenced> extends PartialSchema.PartialSchema<Schema> {
  readonly [key: `x-${string}`]: any
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
    const data = initializeData('constructing', Schema, definition, version, arguments[2])
    super(data)
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

  static defineDataType (type: DataType.Type, format: string, definition: DataType.Definition): void {
    PartialSchema.defineDataType(Schema, type, format, definition)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#schema-object',
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#schema-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#schema-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#schema-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#schema-object'
    }
  }

  static schemaGenerator (): SchemaObject {
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
    const schema = PartialSchema.schemaGenerator(Schema)

    // add 'object' as possible type
    const typeProperty = schema.properties?.find(s => s.name === 'type')
    if (typeProperty !== undefined) {
      typeProperty.schema.enum = () => {
        return ['array', 'boolean', 'integer', 'number', 'object', 'string']
      }
    }

    const partialAfter = schema.after
    schema.after = (data: Data, def: Definition) => {
      const { built } = data
      if (built.type === 'object') {
        PartialSchema.validateMaxMin(data, 'minProperties', 'maxProperties')
      }
      if (partialAfter !== undefined) partialAfter(data, def)
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
                default: yes
              }
            },
            {
              condition: (data: Data, { additionalProperties }: Definition) => typeof additionalProperties !== 'object',
              schema: schemaChild
            }
          ]
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
          default: no
        }
      },
      {
        name: 'discriminator',
        schema: {
          type: 'oneOf',
          oneOf: [
            {
              condition: ({ major }: Data) => major === 2,
              schema: { type: 'string' }
            },
            {
              condition: ({ major }: Data) => major > 2,
              schema: {
                type: 'component',
                allowsRef: false,
                component: Discriminator.Discriminator
              }
            }
          ]
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
          default: no
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
          allowsSchemaExtensions: yes,
          additionalProperties: schemaChild
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
        name: 'writeOnly',
        versions: ['3.x.x'],
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
