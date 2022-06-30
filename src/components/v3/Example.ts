import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException, LocationInput } from '../../Exception'
import { OASComponent, componentValidate } from '../index'
import rx from '../../utils/rx'
import { Example3 as Definition } from '../helpers/definition-types'
import { IExample } from '../interfaces/IExample'

let schemaExample: ComponentSchema<Definition>

export class Example extends OASComponent implements IExample {
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

  static get schema (): ComponentSchema {
    if (schemaExample === undefined) {
      schemaExample = new ComponentSchema<Definition>({
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

            if (built.value !== undefined && built.externalValue !== undefined) {
              const locations: LocationInput[] = [
                { node: definition, key: 'value', type: 'key' },
                { node: definition, key: 'externalValue', type: 'key' }
              ]
              exception.add.propertiesMutuallyExclusive(data, locations, ['value', 'externalValue'])
            }

            if (built.externalValue !== undefined) {
              if (!rx.url.test(built.externalValue)) {
                exception.at('externalValue').add.invalidUrl(data, { key: 'externalValue', type: 'value' }, built.externalValue)
              }
            }
          }
        }
      })
    }
    return schemaExample
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
