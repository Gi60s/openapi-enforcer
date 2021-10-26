import {
  Data,
  Dereferenced,
  Version,
  Exception,
  ComponentSchema
} from '../'
import * as Operation from './Operation'
import * as Core from '../PathItem'
export { Definition } from '../PathItem'

const methods = Core.methods.concat(['trace'])

export class PathItem<HasReference=Dereferenced> extends Core.PathItem<HasReference> {
  constructor (definition: Core.Definition, version?: Version) {
    super(PathItem, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#path-item-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Core.Definition> {
    return Core.schemaGenerator(Operation.Operation, methods, data)
  }

  static validate (definition: Core.Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
