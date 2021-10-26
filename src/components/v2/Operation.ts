import {
  Dereferenced,
  Version,
  Exception
} from '../'
import { Operation as CoreOperation, Definition as CoreDefinition } from '../Operation'

export interface Definition extends CoreDefinition {
  consumes?: string[]
  produces?: string[]
  schemes?: string[]
}

export class Operation<HasReference=Dereferenced> extends CoreOperation<HasReference> {
  readonly consumes?: string[]
  readonly produces?: string[]
  readonly schemes?: string[]

  constructor (definition: Definition, version?: Version) {
    super(Operation, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#operation-object'
  }

  static schemaGenerator = CoreOperation.schemaGenerator

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
