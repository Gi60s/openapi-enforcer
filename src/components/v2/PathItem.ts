import {
  Data,
  Dereferenced,
  Version,
  Exception,
  ComponentSchema, Referencable
} from '../'
import { Operation } from './Operation'
import * as Core from '../PathItem'
import { Parameter } from './Parameter'
import { PathItem2 as Definition } from '../helpers/DefinitionTypes'

const methods = Core.methods.concat(['trace'])

export class PathItem<HasReference=Dereferenced> extends Core.PathItem<HasReference> {
  parameters?: Array<Referencable<HasReference, Parameter<HasReference>>>

  constructor (definition: Definition, version?: Version) {
    super(PathItem, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#path-item-object'
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Operation: Operation,
      Parameter: Parameter
    }, methods, data)
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
