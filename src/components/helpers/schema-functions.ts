import { Exception } from '../../utils/Exception'
import { runHooks, ValidateOptions, Schema as BaseSchema } from '../Schema'
import { Schema as Schema2 } from '../v2/Schema'
import { Schema as Schema3 } from '../v3/Schema'
import { isObject, same, smart } from '../../utils/util'

type Schema = Schema2 | Schema3

class MapItem<R> {
  private readonly data: { key: any, result?: R }

  constructor (key: any) {
    this.data = { key }
  }

  setResult (result: R): MapItem<R> {
    this.data.result = result
    return this
  }

  get key (): any {
    return this.data.key
  }

  get result (): R | undefined {
    return this.data.result
  }
}

export class MapStore<R> {
  private readonly map: Map<Schema, Array<MapItem<R>>>

  constructor () {
    this.map = new Map()
  }

  get (schema: Schema, key: any): MapItem<R> {
    let items = this.map.get(schema)
    if (items === undefined) {
      items = []
      this.map.set(schema, items)
    }

    const index = items.findIndex(item => item.key === key)
    if (index === -1) {
      const item = new MapItem<R>(key)
      items.push(item)
      return item
    } else {
      return items[index]
    }
  }
}

function maxMin (exception: Exception, schema: Schema, type: string, maxProperty: string, minProperty: string, exclusives: boolean, value: any, maximum: number, minimum: number): boolean {
  let valid = true
  if (maxProperty in schema) {
    // @ts-expect-error
    const max: any = schema[maxProperty]
    if (exclusives && schema.exclusiveMaximum === true && value >= maximum) {
      exception.message('Expected ' + type + ' to be less than ' +
        smart(schema.serialize(max).value) + '. Received: ' +
        smart(schema.serialize(value).value))
      valid = false
    } else if (value > maximum) {
      exception.message('Expected ' + type + ' to be less than or equal to ' +
        smart(schema.serialize(max).value) + '. Received: ' +
        smart(schema.serialize(value).value))
      valid = false
    }
  }

  if (minProperty in schema) {
    // @ts-expect-error
    const min: any = schema[minProperty]
    if (exclusives && schema.exclusiveMinimum === true && value <= minimum) {
      exception.message('Expected ' + type + ' to be greater than ' +
        smart(schema.serialize(min).value) + '. Received: ' +
        smart(schema.serialize(value).value))
      valid = false
    } else if (value < minimum) {
      exception.message('Expected ' + type + ' to be greater than or equal to ' +
        smart(schema.serialize(min).value) + '. Received: ' +
        smart(schema.serialize(value).value))
      valid = false
    }
  }
  return valid
}

export function validate (schema: Schema, value: any, map: MapStore<boolean>, exception: Exception, options: ValidateOptions): MapItem<boolean> {
  // watch for values that have already been validated against this value
  const mapped = map.get(schema, value)
  if (mapped.result !== undefined) return mapped

  const hookResult = runHooks('beforeValidate', value, schema, exception)
  if (hookResult.hasError === true) return mapped.setResult(false)
  value = hookResult.value
  if (hookResult.done) return mapped.setResult(true)

  // check for nullable
  if (value === null && (schema['x-nullable'] === true || ('nullable' in schema && schema.nullable === true))) {
    const hookResult = runHooks('afterValidate', value, schema, exception)
    return mapped.setResult(hookResult.hasError !== true)
  }

  let valid: boolean = true
  if ('allOf' in schema) {
    const child = exception.nest('Did not validate against all schemas')
    schema.allOf?.forEach((schema, index) => {
      const { result } = validate(schema, value, map, child, options)
      if (result === false) valid = false
    })
  } else if ('anyOf' in schema && schema.anyOf !== undefined) {
    if ('discriminator' in schema) {
      const { key, schema: childSchema } = schema.discriminate(value)
      if (childSchema === null) {
        exception.message(`Discriminator property "${key}" as "${String(value[key])}" did not map to a schema.`)
        valid = false
      } else {
        const { result } = validate(childSchema, value, map, exception.at(value[key]), options)
        if (result === false) valid = false
      }
    } else {
      const anyOfException = new Exception('Did not validate against at least one schema')
      const length = schema.anyOf.length
      let foundValidAnyOf = false
      for (let i = 0; i < length; i++) {
        const child = anyOfException.at(i)
        const { result } = validate(schema.anyOf[i], value, map, child, options)
        if (result === true) {
          foundValidAnyOf = true
          break
        }
      }
      if (!foundValidAnyOf) {
        exception.push(anyOfException)
        valid = false
      }
    }
  } else if ('not' in schema) {
    const { result } = validate(schema, value, map, new Exception(), options)
    if (result === true) {
      exception.message('Value should not validate against schema')
      valid = false
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      exception.message('Expected an array. Received: ' + smart(value))
      valid = false
    } else {
      const length = value.length
      if (schema.maxItems !== undefined && schema.maxItems < length) {
        exception.message('Too many items in the array. Maximum of ' + String(schema.maxItems) + '. Found ' + String(length) + ' items')
        valid = false
      }
      if (schema.minItems !== undefined && schema.minItems > length) {
        exception.message('Too few items in the array. Minimum of ' + String(schema.minItems) + '. Found ' + String(length) + ' items')
        valid = false
      }
      if (schema.uniqueItems === true) {
        const singles: any[] = []
        value.forEach((item, index) => {
          const length = singles.length
          let found = false
          for (let i = 0; i < length; i++) {
            if (same(item, singles[i])) {
              exception.message('Array items must be unique. Value is not unique at index: ' + String(index))
              found = true
              valid = false
              break
            }
          }
          if (!found) singles.push(item)
        })
      }
      if (schema.items !== undefined) {
        value.forEach((val, index) => {
          const { result } = validate(schema.items as Schema, val, map, exception.at(index), options)
          if (result === false) valid = false
        })
      }
    }
  } else if (schema.type === 'object') {
    if (!isObject(value)) {
      exception.message('Expected a non-null object. Received: ' + smart(value))
      valid = false
    } else {
      const properties = schema.properties ?? {}
      const keys = Object.keys(value)

      // determine which properties are required when considering readOnly or writeOnly status
      const readWriteMode = options.readWriteMode
      const readWriteOnly: string[] = []
      const required = schema.required !== undefined
        ? schema.required.filter(name => {
          const prop: Schema | undefined = properties[name]
          if (options.readWriteMode === undefined || prop === undefined) return true
          if (options.readWriteMode === 'write' && prop.readOnly === false) return true
          if (options.readWriteMode === 'read' && (prop as Schema3).writeOnly === false) return true
          return false
        })
        : []

      // validate each property in the value
      keys.forEach(key => {
        // remove item for required remaining array
        const index = required.indexOf(key)
        if (index !== -1) required.splice(index, 1)

        if (key in properties) {
          const prop = properties[key]
          if ((readWriteMode === 'write' && prop.readOnly === true) || (readWriteMode === 'read' && (prop as Schema3).writeOnly === true)) readWriteOnly.push(key)
          const { result } = validate(prop, value[key], map, exception.at(key), options)
          if (result === false) valid = false
        } else {
          if (schema.additionalProperties === false) {
            exception.at(key).message('Property not allowed')
            valid = false
          } else if (typeof schema.additionalProperties === 'object') {
            const prop = schema.additionalProperties
            if ((readWriteMode === 'write' && prop.readOnly === true) || (readWriteMode === 'read' && (prop as Schema3).writeOnly === true)) readWriteOnly.push(key)
            const { result } = validate(prop, value[key], map, exception.at(key), options)
            if (result === false) valid = false
          }
        }
      })

      // validate that all required are present
      if (required.length > 0) {
        exception.message('One or more required properties missing: ' + required.join(', '))
        valid = false
      }

      // validate that we only have readable or writable properties
      if (readWriteOnly.length > 0) {
        if (readWriteMode === 'write') {
          exception.message('Cannot write to read only properties: ' + readWriteOnly.join(', '))
          valid = false
        } else if (readWriteMode === 'read') {
          exception.message('Cannot read from write only properties: ' + readWriteOnly.join(', '))
          valid = false
        }
      }

      // validate number of properties
      const maxMinValid = maxMin(exception, schema, 'object property count', 'maxProperties', 'minProperties', false, keys.length, schema.maxProperties, schema.minProperties)
      if (!maxMinValid) valid = false

      // if a discriminator is present then validate discriminator mapping
      if (schema.discriminator !== undefined) {
        const details = schema.discriminate(value)
        if (details.schema != null) {
          const { result } = validate(details.schema, value, map, exception, options)
          if (result === false) valid = false
        } else if (details.name !== undefined) {
          exception.message('Discriminator property "' + details.key + '" as "' + details.name + '" did not map to a schema')
          valid = false
        } // else - already taken care of because it's a missing required error
      }
    }
  } else if (typeof schema.type === 'string') {
    // run data type validator
    const dataType = BaseSchema.dataType.getDefinition(schema.type, schema.format)
    if (dataType !== undefined && 'validate' in dataType) {
      // TODO: find a way to make the Exception fit in with the DefinitionException
      const result = dataType.validate({ exception, schema, value })
      if (result === false) valid = false
    }

    if (schema.type === 'boolean') {
      if (typeof value !== 'boolean') {
        exception.message('Expected a boolean. Received: ' + smart(value))
        valid = false
      }
    } else if (schema.type === 'integer') {
      // TODO: add logic
    } else if (schema.type === 'number') {
      // TODO: add logic
    } else if (schema.type === 'string') {
      // TODO: add logic
    }
  }

  if (schema.enum !== undefined && options.validateEnum !== false) {
    const length = schema.enum.length
    let found = false
    for (let i = 0; i < length; i++) {
      if (same(value, schema.enum[i])) {
        found = true
        break
      }
    }
    if (!found) {
      exception.message('Value ' + smart(value) + ' did not meet enum requirements')
      valid = false
    }
  }

  // if there are no exceptions so far then run afterValidate hooks
  if (valid) {
    const hookResult = runHooks('afterValidate', value, schema, exception, false)
    if (hookResult.hasError === true) valid = false
    if (hookResult.done) return mapped.setResult(true)
  }

  return mapped.setResult(valid)
}
