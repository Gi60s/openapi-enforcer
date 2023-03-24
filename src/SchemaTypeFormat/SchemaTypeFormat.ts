import { ISchemaTypeFormat, ISchema } from './ISchemaTypeFormat'
import { ExceptionStore } from '../Exception/ExceptionStore'

export abstract class SchemaTypeFormat<Serialized=string, Deserialized=object> implements ISchemaTypeFormat<Serialized, Deserialized> {
  public constructors: Function[]
  public isNumeric: boolean

  protected constructor () {
    this.isNumeric = false
    this.constructors = []
  }

  abstract deserialize (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized | Serialized): Deserialized

  abstract random (exceptionStore: ExceptionStore, schema: ISchema, options?: unknown): Deserialized

  abstract runSchemaDefinitionValidations (exceptionStore: ExceptionStore, schema: ISchema, value: any): void

  abstract serialize (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized | Serialized): Serialized

  abstract validate (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized): boolean

  protected valueIsOneOfConstructors (value: any): boolean {
    if (value === null || typeof value !== 'object') return false
    const length = this.constructors.length
    for (let i = 0; i < length; i++) {
      if (value instanceof this.constructors[i]) return true
    }
    return false
  }
}
