import { ISchema2Definition, ISchema3Definition } from './ISchema'

type Definition = ISchema2Definition | ISchema3Definition

const rxNumber = /^-?\d+(?:\.\d+)?$/

/**
 * Generate a schema definition object that has default properties added, allOf schemas merged, oneOf or anyOf schemas
 * determined, etc.
 * @param schema
 * @param [hint] A value used to help determine the correct schema when using oneOf or anyOf.
 */
export function getNormalizedSchema (schema: ISchema2Definition, hint?: any): ISchema2Definition
export function getNormalizedSchema (schema: ISchema3Definition, hint?: any): ISchema3Definition
export function getNormalizedSchema (schema: Definition, hint?: any): Definition {
  if (schema.allOf !== undefined) {

  } else if (schema.anyOf !== undefined) {

  } else if (schema.oneOf !== undefined) {

  } else {

  }
}

export function getSchemaProperty<T=any> (schema: Definition, path: string[]): T | undefined {

}

/**
 * Given an object path, traverse schemas properties and additional properties to find the schema associated with the path.
 * @param schema
 * @param path
 */
export function getSchemaForObjectPath (schema: ISchema2Definition, path: string[]): ISchema2Definition | boolean
export function getSchemaForObjectPath (schema: ISchema3Definition, path: string[]): ISchema3Definition | boolean
export function getSchemaForObjectPath (schema: Definition, path: string[]): Definition | boolean {
  const type = getSchemaProperty(schema, ['type'])
  const key = path[0]

  if (type === 'array' && rxNumber.test(key)) {

  } else if (type === 'object') {
    const property = getSchemaProperty(schema, ['properties', key]) ?? getSchemaProperty(schema, ['additionalProperties'])
    if (property === true) return true
    return getSchemaForObjectPath(property, path.slice(1))
  } else {
    return false
  }
}

export function hasRequiredProperty (schema: Definition, property: string): boolean {
  const required = getSchemaPropertyValue<string[]>(schema, ['required']) ?? []
  return required.includes(property)
}
