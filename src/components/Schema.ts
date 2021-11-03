import {
  Version,
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
import { base as rootDataTypeStore, DataTypeStore } from './helpers/DataTypes'
import { Schema2 as Definition2, Schema3 as Definition3 } from './helpers/DefinitionTypes'
import * as SchemaHelper from './helpers/schema-functions'

type Definition = Definition2 | Definition3

interface ComponentsMap {
  Discriminator: ExtendedComponent | unknown
  Schema: ExtendedComponent | unknown
}

export interface ValidateOptions {
  readWriteMode?: 'read' | 'write'
  validateEnum?: boolean
}

type HookName = 'afterDeserialize' | 'afterSerialize' | 'afterValidate' | 'beforeDeserialize' | 'beforeSerialize' | 'beforeValidate'
type HookHandler = (value: any, schema: Schema, exception: Exception) => HookHandlerResult | undefined
interface HookHandlerResult {
  done: boolean
  hasError?: boolean
  value: any
}

const schemaDataType = new DataTypeStore(rootDataTypeStore)
const hookStore: Record<HookName, HookHandler[]> = {
  afterDeserialize: [],
  afterSerialize: [],
  afterValidate: [],
  beforeDeserialize: [],
  beforeSerialize: [],
  beforeValidate: []
}

export function schemaGenerator (components: ComponentsMap, data: Data): ComponentSchema<Definition> {
  const { major } = data.root
  const { reference } = data.component
  const { definition, exception } = data.context

  const schemaArray: SchemaArray = {
    type: 'array',
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

  deserialize (value: any): Result {
    // TODO: this function
    return new Result<any>(null)
  }

  discriminate (value: any): { key: string, name: string, schema: Schema | null } {

  }

  populate (value: any): Result {
    // TODO: this function
    return new Result<any>(null)
  }

  random (value: any): Result {
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

  static dataType = schemaDataType

  static hook (type: HookName, handler: HookHandler): void {
    const index = hookStore[type].indexOf(handler)
    if (index === -1) hookStore[type].push(handler)
  }

  static unhook (type: HookName, handler: HookHandler): void {
    const index = hookStore[type].indexOf(handler)
    if (index !== -1) hookStore[type].splice(index, 1)
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}

export function runHooks (type: HookName, value: any, schema: Schema, exception: Exception, checkForErrors = false): HookHandlerResult {
  const hooks = hookStore[type]
  const length = hooks.length
  const hasError = checkForErrors && length > 0 ? exception.hasException : false
  let newValue: any = value

  if (!hasError) {
    for (let i = 0; i < length; i++) {
      const result = hooks[i](newValue, schema, exception)
      if (result !== undefined) {
        const hasErrorReturned = result.hasError === true || (result.hasError === undefined && exception.hasException)
        if ('value' in result) newValue = result.value
        if (result.done || hasErrorReturned) {
          return {
            done: result.done || hasErrorReturned,
            hasError: hasErrorReturned,
            value: newValue
          }
        }
      }
    }
  }

  return {
    done: hasError,
    hasError,
    value: newValue
  }
}
