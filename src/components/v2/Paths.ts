import {
  Data,
  Version,
  Exception,
  Dereferenced,
  ComponentSchema
} from '../'
import * as PathItem from './PathItem'
import * as Core from '../Paths'

export type Definition = Core.Definition<PathItem.Definition>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Paths<HasReference=Dereferenced> extends Core.Paths<HasReference> {
  constructor (definition: Definition, version?: Version) {
    super(Paths, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#paths-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return Core.schemaGenerator(PathItem.PathItem, data)
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
