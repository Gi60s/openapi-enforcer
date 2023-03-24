import { ISchema, ISchemaTypeFormat } from './ISchemaTypeFormat'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { SchemaTypeFormat } from './SchemaTypeFormat'
import rx from '../rx'

export class BinaryTypeFormat extends SchemaTypeFormat implements ISchemaTypeFormat<string, ArrayBuffer> {
  constructor () {
    super()
    this.isNumeric = false
    this.constructors = [ArrayBuffer]
  }

  deserialize (exceptionStore: ExceptionStore, schema: ISchema, value: ArrayBuffer | string): ArrayBuffer {
    if (value instanceof ArrayBuffer) {
      return value
    } else if (typeof value === 'string' && rx.binary.test(value)) {
      const buffer = new ArrayBuffer(value.length * 2)
      const view = new Uint16Array(buffer)
      const length = value.length
      for (let i = 0; i < length; i++) {
        view[i] = value.charCodeAt(i)
      }
      return buffer
    } else {
      exceptionStore.add({
        code: 'SCHEMA_NOT_DESERIALIZABLE',
        id: 'SCHEMA',
        level: 'error',
        locations: [],
        metadata: {
          reason: 'The value was not a string of zero and one values.'
        }
      })
      return new ArrayBuffer(0)
    }
  }

  random (exceptionStore: ExceptionStore, schema: ISchema, options: unknown | undefined): ArrayBuffer {
  }

  runSchemaDefinitionValidations (exceptionStore: ExceptionStore, schema: ISchema, value: any): void {
  }

  serialize (exceptionStore: ExceptionStore, schema: ISchema, value: ArrayBuffer | string): string {
    if (value instanceof ArrayBuffer) {
      return String.fromCharCode(...new Uint16Array(value))
    } else if (typeof value === 'string' && rx.binary.test(value)) {
      return value
    } else {
      exceptionStore.add({
        code: 'SCHEMA_NOT_SERIALIZABLE',
        id: 'SCHEMA',
        level: 'error',
        locations: [],
        metadata: {
          reason: 'The value was not an ArrayBuffer.'
        }
      })
      return ''
    }
  }

  validate (exceptionStore: ExceptionStore, schema: ISchema, value: ArrayBuffer): boolean {
  }

}
