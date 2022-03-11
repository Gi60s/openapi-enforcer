import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { Exception, DefinitionException } from '../../Exception'
import { OASComponent, componentValidate } from '../index'
import { Example } from './Example'
import { Schema } from './Schema'
import * as Core from '../Parameter'
import { Parameter3 as Definition } from '../helpers/definition-types'
import { Result } from '../../utils/Result'
import { parsePrimitive } from '../helpers/Parameter'

const rxLabel = /^\./
let parameterSchema: ComponentSchema<Definition>

export class Parameter extends OASComponent {
  extensions!: Record<string, any>
  name!: string
  in!: 'cookie' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  description?: string
  required?: boolean
  schema?: Schema

  // v3 properties
  allowReserved?: boolean
  deprecated?: boolean
  example?: any
  examples?: Record<string, Example>
  explode!: boolean
  style!: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'

  constructor (definition: Definition, version?: Version) {
    super(Parameter, definition, version, arguments[2])
  }

  /**
   * Get an example from the parameter if it exists, otherwise get the example from the schema if it exists,
   * otherwise get a randomly generated example.
   * @param [options] Optional, options for specifying how to get the example.
   * @param [options.allowRandom] Optional, whether to allow generating a random value for the example. This value will follow the {@link schema} if provided. Defaults to true unless the options.name property is specified.
   * @param [options.name] Optional, the name of the example to get. This is only applicable if the {@link examples} property is used. If the named example cannot be found an error will be thrown unless the option to allowRandom is specifically set to true.
   * @param [options.source] Optional, the first source to pull the example from. Defaults to the parameter example, then the schema example, then a randomly generated value.
   * @returns The example matching the type specified by your OpenAPI document.
   */
  getExample (options?: { allowRandom?: boolean, name?: string, source?: 'parameter' | 'random' | 'schema' }): any {
    // TODO: write this function
  }

  /**
   * Get the parameter's Schema object regardless of whether it is defined in the schema or content properties.
   * @returns {@link Schema} or undefined.
   */
  getSchema (): Schema | undefined {
    return Core.getSchema<Parameter, Schema>(this) as Schema
  }

  // the value is an array of all identified values (in case of query string this would be a `a=1&a=2` situation)
  parseValue (multiValue: string[]): Result<any> {
    const exception = new Exception('Unable to parse value')
    const value = multiValue[multiValue.length - 1]

    // make sure that the schema is specified, otherwise we can't parse
    if (this.schema === undefined) {
      exception.add.parameterParseNoSchema()
      return new Result(null, exception)
    }

    // make sure there is a value to parse
    if (value === undefined) {
      exception.add.parameterParseNoValue()
      return new Result(null, exception)
    }

    const { explode, style } = this
    const schema = this.schema?.enforcer.schema
    const { type } = schema ?? { type: '' }
    let parsed: any

    // if type is unknown then we can't continue
    if (schema === null) {
      exception.add.schemaIndeterminate('parseValue')
      return new Result(null, exception)
    }

    // if type is unknown then we can't continue
    if (type === '' || type === undefined) {
      exception.add.schemaIndeterminateType('parseValue')
      return new Result(null, exception)
    }

    // style: deepObject
    if (style === 'deepObject') {
      const rx = RegExp('(?:^|&)' + this.name + '\\[([^\\]]+)\\](?:=([^&]*))?', 'g')
      const result: Record<string, string> = {}
      let match
      let hasValue = false
      while ((match = rx.exec(value)) !== null) {
        hasValue = true
        result[match[1]] = match[2]
      }
      if (hasValue) parsed = result

    // style: form
    } else if (style === 'form') {
      if (type === 'array') {
        if (explode) {
          parsed = multiValue
        } else {
          parsed = value.split(',')
        }
      } else if (type === 'object') {
        if (explode) {
          const result = objectExploded('&', '=', '&' + value)
          if (result !== undefined) {
            parsed = {}
            Object.keys(result).forEach(name => {
              if (schema.additionalProperties !== false || (schema.properties?.[name] !== undefined)) {
                parsed[name] = result[name]
              }
            })
          }
        } else {
          const result = objectFlattened(',', value)
          if (result === undefined) parsed = result
        }
      } else {
        parsed = value
      }

    // style: label
    } else if (style === 'label') {
      if (rxLabel.test(value)) {
        if (type === 'array') {
          parsed = value.substr(1).split(explode ? '.' : ',')
        } else if (type === 'object') {
          parsed = explode
            ? objectExploded('.', '=', value)
            : objectFlattened(',', value.substr(1))
        } else {
          parsed = value.substr(1)
        }
      }

    // style: matrix
    } else if (style === 'matrix') {
      const name = this.name
      const rx = RegExp('^;' + name + '(?:=|$)')
      if (type === 'array') {
        if (explode) {
          const result = arrayExploded(';', '=', name, value.substr(1))
          if (result != null) parsed = result
        } else {
          parsed = value.substr(name.length + 2).split(',')
        }
      } else if (type === 'object') {
        if (explode || rx.test(value)) {
          const result = explode
            ? objectExploded(';', '=', value)
            : objectFlattened(',', value.substr(name.length + 2))
          if (result != null) parsed = result
        }
      } else if (rx.test(value)) {
        parsed = value.substr(name.length + 2)
      }

    // style: pipeDelimited
    } else if (style === 'pipeDelimited') {
      parsed = explode ? multiValue : delimited(type as string, '|', value)

    // style: simple
    } else if (style === 'simple') {
      if (type === 'array') {
        parsed = value.split(',')
      } else if (type === 'object') {
        parsed = explode
          ? objectExploded(',', '=', ',' + value)
          : objectFlattened(',', value)
      } else {
        parsed = value
      }

    // style: spaceDelimited
    } else if (style === 'spaceDelimited') {
      parsed = explode ? multiValue : delimited(type as string, ' ', value)
    }

    if (parsed === undefined) {
      exception.add.parameterParseStyle(style, type as string, explode)
    } else if (type === 'array' && schema.items !== undefined) {
      parsed = parsed.map((v: string, i: number) => {
        return parsePrimitive(schema.items as Schema, exception.at(i), v)
      })
    } else if (type === 'object') {
      Object.keys(parsed).forEach(key => {
        if (schema?.properties?.[key] !== undefined) {
          parsed[key] = parsePrimitive(schema.properties[key], exception.at(key), parsed[key])
        } else if (typeof schema?.additionalProperties === 'object') {
          parsed[key] = parsePrimitive(schema.additionalProperties, exception.at(key), parsed[key])
        }
      })
    } else {
      parsed = parsePrimitive(schema, exception, parsed)
    }

    return new Result(parsed, exception)
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#parameter-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#parameter-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#parameter-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#parameter-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (parameterSchema === undefined) {
      parameterSchema = Core.schemaGenerator(3, {
        Parameter,
        Schema: Schema
      }) as ComponentSchema<Definition>
    }
    return parameterSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}

function arrayExploded (setDelimiter: string, valueDelimiter: string, name: string, value: string): string[] | undefined {
  const ar = value.split(setDelimiter)
  const length = ar.length
  const result: string[] = []
  for (let i = 0; i < length; i++) {
    const set = ar[i].split(valueDelimiter)
    if (set[0] === name) {
      result.push(set[1])
    } else {
      return
    }
  }
  return result
}

function delimited (type: string, delimiter: string, value: string): any {
  if (type === 'array') {
    return value.split(delimiter)
  } else if (type === 'object') {
    return objectFlattened(delimiter, value)
  }
}

function objectExploded (setDelimiter: string, valueDelimiter: string, value: string): Record<string, string> | undefined {
  const str = 's([^v]+)v([^s]+)?'
  const rx = RegExp(str.replace(/v/g, valueDelimiter).replace(/s/g, setDelimiter), 'g')
  const result: Record<string, string> = {}
  let match
  let offset = 0
  while ((match = rx.exec(value)) !== null) {
    result[match[1]] = match[2] ?? ''
    offset = match.index + match[0].length
  }
  if (offset !== value.length) return
  return result
}

function objectFlattened (delimiter: string, value: string): Record<string, string> | undefined {
  const result: Record<string, string> = {}
  const ar = value.split(delimiter)
  const length = ar.length

  if (length % 2 !== 0) return
  for (let i = 1; i < length; i += 2) {
    result[ar[i - 1]] = ar[i]
  }
  return result
}
