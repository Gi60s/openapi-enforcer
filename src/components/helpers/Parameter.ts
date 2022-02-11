import { Items } from '../v2/Items'
import { Exception } from '../../Exception'
import { getDataTypeDefinition } from './schema-data-types'
import { Schema as Schema3 } from '../v3/Schema'
import { Parameter as Parameter2 } from '../v2/Parameter'

export function parsePrimitive (parameter: Parameter2 | Schema3 | Items, exception: Exception, value: string): any {
  const type = parameter.type
  if (value === '') {
    if ('allowEmptyValue' in parameter && parameter.allowEmptyValue === true) return value
    exception.message('PARA_PARS_NO_EMPTY_VALUE', 'Empty value not allowed.', { parameter })
  } else if (type === 'boolean' || type === 'integer' || type === 'number' || type === 'string') {
    const dataType = getDataTypeDefinition(type, parameter.format)
    if (dataType !== undefined) {
      try {
        return dataType.deserialize(value, parameter as unknown as Schema3)
      } catch (e: any) {
        exception.message('TYPE_FORMAT_UNKNOWN', e.message, { type, format: parameter.format })
      }
    }
  } else {
    throw Error('Non primitive cannot be parsed by the parsePrimitive function')
  }
}
