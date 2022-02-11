import { componentValidate } from '../'
import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import { PathItem } from './PathItem'
import * as Core from '../Paths'
import { Paths2 as Definition } from '../helpers/definition-types'

let pathsSchema: ComponentSchema<Definition>

export class Paths extends Core.Paths<PathItem> {
  constructor (definition: Definition, version?: Version) {
    super(Paths, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#paths-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (pathsSchema === undefined) {
      pathsSchema = Core.schemaGenerator(PathItem)
    }
    return pathsSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
