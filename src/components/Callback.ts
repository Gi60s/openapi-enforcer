import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { yes } from '../util'
import * as PathItem from './PathItem'

export interface Definition {
  [extensionOrPathItem: string]: PathItem.Definition | any
}

export class Callback extends OASComponent {
  readonly [extensionOrPathItem: string]: PathItem.PathItem | any

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Callback object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#license-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#license-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#license-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#license-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#license-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: PathItem.PathItem
      }
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
