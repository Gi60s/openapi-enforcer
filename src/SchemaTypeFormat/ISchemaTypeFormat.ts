import { ExceptionStore } from '../Exception/ExceptionStore'
import { ISchema2, ISchema3 } from '../components'
import { ISchemaSchemaProcessor } from '../components/IInternalTypes'

export type ISchema = ISchema2 | ISchema3

export interface ISchemaTypeFormat<Serialized, Deserialized> {

  /**
   * A list of constructors that use this schema type formatter.
   */
  constructors: Function[]

  /**
   * Define additional schema validations for this type format.
   * @param data
   */
  definitionValidator: (data: ISchemaSchemaProcessor) => void

  /**
   * Take a serialized value and deserialize it.
   * @param exceptionStore
   * @param schema
   * @param value
   */
  deserialize: (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized | Serialized) => Deserialized

  /**
   * If the deserialized value can be represented as a number, then include a numberValueOf function.
   * Having this function means that the schema for this type format can have a minimum, maximum, and multipleOf.
   */
  numberValueOf?: (value: Deserialized) => number

  /**
   * Generate a random deserialized value.
   * @param exceptionStore
   * @param schema
   * @param options
   */
  random: (exceptionStore: ExceptionStore, schema: ISchema, options?: unknown) => Deserialized

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
   * @param returns true if no exceptions were added, otherwise false
   */
  validate: (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized) => boolean
}
