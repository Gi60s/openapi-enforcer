import { componentValidate } from '../'
import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import { Operation } from './Operation'
import * as Core from '../PathItem'
import { Parameter } from './Parameter'
import { PathItem2 as Definition } from '../helpers/definition-types'

const methods = Core.methods2

let pathItemSchema: ComponentSchema<Definition>

export class PathItem extends Core.PathItem<Operation> {
  parameters?: Parameter[]

  constructor (definition: Definition, version?: Version) {
    super(PathItem, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#path-item-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (pathItemSchema === undefined) {
      pathItemSchema = Core.schemaGenerator({
        Operation: Operation,
        Parameter: Parameter
      }, methods)
    }
    return pathItemSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
