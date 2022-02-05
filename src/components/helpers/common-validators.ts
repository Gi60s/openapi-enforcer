import { ValidatorData } from './builder-validator-types'
import { Schema } from '../Schema'
import * as E from '../../DefinitionException/methods'
import { Exception } from '../../utils/Exception'
import { LocationInput } from '../../DefinitionException/types'

export function defaultRequiredConflict (data: ValidatorData): boolean {
  const { built, exception } = data.context
  let success = true

  if (built.required === true && 'default' in built) {
    const locations: LocationInput[] = [
      { key: 'default', type: 'key' },
      { key: 'required', type: 'key' }
    ]
    const defaultRequiredConflict = E.defaultRequiredConflict(data, locations)
    const { level } = exception.message(defaultRequiredConflict)
    if (level === 'error') success = false
  }

  return success
}

export function exampleExamplesConflict (data: ValidatorData): boolean {
  const { built, exception } = data.context
  let success = true

  if (built.example !== undefined && built.examples !== undefined) {
    const locations: LocationInput[] = [
      { key: 'example', type: 'key' },
      { key: 'examples', type: 'key' }
    ]
    const exampleExamplesConflict = E.propertiesMutuallyExclusive(data, locations, ['example', 'examples'])
    const { level } = exception.message(exampleExamplesConflict)
    if (level === 'error') success = false
  }

  return success
}

export function examplesMatchSchema (data: ValidatorData, SchemaClass: any): true {
  const { built, definition } = data.context
  const { lastly, version } = data.root

  // if the schema still has a $ref then there is nothing we can validate
  const schemaHasRef = definition.schema?.$ref !== undefined
  if (schemaHasRef) return true

  if (built.example !== undefined || built.examples !== undefined) {
    lastly.push(() => {
      const schema = definition.schema !== undefined
        ? new SchemaClass(definition.schema, version)
        : null

      // validate that example matches schema
      if ('example' in built) {
        exampleMatchesSchema(data, ['example'], built.example, schema)
      }

      // validate that example matches schema
      if ('examples' in built) {
        lastly.push(() => {
          const examples = built.examples ?? {}
          Object.keys(examples).forEach(key => {
            exampleMatchesSchema(data, ['examples', key], built.examples[key].value, schema)
          })
        })
      }
    })
  }

  return true
}

export function parameterSchemaContent (data: ValidatorData): boolean {
  const { built, exception } = data.context
  let success = true

  // properties "schema" and "content" are mutually exclusive
  if (built.schema !== undefined && built.content !== undefined) {
    const locations: LocationInput[] = [
      { key: 'schema', type: 'key' },
      { key: 'content', type: 'key' }
    ]
    const exampleExamplesConflict = E.propertiesMutuallyExclusive(data, locations, ['content', 'schema'])
    const { level } = exception.message(exampleExamplesConflict)
    if (level === 'error') success = false
  }

  // must have either "schema" or "content" defined
  if (built.schema === undefined && built.content === undefined) {
    const schemaOrContentRequired = E.parameterSchemaContentRequired(data, { type: 'both' })
    const { level } = exception.message(schemaOrContentRequired)
    if (level === 'error') success = false
  }

  // check that exactly one media type is specified
  if (built.content !== undefined) {
    const types = Object.keys(built.content)
    if (types.length !== 1) {
      const locations: LocationInput[] = []
      if (types.length === 0) {
        locations.push({ key: 'content', type: 'value' })
      } else {
        const node = data.context.definition.content
        types.forEach(key => {
          locations.push({ node, key, type: 'key' })
        })
      }
      const mediaTypeCount = E.parameterContentMediaTypeCount(data, locations, types)
      const { level } = exception.message(mediaTypeCount)
      if (level === 'error') success = false
    }
  }

  return success
}

function exampleMatchesSchema (data: ValidatorData, keys: string[], example: any, schema: Schema | null): boolean {
  const { exception } = data.context
  let success = true

  // determine the node and key for location lookup
  const length = keys.length
  const key = keys[length - 1]
  let node = data.context.definition
  for (let i = 0; i < length - 1; i++) {
    node = node?.[keys[i]]
  }

  if (schema === null) {
    const exampleWithoutSchema = E.exampleWithoutSchema(data, { node, key, type: 'value' })
    const { level } = exception.message(exampleWithoutSchema)
    if (level === 'error') success = false
  } else {
    const serialized = schema.serialize(example)
    if (serialized?.hasError) {
      const exampleNotSerializable = E.exampleNotSerializable(data, { node, key, type: 'value' }, example, schema, serialized.error as Exception)
      const { level } = exception.at(key).message(exampleNotSerializable)
      if (level === 'error') success = false
    } else {
      const error = schema.validate(serialized.value)
      if (error != null) {
        console.log(error.report)
        const exampleNotSerializable = E.exampleNotValid(data, { node, key, type: 'value' }, example, schema, error)
        const { level } = exception.at(key).message(exampleNotSerializable)
        if (level === 'error') success = false
      }
    }
  }

  return success
}
