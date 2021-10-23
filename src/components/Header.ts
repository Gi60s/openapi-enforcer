import {
  Data,
  OASComponent,
  Dereferenced,
  Version,
  Exception,
  Referencable, ComponentSchema
} from './'
import { noop } from '../util'
import * as V from './helpers/common-validators'
import * as PartialSchema from './helpers/PartialSchema'
import * as DataType from './helpers/DataTypes'
import * as Example from './Example'
import * as Reference from './Reference'
import * as Schema from './Schema'

export interface Definition2 extends PartialSchema.Definition<Definition2> {
  [key: `x-${string}`]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  description?: string
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export interface Definition3 {
  [key: `x-${string}`]: any
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Example.Definition | Reference.Definition>
  explode?: boolean
  required?: boolean
  schema?: Schema.Definition3 | Reference.Definition
  style?: 'simple'
}

export type Definition = Definition2 | Definition3

export class Header<HasReference=Dereferenced> extends PartialSchema.PartialSchema<Header> {
  readonly [key: `x-${string}`]: any

  // v2
  readonly collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  readonly type?: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  // v3
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Referencable<HasReference, Example.Definition>>
  explode?: boolean
  required?: boolean
  schema?: Referencable<HasReference, Schema.Schema>
  style?: 'simple'

  constructor (definition: Definition, version?: Version) {
    super(Header, definition, version, arguments[2])
  }

  static defineDataType (type: DataType.Type, format: string, definition: DataType.Definition): void {
    PartialSchema.defineDataType(Header, type, format, definition)
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#header-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#header-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#header-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#header-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#header-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    const { definition } = data.context

    // copy schema from partial schema generator
    const schema = PartialSchema.schemaGenerator(Header, data)

    const partialValidator = {
      after: schema.validator?.after ?? noop
    }
    if (schema.validator === undefined) schema.validator = {}
    schema.validator.after = () => {
      V.defaultRequiredConflict(data)
      V.exampleExamplesConflict(data)
      partialValidator.after(data)
    }

    // the "type" is required for headers
    const typePropertyDefinition = schema.properties?.find(v => v.name === 'type')
    if (typePropertyDefinition !== undefined) typePropertyDefinition.required = true

    // add additional property
    schema.properties?.push(
      {
        name: 'collectionFormat',
        versions: ['2.x'],
        notAllowed: definition.type === 'array' ? undefined : 'Data type must be an array.',
        schema: {
          type: 'string',
          enum: ['csv', 'ssv', 'tsv', 'pipes'],
          default: 'csv'
        }
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
        name: 'description',
        schema: { type: 'string' }
      },
      {
        name: 'style',
        versions: ['3.x.x'],
        schema: {
          type: 'string',
          default: 'simple',
          enum: ['simple']
        }
      },
      {
        name: 'explode',
        versions: ['3.x.x'],
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'required',
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'schema',
        versions: ['3.x.x'],
        schema: {
          type: 'component',
          allowsRef: true,
          component: Schema.Schema
        }
      }
    )

    return schema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}

export class Header2 extends PartialSchema.PartialSchema<Header2> {
  readonly [key: `x-${string}`]: any
  readonly collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  readonly type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  constructor (definition: Definition2, version?: Version) {
    super(Header2, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#header-object'
  }

  static defineDataType = Header.defineDataType
  static schemaGenerator = Header.schemaGenerator

  static validate (definition: Definition2, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}

export class Header3<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Referencable<HasReference, Example.Definition>>
  explode?: boolean
  required?: boolean
  schema?: Referencable<HasReference, Schema.Schema>
  style?: 'simple'

  constructor (definition: Definition3, version?: Version) {
    super(Header3, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#header-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#header-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#header-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#header-object'
  }

  static defineDataType = Header.defineDataType
  static schemaGenerator = Header.schemaGenerator

  static validate (definition: Definition3, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
