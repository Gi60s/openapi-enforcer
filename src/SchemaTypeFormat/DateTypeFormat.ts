import { ISchema, ISchemaTypeFormat } from './ISchemaTypeFormat'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { SchemaTypeFormat } from './SchemaTypeFormat'
import rx from '../rx'
import * as R from '../random'
import { validateMaxMin } from '../components/Schema/common'
import { ISchemaSchemaProcessor } from '../components/IInternalTypes'
import { getDateFromValidDateString } from '../util'
import { getLocation } from '../Loader'

export class DateTypeFormat extends SchemaTypeFormat<string, Date> implements ISchemaTypeFormat<string, Date> {

  constructor () {
    super('string', 'date', [Date])
  }

  definitionValidator (data: ISchemaSchemaProcessor): void {
    const { exception, definition } = data
    if (definition.maxLength !== undefined && definition.maxLength !== 10) {
      exception.add({
        code: 'SCHEMA_TYPE_FORMAT_DATE_LENGTH',
        id: 'SCHEMA',
        level: 'error',
        locations: [{ node: definition, key: 'maxLength', filter: 'value' }],
        metadata: { lengthProperty: 'maxLength' }
      })
    }
    if (definition.minLength !== undefined && definition.minLength !== 10) {
      exception.add({
        code: 'SCHEMA_TYPE_FORMAT_DATE_LENGTH',
        id: 'SCHEMA',
        level: 'error',
        locations: [{ node: definition, key: 'minLength', filter: 'value' }],
        metadata: { lengthProperty: 'minLength' }
      })
    }
  }

  deserialize (exceptionStore: ExceptionStore, schema: ISchema, value: Date | string): Date {
    if (value instanceof Date) {
      return value
    } else if (typeof value !== 'string' || !rx.date.test(value)) {
      exceptionStore.add({
        code: 'SCHEMA_TYPE_FORMAT_DATE_FORMAT',
        id: 'SCHEMA',
        level: 'error',
        locations: []
      })
      return new Date(0)
    } else {
      const date = getDateFromValidDateString('date', value)
      if (date === null) {
        exceptionStore.add({
          code: 'SCHEMA_TYPE_FORMAT_DATE_INVALID',
          id: 'SCHEMA',
          level: 'error',
          locations: [],
          metadata: { value }
        })
        return new Date(0)
      } else {
        return date
      }
    }
  }

  numberValueOf (value: Date | number): number {
    return +value
  }

  random (exceptionStore: ExceptionStore, schema: ISchema, options: unknown | undefined): Date {
    const number = R.number({
      maximum: schema.maximum,
      minimum: schema.minimum,
      range: 157248000000 // 5 years in milliseconds
    })
    return new Date(number)
  }

  serialize (exceptionStore: ExceptionStore, schema: ISchema, value: Date | string): string {
    if (value instanceof Date && !isNaN(+value)) {
      return value.toISOString().substring(0, 10)
    } else if (typeof value === 'string') {
      return value
    } else {
      return '1970-01-01' // the date when milliseconds equals zero
    }
  }

  validate (exceptionStore: ExceptionStore, schema: ISchema, value: Date): boolean {
    if (value instanceof Date && !isNaN(+value)) {
      exceptionStore.add({
        code: 'SCHEMA_TYPE_FORMAT_DATE_INVALID',
        id: 'SCHEMA',
        level: 'error',
        locations: [],
        metadata: { value }
      })
      return false
    } else {
      const maximum = schema.maximum !== undefined ? this.numberValueOf(schema.maximum) : undefined
      const minimum = schema.minimum !== undefined ? this.numberValueOf(schema.minimum) : undefined
      const exceptionData = validateMaxMin(exceptionStore, schema, 'date', 'maximum',
        'minimum', true, 'error', +value, maximum, minimum)
      return exceptionData === undefined
    }
  }
}
