import { ISchemaTypeFormat, ISchema } from './ISchemaTypeFormat'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { ISchemaSchemaProcessor } from '../components/IInternalTypes'

const typeFormatMap: Record<string, Record<string, ISchemaTypeFormat<any, any>>> = {}
const constructorsMap = new Map<Function, Array<ISchemaTypeFormat<any, any>>>()

export abstract class SchemaTypeFormat<Serialized=string, Deserialized=object> implements ISchemaTypeFormat<Serialized, Deserialized> {
  public readonly type: string
  public readonly format: string
  public readonly constructors: Function[]

  protected constructor (type: string, format: string, constructors: Function[]) {
    this.type = type
    this.format = format
    this.constructors = constructors

    if (typeFormatMap[type] === undefined) typeFormatMap[type] = {}
    if (typeFormatMap[type][format] === undefined) typeFormatMap[type][format] = this

    constructors.forEach(ctor => {
      const formatters = constructorsMap.get(ctor) ?? []
      if (!formatters.includes(this)) formatters.push(this)
      constructorsMap.set(ctor, formatters)
    })
  }

  abstract definitionValidator (data: ISchemaSchemaProcessor): void

  abstract deserialize (exceptionStore: ExceptionStore, schema: ISchema, value: Deserialized | Serialized): Deserialized

  abstract random (exceptionStore: ExceptionStore, schema: ISchema, options?: unknown): Deserialized

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
