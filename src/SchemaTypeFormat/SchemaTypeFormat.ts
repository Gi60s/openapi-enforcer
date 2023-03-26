import { ISchemaTypeFormat, ISchema } from './ISchemaTypeFormat'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { ISchemaSchemaProcessor } from '../components/IInternalTypes'

export abstract class SchemaTypeFormat<Serialized=string, Deserialized=object> implements ISchemaTypeFormat<Serialized, Deserialized> {
  public constructors: Function[]

  protected constructor () {
    this.constructors = []
  }

  abstract definitionValidator (data: ISchemaSchemaProcessor): void

  abstract deserialize (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized | Serialized): Deserialized

  abstract random (exceptionStore: ExceptionStore, schema: ISchema, options?: unknown): Deserialized

  abstract serialize (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized | Serialized): Serialized

  abstract validate (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized): void

  protected valueIsOneOfConstructors (value: any): boolean {
    if (value === null || typeof value !== 'object') return false
    const length = this.constructors.length
    for (let i = 0; i < length; i++) {
      if (value instanceof this.constructors[i]) return true
    }
    return false
  }
}
