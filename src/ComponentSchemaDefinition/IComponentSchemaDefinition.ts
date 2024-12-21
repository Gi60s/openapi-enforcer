import { SchemaProcessor } from './SchemaProcessor'
import { EnforcerComponent } from '../components/Component'
import * as I from '../components/IInternalTypes'
import { II18nMessageCode } from '../i18n/i18n'
import { IExceptionData } from '../Exception/IException'
import { ExceptionStore } from '../Exception/ExceptionStore'

export interface ISDAny extends Base<any> {
  type: 'any'
}

export interface ISDArray<T> extends Base<T[]> {
  type: 'array'
  items: ISDSchema
  // maxItems?: number
  // minItems?: number
}

interface Base<T> {
  // Is the property allowed? Based on sibling properties it may not be.
  notAllowed?: II18nMessageCode // the string is the message

  // Set the default.
  default?: T

  // Determine if validation should be skipped.
  ignored?: boolean

  // Determine if value can be null
  nullable?: boolean
}

export interface ISDBoolean extends Base<boolean> {
  type: 'boolean'
  enum?: boolean[]
}

export interface ISDComponent<Definition, Built> extends Base<Definition | Built> {
  type: 'component'
  allowsRef: boolean
  component: typeof EnforcerComponent<any>
}

// this interface is used only by component's getSchema() method which returns it
export interface ISDSchemaDefinition<Definition, Built extends I.IComponent> extends ISDObject {
  additionalProperties?: ISDSchema
  allowsSchemaExtensions: boolean
  build?: (data: SchemaProcessor<Definition, Built>) => void
  validate?: (data: SchemaProcessor<Definition, Built>) => void
}

export interface ISDNumber extends Base<number> {
  type: 'number'
  integer?: boolean
  maximum?: number
  minimum?: number
  enum?: number[]
}

export interface ISDOneOf<OneOfSchemaType=ISDSchema> extends Base<any> {
  type: 'oneOf'
  oneOf: Array<{
    condition: (definition: any, key: string, data: SchemaProcessor) => boolean
    schema: OneOfSchemaType
  }>
  // If no oneOf conditions are met then "error" will be used to generate an exception.
  // The string array is used for specifying allowed data types. The function is used for generating a
  // custom error.
  error: string[] | ((data: SchemaProcessor) => void)
}

export interface ISDObject<T=ISDSchema> extends Base<Record<string, any>> {
  type: 'object'
  additionalProperties?: T
  properties?: ISDProperty[]
}

export interface ISDProperty<SchemaType=ISDSchema> {
  name: string
  notAllowed?: II18nMessageCode | undefined // If this property could be allowed in certain circumstances but is not currently allowed then we provide a string here indicating why it is currently not allowed.
  required?: boolean
  schema: SchemaType
}

export interface ISDString extends Base<string> {
  type: 'string'
  enum?: string[]
  // maxLength?: number
  // minLength?: number
}

export type ISDSchema = ISDAny | ISDArray<any> | ISDBoolean | ISDComponent<any, any> | ISDNumber | ISDOneOf | ISDString | ISDObject
