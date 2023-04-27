import { ISchema2Definition, ISchema3Definition, ISchema2, ISchema3 } from './ISchema'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { IExceptionData, IExceptionLevel } from '../../Exception/IException'
import * as I from '../IInternalTypes'
import * as C from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'

type Definition = ISchema2Definition | ISchema3Definition
type ISchema = ISchema2 | ISchema3

// const rxNumber = /^-?\d+(?:\.\d+)?$/

export function deserialize (value: string, options: { strict: boolean } | undefined): any {
  return null
}

export function determineSchemaType (definition: I.ISchemaDefinition | I.ISchema): string | undefined {
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

export function schemaDefinition (data: I.ISchemaSchemaProcessor, schema: C.ISchemaDefinition<I.ISchema2Definition, I.ISchema2> | C.ISchemaDefinition<I.ISchema3Definition, I.ISchema3>): void {
  const { definition } = data
  const type = determineSchemaType(definition)
  schema.properties?.forEach(property => {
    switch (property.name) {
      case 'additionalProperties':
        property.schema = {
          type: 'oneOf',
          oneOf: [
            {
              condition: ({ definition }) =>
                typeof definition !== 'boolean',
              schema: {
                type: 'component',
                allowsRef: true,
                component: data.component.constructor
              }
            },
            {
              condition: ({ definition }) => typeof definition === 'boolean',
              schema: { type: 'boolean' }
            }
          ]
        }
        property.notAllowed = type !== 'object' ? 'PROPERTY_NOT_ALLOWED_UNLESS_OBJECT' : undefined
        break
    }
  })
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

export function getSchemaProperty<T=any> (schema: Definition, path: string[]): T | undefined {
  let node: any = schema
  const length = path.length
  for (let i = 0; i < length; i++) {
    node = node[path[i]]
    if (node === undefined) return
  }
  return node as T
}

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
