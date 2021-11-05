import {
  Version,
  EnforcerController,
  Dereferenced,
  Referencable,
  Data,
  SchemaArray,
  SchemaComponent,
  DefinitionException,
  ComponentSchema, ExtendedComponent
} from './'
import { Exception } from '../utils/Exception'
import { noop } from '../utils/util'
import { Result } from '../utils/Result'
import * as PartialSchema from './helpers/PartialSchema'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Xml from './Xml'
import * as E from '../DefinitionException/methods'
import { Schema2 as Definition2, Schema3 as Definition3 } from './helpers/DefinitionTypes'
import * as SchemaHelper from './helpers/schema-functions'
import { allOfConflictingSchemaTypes } from '../DefinitionException/methods'

type Definition = Definition2 | Definition3

interface ComponentsMap {
  Discriminator: ExtendedComponent | unknown
  Schema: ExtendedComponent | unknown
}

export interface ValidateOptions {
  readWriteMode?: 'read' | 'write'
}

export function schemaGenerator (components: ComponentsMap, data: Data): ComponentSchema<Definition> {
  const { major } = data.root
  const { reference } = data.component
  const { definition, exception } = data.context

  const schemaArray: SchemaArray = {
    type: 'array',
    minItems: 1,
    items: {
      type: 'component',
      allowsRef: true,
      component: components.Schema as ExtendedComponent
    }
  }
  const schemaChild: SchemaComponent = {
    type: 'component',
    allowsRef: true,
    component: components.Schema as ExtendedComponent
  }

  // get some of the schema from the partial schema generator
  const schema = PartialSchema.schemaGenerator(components.Schema, data)

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

  if (schema.builder === undefined) schema.builder = {}
  schema.builder.after = (data: Data, enforcer) => {
    const { built } = data.context
    if (built.allOf !== undefined) {
      let type = ''
      let format = ''
      built.allOf.forEach((schema: any) => {
        if ('type' in schema) type = schema.type
        if ('format' in schema) format = schema.format
      })
      enforcer.allOf = { type, format }
    }
  }

  schema.validator.after = (data: Data) => {
    const { built } = data.context

    // look in "allOf" for conflicting types or formats
    if (built.allOf !== undefined) {
      const types = new Set<string>()
      const formats = new Set<string>()

      // look at all types and formats
      built.allOf.forEach((schema: any) => {
        if ('type' in schema) types.add(schema.type)
        if ('format' in schema) formats.add(schema.format)
      })

      const typesArray = Array.from(types)
      if (typesArray.length > 1) {
        const allOfConflictingSchemaTypes = E.allOfConflictingSchemaTypes(typesArray, {
          definition,
          locations: [{ node: definition, key: 'allOf', type: 'value' }]
        })
        exception.at('allOf').message(allOfConflictingSchemaTypes)
      }

      const formatsArray = Array.from(formats)
      if (typesArray.length > 1) {
        const allOfConflictingSchemaFormats = E.allOfConflictingSchemaFormats(formatsArray, {
          definition,
          locations: [{ node: definition, key: 'allOf', type: 'value' }]
        })
        exception.at('allOf').message(allOfConflictingSchemaFormats)
      }
    }

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
            component: components.Discriminator as ExtendedComponent
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

export class Schema<HasReference=Dereferenced> extends PartialSchema.PartialSchema<Schema> {
  readonly enforcer!: EnforcerController<Definition> & {
    allOf?: {
      type: string
      format: string
    }
  }

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

  deserialize (value: any): Result {
    // TODO: this function
    return new Result<any>(null)
  }

  discriminate (value: any): { key: string, name: string, schema: Schema | null } {
    return { key: '', name: '', schema: null }
  }

  populate (value: any): Result {
    // TODO: this function
    return new Result<any>(null)
  }

  random (value: any, options: { decimalPlaces: number, variation: number }): Result {
    // const exception = new Exception('Unable to generate random value:')
    // TODO: this function
    return new Result<any>(null)
  }

  serialize (value: any): Result<string> {
    // TODO: this function
    return new Result<string>('')
  }

  validate (value: any, options?: ValidateOptions): Exception | undefined {
    const exception = new Exception('One or more exceptions occurred while validating object against schema:')
    if (options === undefined) options = {}
    // @ts-expect-error
    const { result } = SchemaHelper.validate(this, value, new Map(), exception, options)
    return result === true ? undefined : exception
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
