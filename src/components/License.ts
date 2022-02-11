import { componentValidate, OASComponent } from './index'
import { ComponentSchema, Version } from './helpers/builder-validator-types'
import { DefinitionException } from '../Exception'
import { License as Definition } from './helpers/definition-types'
import rx from '../utils/rx'

let licenseSchema: ComponentSchema<Definition>

export class License extends OASComponent {
  extensions!: Record<string, any>
  name!: string
  url?: string

  constructor (definition: Definition, version?: Version) {
    super(License, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#license-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#license-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#license-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#license-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#license-object'
  }

  static get schema (): ComponentSchema<Definition, typeof License> {
    if (licenseSchema === undefined) {
      licenseSchema = new ComponentSchema({
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'name',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'url',
            schema: { type: 'string' }
          }
        ],
        validator: {
          after (data) {
            const { exception, definition } = data.context

            if (typeof definition.url === 'string' && !rx.url.test(definition.url)) {
              exception.add.invalidUrl(data, { key: 'url', type: 'value' }, definition.url)
            }
          }
        }
      })
    }
    return licenseSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
