import { ExceptionStore } from '../Exception/ExceptionStore'
import { ISchema2Definition, ISchema3Definition } from '../components'

export type ISchema = ISchema2Definition | ISchema3Definition

export interface ISchemaTypeFormat<Serialized, Deserialized> {

  /**
   * A list of constructors that use this schema type formatter.
   */
  constructors: Function[]

  /**
   * Take a serialized value and deserialize it.
   * @param exceptionStore
   * @param schema
   * @param value
   */
  deserialize: (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized | Serialized) => Deserialized

  /**
   * Whether the value is considered numeric in its deserialized state.
   * For example, a Date is numeric which allows you to set max and min values.
   */
  isNumeric: boolean

  /**
   * Generate a random deserialized value.
   * @param exceptionStore
   * @param schema
   * @param options
   */
  random: (exceptionStore: ExceptionStore, schema: ISchema, options?: unknown) => Deserialized

  /**
   * Additional validations to run with the schema definition.
   * @param definition
   */
  runSchemaDefinitionValidations: (exceptionStore: ExceptionStore, schema: ISchema, value: Serialized) => void

  /**
   * Take a deserialized value and serialize it.
   * @param exceptionStore
   * @param schema
   * @param value
   */
  serialize: (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized | Serialized) => Serialized

  /**
   * Add additional checks to see whether the value is valid for the schema.
   * @param exceptionStore
   * @param schema
   * @param value
   * @returns true if valid, false if one or more validation errors were found.
   */
  validate: (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized) => boolean
}
