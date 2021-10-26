import {
  Dereferenced,
  Version,
  Exception,
  Referencable
} from '../'
import { Operation as CoreOperation, Definition as CoreDefinition } from '../Operation'
import * as Callback from './Callback'
import * as Reference from '../Reference'
import * as RequestBody from './RequestBody'
import * as Server from '../Server'

export interface Definition extends CoreDefinition {
  callbacks?: Record<string, Callback.Definition | Reference.Definition>
  requestBody?: RequestBody.Definition | Reference.Definition
  servers?: Server.Definition[]
}

export class Operation<HasReference=Dereferenced> extends CoreOperation<HasReference> {
  readonly callbacks?: Record<string, Referencable<HasReference, Callback.Callback>>
  readonly requestBody?: Referencable<HasReference, RequestBody.RequestBody>
  readonly servers?: Server.Server[]

  constructor (definition: Definition, version?: Version) {
    super(Operation, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#operation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#operation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#operation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#operation-object'
  }

  static schemaGenerator = CoreOperation.schemaGenerator

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
