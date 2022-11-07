import { IComponentClass } from './IComponent'
import { ISchemaProcessor } from './ISchemaProcessor'

export interface IAny extends Base<any> {
  type: 'any'
}

export interface IArray<T> extends Base<T[]> {
  type: 'array'
  items: ISchema
  maxItems?: number
  minItems?: number
}

interface Base<T> {
  // Set the default.
  default?: T

  // Get array of possible values.
  enum?: T[]

  // Determine if validation should be skipped.
  ignored?: false | string

  // Determine if value can be null
  nullable?: boolean
}

export interface IBoolean extends Base<boolean> {
  type: 'boolean'
}

export interface IComponent<Definition, Built> extends Base<Definition | Built> {
  type: 'component'
  allowsRef: boolean
  component: IComponentClass<Definition, Built>
}

// this interface is used only by component's getSchema() method which returns it
export interface IDefinition<Definition, Built> extends IObject {
  after?: (data: ISchemaProcessor<Definition, Built>, mode: 'build' | 'validate') => void // runs after build or validate functions
  build?: (data: ISchemaProcessor<Definition, Built>) => void
  validate?: (data: ISchemaProcessor<Definition, Built>) => void
}

export interface INumber extends Base<number> {
  type: 'number'
  integer?: boolean
  maximum?: number
  minimum?: number
}

export interface IOneOf extends Base<any> {
  type: 'oneOf'
  oneOf: Array<{
    condition: (data: ISchemaProcessor) => boolean
    schema: ISchema
  }>
  error: (data: ISchemaProcessor) => void // only called by validator, not builder
}

export interface IObject extends Base<Record<string, any>> {
  type: 'object'
  allowsSchemaExtensions: boolean
  additionalProperties?: ISchema
  properties?: IProperty[]
}

export interface IProperty<SchemaType=ISchema> {
  name: string
  notAllowed?: string | undefined // If this property could be allowed in certain circumstances but is not currently allowed then we provide a string here indicating why it is currently not allowed.
  required?: boolean
  schema: SchemaType
}

export interface IString extends Base<string> {
  type: 'string'
  maxLength?: number
  minLength?: number
}

export type ISchema = IAny | IArray<any> | IBoolean | IComponent<any, any> | INumber | IOneOf | IString | IObject
