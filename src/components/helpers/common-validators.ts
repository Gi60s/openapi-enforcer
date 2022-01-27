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
    const exampleExamplesConflict = E.exampleExamplesConflict(data, locations)
    const { level } = exception.message(exampleExamplesConflict)
    if (level === 'error') success = false
  }

  return success
}

export function examplesMatchSchema (data: ValidatorData, schema: Schema | null): boolean {
  const { built } = data.context
  const { lastly } = data.root
  let success = true

  // validate that example matches schema
  if ('example' in built) {
    lastly.push(() => {
      success = success && exampleMatchesSchema(data, ['example'], built.example, schema)
    })
  }

  // validate that example matches schema
  if ('examples' in built) {
    lastly.push(() => {
      const examples = built.examples ?? {}
      Object.keys(examples).forEach(key => {
        success = success && exampleMatchesSchema(data, ['examples', key], built.example, schema)
      })
    })
  }

  return success
}

function exampleMatchesSchema (data: ValidatorData, keys: string[], example: any, schema: Schema | null): boolean {
  const { chain, exception } = data.context
  let success = true

  // determine the node and key for location lookup
  const length = keys.length
  const key = keys[length - 1]
  let node = chain[0]?.context.definition
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
        const exampleNotSerializable = E.exampleNotValid(data, { node, key, type: 'value' }, example, schema, error)
        const { level } = exception.at(key).message(exampleNotSerializable)
        if (level === 'error') success = false
      }
    }
  }

  return success
}
