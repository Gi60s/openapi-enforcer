import { OASComponent, ComponentSchema, Version, Exception } from './'
import * as Contact from './Contact'
import * as License from './License'

export interface Definition {
  [key: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: Contact.Definition
  license?: License.Definition
  version: string
}

const infoSchema: ComponentSchema<Definition> = {
  allowsSchemaExtensions: true,
  properties: [
    {
      name: 'title',
      required: true,
      schema: { type: 'string' }
    },
    {
      name: 'description',
      schema: { type: 'string' }
    },
    {
      name: 'termsOfService',
      schema: { type: 'string' }
    },
    {
      name: 'contact',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Contact.Contact
      }
    },
    {
      name: 'license',
      schema: {
        type: 'component',
        allowsRef: false,
        component: License.License
      }
    },
    {
      name: 'version',
      required: true,
      schema: { type: 'string' }
    }
  ]
}

export class Info extends OASComponent<Definition> {
  readonly [key: `x-${string}`]: any
  readonly title!: string
  readonly description?: string
  readonly termsOfService?: string
  readonly contact?: Contact.Contact
  readonly license?: License.License
  readonly version!: string

  constructor (definition: Definition, version?: Version) {
    super(Info, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#info-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#info-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#info-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#info-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#info-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return infoSchema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}