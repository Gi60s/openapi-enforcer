import { ISchemaProcessorData } from '../ISchemaProcessor'
import { IComponentSchemaObject, IComputeFunction } from '../IComponentSchema'
import { getDataTypeDefinition, getNoopTypeDefinition } from "./data-types";

interface ISchemaTypeProperties {
  array: string[]
  boolean: string[]
  integer: string[]
  number: string[]
  object: string[]
  string: string[]
}

// properties associated with each type
const schemaTypeProperties: ISchemaTypeProperties = {
  array: ['items', 'maxItems', 'minItems', 'uniqueItems'],
  boolean: [],
  integer: ['maximum', 'minimum', 'exclusiveMaximum', 'exclusiveMinimum', 'multipleOf'],
  number: ['maximum', 'minimum', 'exclusiveMaximum', 'exclusiveMinimum', 'multipleOf'],
  object: ['additionalProperties', 'discriminator', 'maxProperties', 'minProperties', 'properties'],
  string: ['maxLength', 'minLength', 'pattern']
}

// all possible schema property names
const schemaPropertyNames = Object.keys(schemaTypeProperties)
  .reduce((store: string[], type: string) => {
    const properties = schemaTypeProperties[type as keyof ISchemaTypeProperties]
    properties.forEach(property => {
      if (store.indexOf(property) === -1) store.push(property)
    })
    return store
  }, [])


export function getBaseSchema (data: ISchemaProcessorData, ReferenceComponentClass: any): IComponentSchemaObject {
  const { definition } = data

  const type: string | undefined = 'type' in definition
    ? definition.type
    : (() => {
      if ('additionalProperties' in definition ||
        'discriminator' in definition ||
        'maxProperties' in definition ||
        'minProperties' in definition ||
        'properties' in definition) return 'object'

      if ('exclusiveMaximum' in definition ||
        'exclusiveMinimum' in definition ||
        'maximum' in definition ||
        'minimum' in definition ||
        'multipleOf' in definition) return 'number'

      if ('items' in definition ||
        'maxItems' in definition ||
        'minItems' in definition ||
        'uniqueItems' in definition) return 'array'

      if ('maxLength' in definition ||
        'minLength' in definition ||
        'pattern' in definition) return 'string'
    })()
  const format: string | undefined = definition.format
  const dataType = type !== undefined
    ? getDataTypeDefinition(type, format) ?? getNoopTypeDefinition()
    : { toNumber: null }

  const isArray = type === 'array'
  const isString = type === 'string'
  const isNumeric = type === 'number' || definition.type === 'integer'

  const notAllowedUnlessArray: IComputeFunction<string | undefined> = function (this: { name: string }): string | undefined {
    return isArray === true ? undefined : 'Property "type" must equal "array" to use property "' + this.name + '".'
  }

  const notAllowedUnlessNumeric: IComputeFunction<string | undefined> = function (this: { name: string }): string | undefined {
    return isNumeric === true ? undefined : 'Property "type" must be numeric to use property "' + this.name + '".'
  }

  const notAllowedUnlessString: IComputeFunction<string | undefined> = function (this: { name: string }): string | undefined {
    return isString === true ? undefined : 'Property "type" must equal "string" to use property "' + this.name + '".'
  }

  return {
    type: 'object',
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'type',
        schema: {
          type: 'string',
          enum: ['array', 'boolean', 'integer', 'number', 'string'],
          default: type
        }
      },
      {
        name: 'format',
        notAllowed: type === undefined
          ? 'Format cannot be specified unless a type is specified.'
          : type === 'array' || type === 'object' ? 'Format cannot be specified for type ' + (type as string) + '.' : undefined,
        schema: {
          type: 'string'
        }
      },
      {
        name: 'enum',
        schema: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'any'
          }
        }
      },
      {
        name: 'exclusiveMaximum',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'exclusiveMinimum',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'items',
        notAllowed: notAllowedUnlessArray,
        required ({ cache }) {
          return cache.isArray as boolean
        },
        schema: {
          type: 'component',
          allowsRef: true,
          component: ReferenceComponentClass
        }
      },
      {
        name: 'maximum',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'any' // The type is "any" because a string can be numeric given the proper format (ex: date, date-time)
        }
      },
      {
        name: 'maxItems',
        notAllowed: notAllowedUnlessArray,
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'maxLength',
        notAllowed: notAllowedUnlessString,
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'minimum',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'any' // The type is "any" because a string can be numeric given the proper format (ex: date, date-time)
        }
      },
      {
        name: 'minItems',
        notAllowed: notAllowedUnlessArray,
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'minLength',
        notAllowed: notAllowedUnlessString,
        schema: {
          type: 'number',
          integer: true,
          minimum: 0
        }
      },
      {
        name: 'multipleOf',
        notAllowed: notAllowedUnlessNumeric,
        schema: {
          type: 'any' // The type is "any" because a string can be numeric for specific type format combinations
        }
      },
      {
        name: 'pattern',
        notAllowed: notAllowedUnlessString,
        schema: {
          type: 'string'
        }
      },
      {
        name: 'uniqueItems',
        notAllowed: notAllowedUnlessArray,
        schema: {
          type: 'boolean'
        }
      },
      {
        name: 'default',
        schema: {
          type: 'any'
        }
      }
    ],
    builder: {
      after (data: BuilderData) {
        data.root.lastly.push(() => {
          const { built } = data.context

          if (built.default !== undefined) built.default = deserialize(built, built.default)

          if (built.enum !== undefined) {
            built.enum = built.enum.map((item: any) => deserialize(built, item))
          }

          if (built.maximum !== undefined) built.maximum = deserialize(built, built.maximum)
          if (built.minimum !== undefined) built.minimum = deserialize(built, built.minimum)
          if (built.multipleOf !== undefined) built.multipleOf = deserialize(built, built.multipleOf)

          if (built.pattern !== undefined) built.pattern = new RegExp(built.pattern)
        })
      }
    },
    validator: {
      after (data: ValidatorData) {
        const { root, context } = data
        const { built, exception } = context
        const { cache, definition } = data.component

        if (built.type === 'array') {
          validateMaxMin(data, 'minItems', 'maxItems')
        } else if (cache.isNumeric as boolean) {
          root.lastly.push(() => {
            if (!exception.hasError) {
              const schema = new ReferenceComponentClass(definition)

              // validate that maximum and minimum don't conflict
              if (schema.minimum !== undefined && schema.maximum !== undefined) {
                const exclusive = schema.exclusiveMinimum === true || schema.exclusiveMaximum === true
                if (schema.minimum > schema.maximum || (exclusive && schema.minimum === schema.maximum)) {
                  exception.add.invalidMaxMin(data,
                    [
                      { node: definition, key: 'minimum', type: 'value' },
                      { node: definition, key: 'maximum', type: 'value' }
                    ],
                    definition.minimum, definition.maximum, 'minimum', 'maximum', exclusive)
                }
              }

              // validate multiple of is greater than zero
              if (schema.multipleOf === 0) {
                exception.at('multipleOf').add.exceedsNumberBounds(data, { key: 'multipleOf', type: 'value' }, 'minimum', false, 0, definition.multipleOf)
              }

              // warn if minimum or maximum are not multiples of multipleOf
              if (schema.multipleOf !== undefined) {
                if (schema.minimum !== undefined && schema.minimum % schema.multipleOf !== 0) {
                  exception.at('minimum').add.constraintIsNotAMultiple(data, { key: 'minimum', type: 'value' }, 'minimum', definition.minimum, definition.multipleOf)
                }
                if (schema.maximum !== undefined && schema.maximum % schema.multipleOf !== 0) {
                  exception.at('maximum').add.constraintIsNotAMultiple(data, { key: 'maximum', type: 'value' }, 'maximum', definition.maximum, definition.multipleOf)
                }
              }
            }
          })
        } else if (built.type === 'string') {
          validateMaxMin(data, 'minLength', 'maxLength')
        }

        if ('default' in built || 'enum' in built) {
          root.lastly.push((data: ValidatorData) => {
            if (!exception.hasError) {
              const schema = new ReferenceComponentClass(built, root.version) as Schema

              if ('default' in built) {
                const subException = schema.validate(built.default)
                if (subException.hasError) {
                  exception.at('default').add.defaultValueDoesNotMatchSchema(data, { node: definition, key: 'default', type: 'value' }, built.default, subException)
                }
              }

              if ('enum' in built) {
                built.enum.forEach((item: any, i: number) => {
                  const subException = schema.validate(item)
                  if (subException.hasError) {
                    exception.at('enum').at(i).add.enumValueDoesNotMatchSchema(data, { node: definition.enum, key: i, type: 'value' }, item, subException)
                  }
                })
              }
            }
          })
        }

        if (built.format !== undefined) {
          const type = built.type
          const format = built.format
          const dataType = getDataTypeDefinition(type, format)
          if (dataType === undefined || dataType.format !== format) {
            exception.at('format').add.unknownTypeFormat(data, { node: definition, key: 'format', type: 'value' }, type, format)
          }
        }
      }
    }
  })
}
