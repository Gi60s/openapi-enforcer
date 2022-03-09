import { componentValidate, SchemaProperty, SchemaString } from '../index'
import { ComponentData, ComponentSchema, Data, Version } from '../helpers/builder-validator-types'
import { Exception, DefinitionException } from '../../Exception'
import * as PartialSchema from '../helpers/PartialSchema'
import { Items } from './Items'
import { Schema } from './Schema'
import * as Core from '../Parameter'
import { Parameter2 as Definition } from '../helpers/definition-types'
import { Result } from '../../utils/Result'
import { parsePrimitive } from '../helpers/Parameter'

let parameterSchema: ComponentSchema<Definition>

export class Parameter extends PartialSchema.PartialSchema<Items> {
  extensions!: Record<string, any>
  name!: string
  in!: 'body' | 'formData' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  description?: string
  required?: boolean
  schema?: Schema
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'

  constructor (definition: Definition, version?: Version) {
    super(Parameter, definition, version, arguments[2])
  }

  /**
   * Get an example from the schema if it exists, otherwise get a randomly generated example.
   * @param [options] Optional, options for specifying how to get the example.
   * @param [options.allowRandom] Optional, whether to allow generating a random value for the example. This value will follow the {@link schema} if provided. Defaults to true unless the options.name property is specified.
   * @param [options.source] Optional, the first source to pull the example from. Defaults to the parameter example, then the schema example, then a randomly generated value.
   * @returns The example matching the type specified by your OpenAPI document.
   */
  getExample (options?: { allowRandom?: boolean, source?: 'random' | 'schema' }): any {
    // TODO: write this function
  }

  /**
   * Parse and deserialize a value using the parameter's specification.
   *
   * Depending on whether a parameter exists in the path, query, cookies, body, headers, etc., some of these types of
   * parameters offer the ability to pass in multiple values while others do not. To simplify the caller this
   * function standardizes on always receiving an array of strings as its input.
   * @param value An array of values to parse.
   * @returns A {@link Result} object that resolves, depending on the parameter type, to a single value or an array of values. The type of the values is determined by your OpenAPI document.
   */
  parseValue (value: string[]): Result<any> {
    const exception = new Exception('Unable to parse value')

    if (this.in === 'body') {
      if (this.schema !== undefined) {
        return this.schema.deserialize(value[value.length - 1])
      } else {
        exception.add.definitionInvalid(false)
        return new Result(null, exception)
      }
    } else if (this.collectionFormat === 'multi') {
      // only query and formData support multi
      const result: any[] = []
      value.forEach((v, index) => {
        if ((v === '' ?? v === undefined) && this.allowEmptyValue !== true) {
          exception.at(index).add.parameterParseEmptyValue()
        } else if (this.items !== undefined) {
          result.push(parse(this.items as unknown as Parameter, exception.at(index), v))
        }
      })
      return new Result(result, exception)
    } else {
      const v = value[value.length - 1]
      if ((v === '' ?? v === undefined) && this.allowEmptyValue !== true) {
        exception.add.parameterParseEmptyValue()
        return new Result(null, exception)
      } else {
        const result = parse(this, exception, v)
        return new Result(result, exception)
      }
    }
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#parameter-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (parameterSchema === undefined) {
      parameterSchema = Core.schemaGenerator(2, {
        Parameter,
        Schema
      }) as ComponentSchema<Definition>

      // "file" is also allowed for the "type" property
      parameterSchema.adjustProperty('type', (schemaProperty: SchemaProperty) => {
        const enumFunction = 'enum' in schemaProperty.schema && typeof schemaProperty.schema.enum === 'function'
          ? schemaProperty.schema.enum
          : () => []
        // @ts-expect-error
        schemaProperty.schema.enum = (componentData: ComponentData) => {
          const values: string[] = enumFunction(componentData).slice(0)
          values.push('file')
          return values
        }
      })

      // parameterSchema.properties?.push({
      //   name: 'collectionFormat',
      //   notAllowed ({ built }) {
      //     return built.type !== 'array' ? 'The "collectionFormat" can only be applied with the type is "array"' : undefined
      //   },
      //   schema: {
      //     type: 'string',
      //     enum: ['csv', 'ssv', 'tsv', 'pipes'],
      //     default: 'csv',
      //     ignored ({ built }) {
      //       return built.type === 'array' ? false : 'The "collectionFormat" property can only be used if the type is "array".'
      //     }
      //   }
      // })

      parameterSchema.hook('after-validate', (data) => {
        const { built, chain, exception } = data.context
        if (built.type === 'file') {
          data.root.lastly.push(() => {
            const operationData = chain[1]
            if (built.in !== 'formData') {
              exception.at('type').add.parameterFileTypeConstraintsNotMet(data, { key: 'type', type: 'value' })
            } else if (operationData !== undefined) {
              const consumes: string[] = operationData.context.built.consumes ?? []
              if (!consumes.includes('multipart/form-data') && !consumes.includes('application/x-www-form-urlencoded')) {
                exception.at('type').add.parameterFileTypeConstraintsNotMet(data, { key: 'type', type: 'value' })
              }
            }
          })
        }
      })
    }

    return parameterSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}

function parse (parameter: Parameter | Items, exception: Exception, value: string): any {
  if (typeof value !== 'string') {
    exception.add.parameterParseInvalidInput(value, 'string')
    return
  }

  if (parameter.type === 'array') {
    let values: string[]
    if (parameter.collectionFormat === 'csv') {
      values = value.split(',')
    } else if (parameter.collectionFormat === 'pipes') {
      values = value.split('|')
    } else if (parameter.collectionFormat === 'ssv') {
      values = value.split(' ')
    } else if (parameter.collectionFormat === 'tsv') {
      values = value.split('\t')
    } else {
      throw Error('Collection format "' + String(parameter.collectionFormat) + '" cannot be handled by the parse function because it is not part of the items object: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject')
    }
    return values.map((value, index) => {
      return parameter.items !== undefined
        ? parse(parameter.items, exception.at(index), value)
        : value
    })
  } else {
    return parsePrimitive(parameter, exception, value)
  }
}
