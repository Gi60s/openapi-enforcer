import { OASComponent, Version, DefinitionException, ComponentSchema } from './'
import { License as Definition } from './helpers/DefinitionTypes'

const licenseSchema: ComponentSchema<Definition> = {
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
  ]
}

export class License extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly name!: string
  readonly url?: string

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

  static schemaGenerator (): ComponentSchema<Definition> {
    return licenseSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
