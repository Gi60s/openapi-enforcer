import { SchemaArray, SchemaComponent, SchemaString, EnforcerData, componentValidate } from './'
import {
  BuilderData,
  Component,
  ComponentSchema,
  Data,
  Version
} from './helpers/builder-validator-types'
import { DefinitionException } from '../DefinitionException'
import * as PartialSchema from './helpers/PartialSchema'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Xml from './Xml'
import * as E from '../DefinitionException/methods'
import { Schema2 as Definition2, Schema3 as Definition3 } from './helpers/definition-types'
import * as SchemaHelper from './helpers/schema-functions'

type Definition = Definition2 | Definition3

interface ComponentsMap {
  Discriminator: Component | unknown
  Schema: Component | unknown
}

export function schemaGenerator (components: ComponentsMap): ComponentSchema<Definition> {
  const schemaArray: SchemaArray = {
    type: 'array',
    minItems: 1,
    items: {
      type: 'component',
      allowsRef: true,
      component: components.Schema as Component
    }
  }
  const schemaChild: SchemaComponent = {
    type: 'component',
    allowsRef: true,
    component: components.Schema as Component
  }

  // get some of the schema from the partial schema generator
  const schema = PartialSchema.schemaGenerator<Definition, Component>(components.Schema)

  // add 'object' as possible type
  schema.adjustProperty('type', propertySchema => {
    const schema = propertySchema.schema as SchemaString
    (schema.enum as string[]).push('object')
  })

  schema.hook('after-build', (data: BuilderData) => {
    data.root.lastly.push(() => {
      const { built } = data.context
      const enforcer = built.enforcer

      // create a merged schema (if possible) of this schema
      if ('allOf' in built || 'anyOf' in built || 'oneOf' in built) {
        const { type, format } = SchemaHelper.determineTypes(built, new Map()).get(true)

        const target: Definition = {}
        if (type !== '') target.type = type
        if (format !== '') target.format = format

        const map: Map<Schema, Definition> = new Map()
        enforcer.schema = SchemaHelper.merge(built, target, map)
      } else if ('not' in built) {
        enforcer.schema = null
      } else {
        enforcer.schema = built
      }
    })
  })

  schema.hook('before-validate', (data) => {
    const { exception } = data.context
    const definition = data.component.definition

    if ('additionalProperties' in definition) {
      // let this continue even if it fails here
      const value = definition.additionalProperties
      if (typeof value !== 'boolean' && typeof value !== 'object') {
        const invalidAdditionalPropertiesSchema = E.invalidAdditionalPropertiesSchema(data, { node: definition, key: 'additionalProperties', type: 'value' }, value)
        exception.at('additionalProperties').message(invalidAdditionalPropertiesSchema)
      }
    }

    return true
  })

  schema.hook('after-validate', (data) => {
    const { exception } = data.context
    const built = data.context.built

    // look in "allOf" for conflicting types or formats
    if (built.allOf !== undefined) {
      const types = SchemaHelper.determineTypes(built, new Map())

      if (types.known.length > 1) {
        const allOfConflictingSchemaTypes = E.allOfConflictingSchemaTypes(data, { key: 'allOf', type: 'value' }, types.known.map(v => v.type))
        exception.at('allOf').message(allOfConflictingSchemaTypes)
      }

      const formatsArray = (types.known[0]?.formats ?? []).filter(v => v.length > 0)
      if (formatsArray.length > 1) {
        const allOfConflictingSchemaFormats = E.allOfConflictingSchemaFormats(data, { key: 'allOf', type: 'value' }, formatsArray)
        exception.at('allOf').message(allOfConflictingSchemaFormats)
      }
    }

    if (built.type === 'object') {
      PartialSchema.validateMaxMin(data, 'minProperties', 'maxProperties')
    }
  })

  // add additional properties
  schema.properties?.push(
    {
      name: 'additionalProperties',
      schema: {
        type: 'oneOf',
        oneOf: [
          {
            condition: (data: Data, { additionalProperties }: Definition) => typeof additionalProperties !== 'object',
            schema: {
              type: 'boolean',
              default: true
            }
          },
          {
            condition: (data: Data, { additionalProperties }: Definition) => typeof additionalProperties === 'object',
            schema: schemaChild
          }
        ],
        error (data) {
          const definition = data.component.definition
          return E.invalidAdditionalPropertiesSchema(data, { node: definition, key: 'additionalProperties', type: 'value' }, definition)
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
      schema (data) {
        return data.data.root.major === 2
          ? { type: 'string' }
          : {
              type: 'component',
              allowsRef: false,
              component: components.Discriminator as Component
            }
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
        additionalProperties: {
          schema: schemaChild
        }
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

export class Schema extends PartialSchema.PartialSchema<Schema> {
  enforcer!: EnforcerData<Schema, PartialSchema.EnforcerExtensionSchema> & {
    schema: Schema | null // null if "not" property in use at top level
  }

  extensions!: Record<string, any>
  additionalProperties?: Schema | boolean
  allOf?: Schema[]
  description?: string
  example?: any
  externalDocs?: ExternalDocumentation.ExternalDocumentation
  maxProperties?: number
  minProperties?: number
  properties?: Record<string, Schema>
  readOnly?: boolean
  required?: string[]
  title?: string
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  xml?: Xml.Xml

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
