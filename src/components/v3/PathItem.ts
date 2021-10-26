import {
  Data,
  Dereferenced,
  Version,
  Exception,
  ComponentSchema
} from '../'
import * as Operation from './Operation'
import * as Server from '../Server'

import * as Core from '../PathItem'

const methods = Core.methods.concat(['trace'])

export interface Definition extends Core.Definition {
  description?: string
  trace?: Operation.Definition
  servers?: Server.Definition[]
  summary?: string
}

export class PathItem<HasReference=Dereferenced> extends Core.PathItem<HasReference> {
  description?: string
  trace?: Operation.Operation<HasReference>
  servers?: Server.Server[]
  summary?: string

  constructor (definition: Definition, version?: Version) {
    super(PathItem, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#path-item-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#path-item-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#path-item-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#path-item-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return Core.schemaGenerator(Operation.Operation, methods, data)
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
