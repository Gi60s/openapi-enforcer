import { Data } from '../'
import { Schema } from '../Schema'
import * as E from '../../DefinitionException/methods'
import * as Serializer from './serializer'

export function defaultRequiredConflict (data: Data): boolean {
  const { built, exception, definition } = data.context
  let success = true

  if (built.required === true && 'default' in built) {
    const defaultRequiredConflict = E.defaultRequiredConflict({
      definition,
      locations: [
        { node: definition, key: 'default', type: 'key' },
        { node: definition, key: 'required', type: 'key' }
      ]
    })
    const { level } = exception.message(defaultRequiredConflict)
    if (level === 'error') success = false
  }

  return success
}

export function exampleExamplesConflict (data: Data): boolean {
  const { built, exception, definition } = data.context
  let success = true

  if (built.example !== undefined && built.examples !== undefined) {
    const exampleExamplesConflict = E.exampleExamplesConflict({
      definition,
      locations: [
        { node: definition, key: 'example', type: 'key' },
        { node: definition, key: 'examples', type: 'key' }
      ],
      reference: data.component.reference
    })
    const { level } = exception.message(exampleExamplesConflict)
    if (level === 'error') success = false
  }

  return success
}

export function examplesMatchSchema (data: Data, schema: Schema | null): boolean {
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

function exampleMatchesSchema (data: Data, keys: string[], example: any, schema: Schema | null): boolean {
  const { chain, definition, exception } = data.context
  let success = true

  // determine the node and key for location lookup
  const length = keys.length
  const key = keys[length - 1]
  let node = chain[0]?.context.definition
  for (let i = 0; i < length - 1; i++) {
    node = node?.[keys[i]]
  }

  if (schema === null) {
    const exampleWithoutSchema = E.exampleWithoutSchema({
      definition,
      locations: [{ node, key, type: 'value' }]
    })
    const { level } = exception.message(exampleWithoutSchema)
    if (level === 'error') success = false
  } else {
    const serialized = schema.serialize(example)
    if (serialized?.exception?.hasError === true) {
      const exampleNotSerializable = E.exampleNotSerializable(example, schema, serialized.exception, {
        definition,
        locations: [{ node, key, type: 'value' }]
      })
      const { level } = exception.at(key).message(exampleNotSerializable)
      if (level === 'error') success = false
    } else {
      const error = schema.validate(serialized.value)
      if (error != null) {
        const exampleNotSerializable = E.exampleNotValid(example, schema, error, {
          definition,
          locations: [{ node, key, type: 'value' }]
        })
        const { level } = exception.at(key).message(exampleNotSerializable)
        if (level === 'error') success = false
      }
    }
  }

  return success
}
