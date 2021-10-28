import {
  Data,
  Version,
  Exception,
  Dereferenced,
  ComponentSchema
} from '../'
import { PathItem } from './PathItem'
import * as Core from '../Paths'
import { Paths3 as Definition } from '../helpers/DefinitionTypes'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Paths<HasReference=Dereferenced> extends Core.Paths<HasReference> {
  constructor (definition: Definition, version?: Version) {
    super(Paths, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#paths-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#paths-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#paths-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#paths-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return Core.schemaGenerator(PathItem)
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
