import { ISchema2Definition, ISchema3Definition, ISchema2, ISchema3, ISchemaValidatorsMap3 } from './ISchema'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { IExceptionData, IExceptionLevel } from '../../Exception/IException'
import * as I from '../IInternalTypes'
import * as C from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { getLocation } from '../../Loader'
import { deepEqual } from '../../util'

type IDefinition = ISchema2Definition | ISchema3Definition
type IDefinitionKeys = Array<keyof IDefinition>
type ISchema = ISchema2 | ISchema3

interface IAllOfData {
  definition: IDefinition
  value: any
}


const allOfMustBeEqualProperties = ['format', 'nullable', 'type', 'uniqueItems']
const allOfMinimumProperties = ['minimum', 'minLength', 'minItems', 'minProperties'] as IDefinitionKeys
const allOfMaximumProperties = ['maximum', 'maxLength', 'maxItems', 'maxProperties'] as IDefinitionKeys

const derivedDefinitionMap = new WeakMap<IDefinition, IDefinition>()

export function deserialize (value: string, options: { strict: boolean } | undefined): any {
  return null
}

export function determineSchemaType (definition: I.ISchemaDefinition | I.ISchema): 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string' | undefined {
  if (definition.type !== undefined) return definition.type
  if ('items' in definition ||
    'maxItems' in definition ||
    'minItems' in definition ||
    'uniqueItems' in definition ||
    Array.isArray(definition.default) ||
    Array.isArray(definition.enum?.[0])) return 'array'
  if ('additionalProperties' in definition ||
    'discriminator' in definition ||
    'properties' in definition ||
    'maxProperties' in definition ||
    'minProperties' in definition ||
    'required' in definition ||
    (typeof definition.default === 'object' && definition.default !== null) ||
    (typeof definition.enum?.[0] === 'object' && definition.enum[0] !== null)) return 'object'
  if ('maximum' in definition ||
    'minimum' in definition ||
    'exclusiveMaximum' in definition ||
    'exclusiveMinimum' in definition ||
    'multipleOf' in definition ||
    typeof definition.default === 'number' ||
    typeof definition.enum?.[0] === 'number') return 'number'
  if ('maxLength' in definition ||
    'minLength' in definition ||
    'pattern' in definition ||
    typeof definition.default === 'string' ||
    typeof definition.enum?.[0] === 'string') return 'string'
  if (typeof definition.default === 'boolean' ||
    typeof definition.enum?.[0] === 'boolean') return 'boolean'
}

export function discriminate<T extends ISchema> (value: object): { key: string, name: string, schema: T } {
  return {
    key: '',
    name: '',
    schema: {} as unknown as T
  }
}

export function schemaDefinition (processor: I.ISchemaSchemaProcessor,
  validators: I.ISchemaValidatorsMap2 | ISchemaValidatorsMap3,
  schema: C.ISchemaDefinition<I.ISchema2Definition, I.ISchema2> | C.ISchemaDefinition<I.ISchema3Definition, I.ISchema3>): void {
  const { definition, exception } = processor
  const type = determineSchemaType(definition)
  const ctor = processor.component.constructor

  const additionalProperties = validators.additionalProperties
  Object.defineProperty(additionalProperties, 'schema', {
    get (): C.IBoolean | C.IComponent<any, any> {
      const definition = processor.definition
      const value = definition.additionalProperties ?? true
      if (typeof value === 'boolean') {
        return { type: 'boolean', default: true }
      } else {
        return {
          type: 'component',
          allowsRef: true,
          component: ctor
        }
      }
    }
  })
  additionalProperties.notAllowed = type !== 'object' ? 'PROPERTY_NOT_ALLOWED_UNLESS_OBJECT' : undefined

  // TODO: type may be string and format may make it numeric, so due a numeric type lookup here
  validators.maximum.notAllowed = type !== 'number' && type !== 'integer' ? 'PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC' : undefined
  validators.minimum.notAllowed = type !== 'number' && type !== 'integer' ? 'PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC' : undefined
  validators.multipleOf.notAllowed = type !== 'number' && type !== 'integer' ? 'PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC' : undefined

  schema.validate = () => {
    const { definition } = processor

    const derived: IDefinition = Object.assign({}, definition, { type })
    derivedDefinitionMap.set(definition, derived)

    const isTypeExempt = ('allOf' in definition) || ('anyOf' in definition) || ('oneOf' in definition) || ('not' in definition)
    if (!isTypeExempt) {
      if (type === undefined) {
        exception.add({
          code: 'SCHEMA_TYPE_INDETERMINATE',
          id: ctor.id,
          level: 'error',
          locations: [processor.getLocation('value')],
          metadata: {}
        })
      } else if (!('type' in definition)) {
        exception.add({
          code: 'SCHEMA_TYPE_NOT_SPECIFIED',
          id: ctor.id,
          level: 'warn',
          locations: [processor.getLocation('value')],
          metadata: {
            determinedType: type
          }
        })
      }
    }

    if (Array.isArray(definition.allOf) && definition.allOf.length === 0) {
      exception.add({
        code: 'ARRAY_EMPTY',
        id: ctor.id,
        level: 'warn',
        locations: [processor.getLocation('value')],
        metadata: {}
      })
    }

    if (Array.isArray(definition.allOf)) {
      const allOf = (definition.allOf as IDefinition[]).filter((s: any) => !('$ref' in s))

      // first check that any properties that must be equal are equal
      ;(allOfMustBeEqualProperties as Array<keyof IDefinition>).forEach(key => {
        const conflicts: IAllOfData[] = []
        let hasConflicts = false
        allOf.forEach((definition, index) => {
          // it should always get the derived schema because it was set already during the validator of the child schema
          const schema = derivedDefinitionMap.get(definition) ?? definition
          if (key in schema) {
            const value = schema[key]
            if (derived[key] === undefined) derived[key] = value
            conflicts.push({ definition, value })
            if (index > 0 && !deepEqual(conflicts[0].value, value)) hasConflicts = true
          }
        })

        if (hasConflicts) {
          exception.add({
            code: 'SCHEMA_ALL_CONFLICT',
            id: ctor.id,
            level: 'error',
            locations: conflicts.map(conflict => getLocation(conflict.definition, key, 'value')),
            metadata: {
              propertyName: key,
              values: Array.from(new Set(conflicts.map(c => c.value)))
            }
          })
        }
      })

      if (derived.type === 'object') {
        const conflicts: IAllOfData[] = []
        allOfDeepObjectComparison(allOf, conflicts)
      }
    }
  }
}

/**
 * Get the property for a schema. If the property is not found then try to determine the property value, otherwise
 * use a default value.
 * @param schema
 * @param propertyName
 * @param defaultValue
 */
export function getSchemaProperty<T> (schema: IDefinition, propertyName: keyof IDefinition, defaultValue?: T): T | undefined {
  if (schema[propertyName] !== undefined) return schema[propertyName] as T
  if (Array.isArray(schema.allOf)) {
    const found = (schema.allOf as IDefinition[]).find(s => s[propertyName] !== undefined)
    if (found !== undefined) return found[propertyName] as T
  }
  return defaultValue
}

// /**
//  * Generate a schema definition object that has default properties added, allOf schemas merged, oneOf or anyOf schemas
//  * determined, etc.
//  * @param schema
//  * @param [hint] A value used to help determine the correct schema when using oneOf or anyOf.
//  */
// export function getNormalizedSchema (schema: ISchema2Definition | ISchema2, hint?: any): ISchema2Definition
// export function getNormalizedSchema (schema: ISchema3Definition | ISchema3, hint?: any): ISchema3Definition
// export function getNormalizedSchema (schema: Definition | ISchema, hint?: any): Definition {
//   if (schema.allOf !== undefined) {
//
//   } else if ('anyOf' in schema && schema.anyOf !== undefined) {
//
//   } else if ('oneOf' in schema && schema.oneOf !== undefined) {
//
//   } else {
//
//   }
// }

// export function getSchemaProperty<T=any> (schema: Definition, path: string[]): T | undefined {
//   let node: any = schema
//   const length = path.length
//   for (let i = 0; i < length; i++) {
//     node = node[path[i]]
//     if (node === undefined) return
//   }
//   return node as T
// }

// /**
//  * Given an object path, traverse schemas properties and additional properties to find the schema associated with the path.
//  * @param schema
//  * @param path
//  */
// export function getSchemaForObjectPath (schema: ISchema2Definition, path: string[]): ISchema2Definition | boolean
// export function getSchemaForObjectPath (schema: ISchema3Definition, path: string[]): ISchema3Definition | boolean
// export function getSchemaForObjectPath (schema: Definition, path: string[]): Definition | boolean {
//   const type = getSchemaProperty(schema, ['type'])
//   const key = path[0]
//
//   if (type === 'array' && rxNumber.test(key)) {
//
//   } else if (type === 'object') {
//     const property = getSchemaProperty(schema, ['properties', key]) ?? getSchemaProperty(schema, ['additionalProperties'])
//     if (property === true) return true
//     return getSchemaForObjectPath(property, path.slice(1))
//   } else {
//     return false
//   }
// }

export function serialize<T=any> (schema: ISchema, value: any, map = new Map<object, any[]>()): T {
  return null as unknown as T
  // const type = schema.type
  //
  // // handle cyclic serialization
  // if (typeof value === 'object' && value !== null) {
  //   const matches = map.get(schema)
  //   if (matches?.includes(value) === true) {
  //     return value
  //   } else {
  //     map.set(schema, [value])
  //   }
  // }
  //
  // const hookResult = hooks.runHooks(schema, 'beforeSerialize', value, exception)
  // value = hookResult.value
  // if (hookResult.done) return value
}

export function validateMaxMin (exceptionStore: ExceptionStore,
  schema: ISchema, valueDescription: string,
  maxPropertyName: string, minPropertyName: string,
  exclusives: boolean,
  level: IExceptionLevel,
  value: number, maximum: number | undefined, minimum: number | undefined): IExceptionData | undefined {
  if (maxPropertyName in schema && maximum !== undefined) {
    if ((exclusives && schema.exclusiveMaximum === true && value >= maximum) || value > maximum) {
      const data: IExceptionData = {
        code: schema.exclusiveMaximum === true
          ? 'VALUE_OUT_OF_RANGE_MAX_EXCLUSIVE'
          : 'VALUE_OUT_OF_RANGE_MAX',
        id: 'Schema',
        level,
        locations: [],
        metadata: {
          description: valueDescription,
          exclusive: true,
          maximum: schema.serialize((schema as any)[maxPropertyName]).value ?? (schema as any)[maxPropertyName],
          value: schema.serialize(value).value ?? value
        }
      }
      exceptionStore.add(data)
      return data
    }
  }

  if (minPropertyName in schema && minimum !== undefined) {
    if ((exclusives && schema.exclusiveMinimum === true && value <= minimum) || value < minimum) {
      const data: IExceptionData = {
        code: schema.exclusiveMinimum === true
          ? 'VALUE_OUT_OF_RANGE_MIN_EXCLUSIVE'
          : 'VALUE_OUT_OF_RANGE_MIN',
        id: 'Schema',
        level,
        locations: [],
        metadata: {
          exclusive: true,
          minimum: schema.serialize((schema as any)[maxPropertyName]).value ?? (schema as any)[maxPropertyName],
          value: schema.serialize(value).value ?? value
        }
      }
      exceptionStore.add(data)
      return data
    }
  }
}

function allOfDeepObjectComparison (schemas: IDefinition[], conflicts: IAllOfData[]) {
  schemas
    .filter(schema => determineSchemaType(schema) === 'object')
    .forEach(schema => {
      
    })
}

// property values that must be equal across all schemas
// format, type, uniqueItems, nullable

// property values that are ignored across schemas
// title, xml, externalDocs, deprecated

// gather minimums and use to compare against maximums
// only compare properties based on first determined type - if we determine the type is number then ignore "maxLength", "maxItems", "maxProperties"
// if type is number and minimum equals maximum and either exclusiveMinimum or exclusiveMaximum causes conflict then report it
// minimums: minimum, minLength, minItems, minProperties
// maximums: maximum, maxLength, maxItems, maxProperties


/*
allOf: 'Schema|Reference[]',
oneOf: 'Schema|Reference[]',
anyOf: 'Schema|Reference[]',
not: 'Schema|Reference',
exclusiveMaximum: 'boolean',
exclusiveMinimum: 'boolean',
pattern: 'string',
enum: 'any[]',
multipleOf: 'number',
required: 'string[]',
items: 'Schema|Reference',
properties: 'Schema|Reference{}',
additionalProperties: 'Schema|Reference|boolean',
description: 'string',
default: 'any',
discriminator: 'Discriminator',
readOnly: 'boolean',
writeOnly: 'boolean',
example: 'any',
 */
