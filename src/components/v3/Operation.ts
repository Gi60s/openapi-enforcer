import {
  Dereferenced,
  Version,
  DefinitionException,
  Referencable, ComponentSchema
} from '../'
import * as Core from '../Operation'
import { Callback } from './Callback'
import { RequestBody } from './RequestBody'
import { Server } from './Server'
import { Parameter } from './Parameter'
import { Responses } from './Responses'
import { Operation3 as Definition } from '../helpers/DefinitionTypes'

export class Operation<HasReference=Dereferenced> extends Core.Operation<HasReference> {
  callbacks?: Record<string, Referencable<HasReference, Callback>>
  parameters?: Array<Parameter<HasReference>>
  requestBody?: Referencable<HasReference, RequestBody>
  servers?: Server[]

  constructor (definition: Definition, version?: Version) {
    super(Operation, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#operation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#operation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#operation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#operation-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Parameter: Parameter,
      Responses: Responses
    })
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
