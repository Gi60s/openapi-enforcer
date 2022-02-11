import { componentValidate, OASComponent } from './index'
import { ComponentSchema, Version } from './helpers/builder-validator-types'
import { DefinitionException } from '../Exception'
import { Contact } from './Contact'
import { License } from './License'
import { Info as Definition } from './helpers/definition-types'
import rx from '../utils/rx'

let infoSchema: ComponentSchema<Definition>

export class Info extends OASComponent<Definition> {
  extensions!: Record<string, any>
  title!: string
  description?: string
  termsOfService?: string
  contact?: Contact
  license?: License
  version!: string

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

  static get schema (): ComponentSchema<Definition, typeof Info> {
    if (infoSchema === undefined) {
      infoSchema = new ComponentSchema({
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
              component: Contact
            }
          },
          {
            name: 'license',
            schema: {
              type: 'component',
              allowsRef: false,
              component: License
            }
          },
          {
            name: 'version',
            required: true,
            schema: { type: 'string' }
          }
        ],
        validator: {
          after (data) {
            const { built, exception } = data.context

            if (built.termsOfService !== undefined) {
              if (!rx.url.test(built.termsOfService)) {
                exception.at('termsOfService').add.invalidUrl(data, { key: 'termsOfService', type: 'value' }, built.termsOfService)
              }
            }
          }
        }
      })
    }
    return infoSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
