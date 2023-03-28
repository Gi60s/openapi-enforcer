import { ISchema, ISchemaTypeFormat } from './ISchemaTypeFormat'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { SchemaTypeFormat } from './SchemaTypeFormat'
import rx from '../rx'
import * as R from '../random'
import { validateMaxMin } from '../components/Schema/common'
import { ISchemaSchemaProcessor } from '../components/IInternalTypes'
import { getLocation } from '../Loader'

export class BinaryTypeFormat extends SchemaTypeFormat<string, ArrayBuffer> implements ISchemaTypeFormat<string, ArrayBuffer> {
  constructor () {
    super('string', 'binary', [ArrayBuffer])
  }

  definitionValidator (data: ISchemaSchemaProcessor): void {
    const { exception, definition } = data
    if (definition.maxLength !== undefined && definition.maxLength % 8 !== 0) {
      exception.add({
        code: 'SCHEMA_TYPE_FORMAT_BINARY_LENGTH',
        id: 'SCHEMA',
        level: 'error',
        locations: [getLocation(definition, 'maxLength', 'value')],
        metadata: {
          lengthProperty: 'maxLength'
        }
      })
    }
    if (definition.minLength !== undefined && definition.minLength % 8 !== 0) {
      exception.add({
        code: 'SCHEMA_TYPE_FORMAT_BINARY_LENGTH',
        id: 'SCHEMA',
        level: 'error',
        locations: [getLocation(definition, 'minLength', 'value')],
        metadata: {
          lengthProperty: 'minLength'
        }
      })
    }
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
          // TODO: this wont work for i18n - make more error codes to address this
          reason: 'The value was not a string of zero and one values.'
        }
      })
      return new ArrayBuffer(0)
    }
  }

  random (exceptionStore: ExceptionStore, schema: ISchema, options: unknown | undefined): ArrayBuffer {
    const size = R.number({ minimum: schema.minLength ?? 0, maximum: schema.maximum })
    const buffer = new ArrayBuffer(size)
    const uint16View = new Uint16Array(buffer)
    const length = uint16View.length
    for (let i = 0; i < length; i++) {
      uint16View[i] = Math.floor(Math.random() * 256)
    }
    return buffer
  }

  serialize (exceptionStore: ExceptionStore, schema: ISchema, value: ArrayBuffer | string): string {
    if (value instanceof ArrayBuffer) {
      return String.fromCharCode(...new Uint16Array(value))
    } else if (typeof value === 'string' && rx.binary.test(value)) {
      return value
    } else {
      exceptionStore.add({
        code: 'SCHEMA_NOT_SERIALIZABLE_TYPE',
        id: 'SCHEMA',
        level: 'error',
        locations: [],
        metadata: {
          expectedType: 'ArrayBuffer'
        }
      })
      return ''
    }
  }

  validate (exceptionStore: ExceptionStore, schema: ISchema, value: ArrayBuffer): boolean {
    if (!(value instanceof ArrayBuffer)) {
      exceptionStore.add({
        code: 'VALUE_TYPE_INVALID',
        id: 'SCHEMA',
        level: 'error',
        locations: [],
        metadata: {
          expectedType: 'ArrayBuffer',
          value
        }
      })
      return false
    } else {
      const exceptionData = validateMaxMin(exceptionStore, schema, 'binary length', 'maxLength',
        'minLength', true, 'error', value.byteLength, schema.maxLength, schema.minLength)
      return exceptionData === undefined
    }
  }
}
