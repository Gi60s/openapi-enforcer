import { OASComponent, componentValidate } from './'
import { ComponentSchema, Version } from './helpers/builder-validator-types'
import { DefinitionException } from '../DefinitionException'
import { Xml as Definition } from './helpers/definition-types'

let xmlSchema: ComponentSchema<Definition, typeof Xml>

export class Xml extends OASComponent {
  extensions!: Record<string, any>
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean

  constructor (definition: Definition, version?: Version) {
    super(Xml, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#xml-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#xml-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#xml-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#xml-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#xml-object'
  }

  static get schema (): ComponentSchema<Definition, typeof Xml> {
    if (xmlSchema === undefined) {
      xmlSchema = new ComponentSchema({
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'name',
            schema: { type: 'string' }
          },
          {
            name: 'namespace',
            schema: { type: 'string' }
          },
          {
            name: 'prefix',
            schema: { type: 'string' }
          },
          {
            name: 'attribute',
            schema: { type: 'boolean' }
          },
          {
            name: 'wrapped',
            schema: { type: 'boolean' }
          }
        ]
      })
    }
    return xmlSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
