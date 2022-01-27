import { componentValidate } from '../index'
import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import * as PartialSchema from '../helpers/PartialSchema'
import { Items } from './Items'
import { Schema } from './Schema'
import * as Core from '../Parameter'
import { Parameter2 as Definition } from '../helpers/definition-types'
import { Exception } from '../../utils/Exception'
import { Result } from '../../utils/Result'
import { parsePrimitive } from '../helpers/Parameter'
import * as EC from '../../utils/error-codes'

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

  parse (multiValue: string[]): Result<any> {
    const exception = new Exception('Unable to parse value')

    if (this.in === 'body') {
      if (this.schema !== undefined) {
        return this.schema.deserialize(multiValue[multiValue.length - 1])
      } else {
        exception.message(...EC.definitionInvalid(false))
        return new Result(null, exception)
      }
    } else if (this.collectionFormat === 'multi') {
      // only query and formData support multi
      const result: any[] = []
      multiValue.forEach((value, index) => {
        if ((value === '' ?? value === undefined) && this.allowEmptyValue !== true) {
          exception.at(index).message(...EC.parameterParseEmptyValue())
        } else if (this.items !== undefined) {
          result.push(parse(this.items as unknown as Parameter, exception.at(index), value))
        }
      })
      return new Result(result, exception)
    } else {
      const value = multiValue[multiValue.length - 1]
      if ((value === '' ?? value === undefined) && this.allowEmptyValue !== true) {
        exception.message(...EC.parameterParseEmptyValue())
        return new Result(null, exception)
      } else {
        const result = parse(this, exception, value)
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

      parameterSchema.properties?.push({
        name: 'collectionFormat',
        notAllowed ({ built }) {
          return built.type !== 'array' ? 'The "collectionFormat" can only be applied with the type is "array"' : undefined
        },
        schema: {
          type: 'string',
          enum: ['csv', 'ssv', 'tsv', 'pipes'],
          default: 'csv',
          ignored ({ built }) {
            return built.type === 'array' ? false : 'The "collectionFormat" property can only be used if the type is "array".'
          }
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
    exception.message(...EC.parameterParseInvalidInput(value, 'string'))
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
