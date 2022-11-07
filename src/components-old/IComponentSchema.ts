import { IComponentClass } from './IComponent'
import { ISchemaProcessor } from './ISchemaProcessor'

type Computed<T> = T | IComputeFunction<T>

export type IComputeFunction<T> = (compute: any) => T // TODO: update compute: any to type ComponentData

export type IComponentSchema = IComponentSchemaAny | IComponentSchemaArray | IComponentSchemaBoolean | IComponentSchemaComponent<any> | IComponentSchemaNumber | IComponentSchemaOneOf | IComponentSchemaString | IComponentSchemaObject

interface IComponentSchemaBase<T> {
  // Set the default.
  default?: Computed<T>

  // Get array of possible values.
  enum?: Computed<T[]>

  // Determine if validation should be skipped.
  ignored?: Computed<false | string>

  // Determine if value can be null
  nullable?: Computed<boolean>
}

export interface IComponentSchemaAny extends IComponentSchemaBase<any> {
  type: 'any'
}

export interface IComponentSchemaArray extends IComponentSchemaBase<any[]> {
  type: 'array'
  items: Computed<IComponentSchema>
  maxItems?: Computed<number>
  minItems?: Computed<number>
}

export interface IComponentSchemaBoolean extends IComponentSchemaBase<boolean> {
  type: 'boolean'
}

export interface IComponentSchemaComponent<T> extends IComponentSchemaBase<T> {
  type: 'component'
  allowsRef: Computed<boolean>
  component: IComponentClass<T, any>
}

interface IComponentSchemaConditional {
  condition: (data: ISchemaProcessor) => boolean
  schema: Computed<IComponentSchema>
}

export interface IComponentSchemaNumber extends IComponentSchemaBase<number> {
  type: 'number'
  integer?: Computed<boolean>
  maximum?: Computed<number>
  minimum?: Computed<number>
}

export interface IComponentSchemaOneOf extends IComponentSchemaBase<any> {
  type: 'oneOf'
  oneOf: IComponentSchemaConditional[]
  error: (data: ISchemaProcessor) => void // only called by validator, not builder
}

export interface IComponentSchemaString extends IComponentSchemaBase<string> {
  type: 'string'
  maxLength?: Computed<number>
  minLength?: Computed<number>
}

export interface IComponentSchemaObject extends IComponentSchemaBase<Record<string, any>> {
  type: 'object'
  allowsSchemaExtensions: Computed<boolean>
  additionalProperties?: Computed<IComponentSchema>
  properties?: IComponentSchemaProperty[]
}

export interface IComponentSchemaProperty<SchemaType=IComponentSchema> {
  name: string
  notAllowed?: Computed<string | undefined> // If this property could be allowed in certain circumstances but is not currently allowed then we provide a string here indicating why it is currently not allowed.
  required?: Computed<boolean>
  schema: Computed<SchemaType>
  versions?: string[]
}

// this interface is used only by component's getSchema() method which returns it
export interface IComponentSchemaDefinition<Definition, Built> extends IComponentSchemaObject {
  after?: (data: ISchemaProcessor<Definition, Built>, mode: 'build' | 'validate') => void // runs after build or validate functions
  build?: (data: ISchemaProcessor<Definition, Built>) => void
  validate?: (data: ISchemaProcessor<Definition, Built>) => void
}
