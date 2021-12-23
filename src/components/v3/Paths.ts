import { ComponentSchema, Data, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { componentValidate } from '../index'
import { PathItem } from './PathItem'
import * as Core from '../Paths'
import { Paths3 as Definition } from '../helpers/definition-types'

export class Paths extends Core.Paths {
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

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
