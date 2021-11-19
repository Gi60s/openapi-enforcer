import { OASComponent, Version, DefinitionException, ComponentSchema } from '../index'
import * as E from '../../DefinitionException/methods'
import rx from '../../utils/rx'
import { Example3 as Definition } from '../helpers/DefinitionTypes'

const exampleSchema: ComponentSchema<Definition> = {
  allowsSchemaExtensions: true,
  properties: [
    {
      name: 'summary',
      schema: { type: 'string' }
    },
    {
      name: 'description',
      schema: { type: 'string' }
    },
    {
      name: 'value',
      schema: {
        type: 'any'
      }
    },
    {
      name: 'externalValue',
      schema: {
        type: 'string'
      }
    }
  ],
  validator: {
    after (data) {
      const { built, definition, exception } = data.context
      const { reference } = data.component

      if (built.value !== undefined && built.externalValue !== undefined) {
        const exampleValueExternalConflict = E.exampleValueExternalConflict({
          definition,
          locations: [
            { node: definition, key: 'value', type: 'key' },
            { node: definition, key: 'externalValue', type: 'key' }
          ],
          reference
        })
        exception.message(exampleValueExternalConflict)
      }

      if (built.externalValue !== undefined) {
        if (!rx.url.test(built.externalValue)) {
          const invalidUrl = E.invalidUrl(built.externalValue, {
            definition,
            locations: [{ node: definition, key: 'externalValue', type: 'value' }],
            reference
          })
          exception.at('externalValue').message(invalidUrl)
        }
      }
    }
  }
}

export class Example extends OASComponent {
  extensions!: Record<string, any>
  description?: string
  externalValue?: string
  summary?: string
  value?: any

  constructor (definition: Definition, version?: Version) {
    super(Example, definition, version, arguments[2])
  }

  static spec = {
    // there is an examples object in v2, but because it can be any value we're not handling it here
    // '2.0': 'https://spec.openapis.org/oas/v2.0#example-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#example-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#example-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#example-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#example-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return exampleSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
