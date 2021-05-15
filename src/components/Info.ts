import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { yes } from '../util'
import * as Contact from './Contact'
import * as License from './License'

export interface Definition {
  [extension: string]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: Contact.Definition
  license?: License.Definition
  version: string
}

export class Info extends OASComponent {
  readonly [extension: string]: any
  readonly title!: string
  readonly description?: string
  readonly termsOfService?: string
  readonly contact?: Contact.Contact
  readonly license?: License.License
  readonly version!: string

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Info object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#info-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#info-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#info-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#info-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#info-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'title',
          required: yes,
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
          required: yes,
          schema: { type: 'string' }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
