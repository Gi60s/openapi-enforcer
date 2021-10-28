import {
  Dereferenced,
  Version,
  Exception
} from '../'
import * as Core from '../Operation'
import { Parameter } from './Parameter'
import { Operation2 as Definition } from '../helpers/DefinitionTypes'

export class Operation<HasReference=Dereferenced> extends Core.Operation<HasReference> {
  readonly consumes?: string[]
  readonly parameters?: Array<Parameter<HasReference>>
  readonly produces?: string[]
  readonly schemes?: string[]

  constructor (definition: Definition, version?: Version) {
    super(Operation, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#operation-object'
  }

  static schemaGenerator = Core.Operation.schemaGenerator

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
