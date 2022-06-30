import { IDiscriminateResult, IDiscriminator } from './IDiscriminator'
import { EnforcerData } from '../index'
import { IExternalDocumentation } from './IExternalDocumentation'
import { IXml } from './IXml'

export interface PartialSchema<Items> {
  enforcer: EnforcerData<Items, SchemaEnforcerData>
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

export interface SchemaEnforcerData {
  populate?: {
    condition?: string // The name of the parameter to check for truthy value before populating the value
    default?: any // When populating, overwrite the schema default with this value. If the type is a string then replacement may occur.
    id?: string // The parameter name to use to find the replacement value. String replacement will not occur.
    replacement?: 'colon' | 'doubleHandlebar' | 'handlebar' | 'none' // Set to none to skip parameter replacement.
    useDefault?: boolean // Set to false to prevent the default value from being used during populate.
  }
}

interface ISchema<Schema> extends PartialSchema<Schema> {
  enforcer: EnforcerData<Schema, SchemaEnforcerData> & {
    schema: Schema | null // null if property "not" is in use at top level
  }

  extensions: Record<string, any>
  additionalProperties?: Schema | boolean
  allOf?: Schema[]
  description?: string
  example?: any
  externalDocs?: IExternalDocumentation
  maxProperties?: number
  minProperties?: number
  properties?: Record<string, Schema>
  readOnly?: boolean
  required?: string[]
  title?: string
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  xml?: IXml

  discriminate: <Schema>(value: any) => IDiscriminateResult<Schema>
}

export interface ISchema2 extends ISchema<ISchema2> {
  discriminator?: string
}

export interface ISchema3 extends ISchema<ISchema3> {
  discriminator?: IDiscriminator
  anyOf?: ISchema3[]
  deprecated?: boolean
  not?: ISchema3
  nullable?: boolean
  oneOf?: ISchema3[]
  writeOnly?: boolean
}
