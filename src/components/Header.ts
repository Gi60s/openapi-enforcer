import { Data, OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { no } from '../util'
import * as E from '../Exception/methods'
import * as PartialSchema from './helpers/PartialSchema'
import * as DataType from './helpers/DataTypes'
import * as Example from './Example'
import * as Reference from './Reference'
import * as Schema from './Schema'

export interface Definition extends PartialSchema.Definition<Definition> {
  [extension: string]: any

  // v2
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  // v3
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Example.Definition | Reference.Definition>
  explode?: boolean
  required?: boolean
  schema?: Schema.Definition3 | Reference.Definition
  style?: 'simple'
}

export class Header extends OASComponent {
  readonly [extension: string]: any

  // v2
  readonly collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  readonly type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  // v3
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Example.Definition | Reference.Definition>
  explode?: boolean
  required?: boolean
  schema?: Schema.Definition3 | Reference.Definition
  style?: 'simple'

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Header object', definition, version, arguments[2])
    super(data)
  }

  static defineDataType (type: DataType.Type, format: string, definition: DataType.Definition): void {
    PartialSchema.defineDataType(Header, type, format, definition)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#header-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#header-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#header-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#header-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#header-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    // copy schema from partial schema generator
    const schema = PartialSchema.schemaGenerator(Header)

    schema.after = (data: Data) => {
      const { built, exception } = data

      if (built.required === true && 'default' in built) {
        exception.message(E.defaultRequiredConflict())
      }

      if (built.example !== undefined && built.examples !== undefined) {
        exception.message(E.exampleExamplesConflict(data.reference))
      }
    }

    // add collectionFormat property
    schema.properties?.push(
      {
        name: 'collectionFormat',
        versions: ['2.x'],
        schema: {
          type: 'string',
          enum: () => ['csv', 'ssv', 'tsv', 'pipes']
        }
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
        name: 'description',
        schema: { type: 'string' }
      },
      {
        name: 'style',
        versions: ['3.x.x'],
        schema: {
          type: 'string',
          default: () => 'simple',
          enum: () => ['simple']
        }
      },
      {
        name: 'explode',
        versions: ['3.x.x'],
        schema: {
          type: 'boolean',
          default: no
        }
      },
      {
        name: 'required',
        schema: {
          type: 'boolean',
          default: no
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

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
