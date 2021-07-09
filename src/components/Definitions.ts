import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception, Dereferenced } from './'
import * as Schema from './Schema'
import { no } from '../util'

export interface Definition {
  [name: string]: Schema.Definition2
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Definitions<HasReference=Dereferenced> extends OASComponent {
  readonly [name: string]: Schema.Schema<HasReference>

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', Definitions, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#definitions-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: no,
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: Schema.Schema
      }
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
