import {
  Data,
  Dereferenced,
  Version,
  DefinitionException,
  ComponentSchema, Referencable
} from '../'
import { Operation } from './Operation'
import { Server } from './Server'
import { Parameter } from './Parameter'
import * as Core from '../PathItem'
import { PathItem3 as Definition } from '../helpers/DefinitionTypes'

const methods = Core.methods.concat(['trace'])

export class PathItem<HasReference=Dereferenced> extends Core.PathItem<HasReference> {
  description?: string
  parameters?: Array<Referencable<HasReference, Parameter<HasReference>>>
  trace?: Operation<HasReference>
  servers?: Server[]
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
    return Core.schemaGenerator({
      Operation: Operation,
      Parameter: Parameter
    }, methods, data)
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
