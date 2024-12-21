import { IDiscriminator3, IDiscriminator3Definition } from './IDiscriminator'
import { IExternalDocumentation2, IExternalDocumentation3, IExternalDocumentation2Definition, IExternalDocumentation3Definition } from './IExternalDocumentation'
import { IReferenceDefinition } from './IReference'
import { IXml2, IXml3, IXml2Definition, IXml3Definition } from './IXml'
import { EnforcerData } from '../../index'

export interface IPartialSchema<Items> {
  enforcer: EnforcerData<Items, ISchemaEnforcer>
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Items
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
  pattern?: RegExp
  type?: string
  uniqueItems?: boolean
}

export interface IPartialSchemaDefinition<Items> {
  [key: `x-${string}`]: any
  'x-enforcer'?: ISchemaEnforcer
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Items
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number | string
  minimum?: number | string
  multipleOf?: number | string
  pattern?: string
  type?: string
  uniqueItems?: boolean
}

interface ISchemaEnforcer {
  populate?: {
    condition?: string // The name of the parameter to check for truthy value before populating the value
    default?: any // When populating, overwrite the schema default with this value. If the type is a string then replacement may occur.
    id?: string // The parameter name to use to find the replacement value. String replacement will not occur.
    replacement?: 'colon' | 'doubleHandlebar' | 'handlebar' | 'none' // Set to none to skip parameter replacement.
    useDefault?: boolean // Set to false to prevent the default value from being used during populate.
  }
}

interface ISchemaBase<Schema> extends IPartialSchema<Schema> {
  enforcer: EnforcerData<Schema, ISchemaEnforcer> & {
    schema: Schema | null // null if property "not" is in use at top level
  }

  extensions: Record<string, any>
  additionalProperties?: Schema | boolean
  allOf?: Schema[]
  description?: string
  example?: any
  externalDocs?: IExternalDocumentation2 | IExternalDocumentation3
  maxProperties?: number
  minProperties?: number
  properties?: Record<string, Schema>
  readOnly?: boolean
  required?: string[]
  title?: string
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  xml?: IXml2 | IXml3

  discriminate: <Schema>(value: any) => IDiscriminateResult<Schema>
}

export interface ISchema2 extends ISchemaBase<ISchema2> {
  discriminator?: string
  externalDocs?: IExternalDocumentation2
}

export interface ISchema3 extends ISchemaBase<ISchema3> {
  discriminator?: IDiscriminator3
  externalDocs?: IExternalDocumentation3
  anyOf?: ISchema3[]
  deprecated?: boolean
  not?: ISchema3
  nullable?: boolean
  oneOf?: ISchema3[]
  writeOnly?: boolean
}

interface ISchemaDefinitionBase<SchemaDefinition extends ISchema2Definition | ISchema3Definition> extends IPartialSchemaDefinition<SchemaDefinition> {
  additionalProperties?: SchemaDefinition | boolean
  allOf?: Array<SchemaDefinition | IReferenceDefinition>
  description?: string
  example?: any
  externalDocs?: IExternalDocumentation2Definition | IExternalDocumentation3Definition
  maxProperties?: number
  minProperties?: number
  properties?: Record<string, SchemaDefinition | IReferenceDefinition>
  readOnly?: boolean
  required?: string[]
  title?: string
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  xml?: IXml2Definition | IXml3Definition
}

export interface ISchema2Definition extends ISchemaDefinitionBase<ISchema2Definition> {
  discriminator?: string
  externalDocs?: IExternalDocumentation2Definition
  xml?: IXml2Definition
}

export interface ISchema3Definition extends ISchemaDefinitionBase<ISchema3Definition> {
  anyOf?: Array<ISchema3Definition | IReferenceDefinition>
  externalDocs?: IExternalDocumentation3Definition
  deprecated?: boolean
  discriminator?: IDiscriminator3Definition
  not?: ISchema3Definition | IReferenceDefinition
  nullable?: boolean
  oneOf?: Array<ISchema3Definition | IReferenceDefinition>
  writeOnly?: boolean
}

export interface IDiscriminateResult<T> {
  key: string
  name: string
  schema: T | null
}
