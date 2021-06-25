import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { yes } from '../util'
import * as PathItem from './PathItem'

export interface Definition {
  [key: `x-${string}`]: any
  [pathItem: string]: PathItem.Definition
}

export class Callback extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly [pathItem: string]: PathItem.PathItem

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', Callback, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#callback-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#callback-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#callback-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#callback-object'
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

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
