import { SchemaObject } from '../definition-validator'
import { EnforcerComponent, FactoryResult, Statics } from './'

export interface Class extends Statics<Definition, Object> {
  new (definition: Definition): Object
}

export interface Definition {
  [extension: string]: any
  description?: string
  url: string
}

export interface Object {
  [extension: string]: any
  readonly description?: string
  readonly url: string
}

export function Factory (): FactoryResult<Definition, Object> {
  class ExternalDocumentation extends EnforcerComponent<Definition, Object> implements Object {
    readonly description?: string
    readonly url!: string

    // constructor (definition: Definition) {
    //   super(definition)
    // }
  }

  return {
    component: ExternalDocumentation,
    validator: function (): SchemaObject {
      return {
        type: 'object',
        allowsSchemaExtensions: true,
        required: () => ['url'],
        properties: [
          {
            name: 'description',
            schema: { type: 'string' }
          },
          {
            name: 'url',
            schema: { type: 'string' }
          }
        ]
      }
    }
  }
}
