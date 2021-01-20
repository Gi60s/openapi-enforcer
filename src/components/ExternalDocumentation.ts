import { Validator } from '../Validator'
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
    schema: function (): Validator.SchemaObject {
      return {
        type: 'object',
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
