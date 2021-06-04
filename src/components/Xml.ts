import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { yes } from '../util'

export interface Definition {
  [extension: string]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export class Xml extends OASComponent {
  readonly [extension: string]: any
  readonly name?: string
  readonly namespace?: string
  readonly prefix?: string
  readonly attribute?: boolean
  readonly wrapped?: boolean

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Xml object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#xml-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#xml-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#xml-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#xml-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#xml-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
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
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
