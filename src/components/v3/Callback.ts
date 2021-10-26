import { OASComponent, ComponentSchema, Version, Exception } from '../index'
import * as PathItem from '../PathItem'

export interface Definition {
  [key: `x-${string}`]: any
  [pathItem: string]: PathItem.Definition
}

const callbackSchema: ComponentSchema<Definition> = {
  allowsSchemaExtensions: true,
  additionalProperties: {
    type: 'component',
    allowsRef: false,
    component: PathItem.PathItem
  }
}

export class Callback extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly [pathItem: string]: PathItem.PathItem

  constructor (definition: Definition, version?: Version) {
    super(Callback, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#callback-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#callback-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#callback-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#callback-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return callbackSchema
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
