import { componentValidate } from '../'
import { ComponentSchema, Data, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { Operation } from './Operation'
import * as Core from '../PathItem'
import { Parameter } from './Parameter'
import { PathItem2 as Definition } from '../helpers/definition-types'

const methods = Core.methods.concat(['trace'])

export class PathItem extends Core.PathItem<Operation> {
  parameters?: Parameter[]

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

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
