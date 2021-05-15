import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import * as Schema from './Schema'
import { yes } from '../util'

export interface Definition {
  [name: string]: Schema.Definition2
}

export class Definitions extends OASComponent {
  readonly [name: string]: Schema.Schema

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Definitions object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#definitions-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: Schema.Schema
      }
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
