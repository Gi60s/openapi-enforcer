import {
  Dereferenced,
  Version,
  DefinitionException,
  Referencable,
  ComponentSchema
} from '../'
import { Operation } from './Operation'
import { Header } from './Header'
import * as Core from '../Response'
import { MediaType } from './MediaType'
import { Link } from './Link'
import { Response3 as Definition } from '../helpers/DefinitionTypes'

export class Response<HasReference=Dereferenced> extends Core.Response {
  readonly content?: Record<string, MediaType<HasReference>>
  readonly headers?: Record<string, Referencable<HasReference, Header<HasReference>>>
  readonly links?: Record<string, Referencable<HasReference, Link>>

  constructor (definition: Definition, version?: Version) {
    super(Response, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#response-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#response-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#response-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#response-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Link,
      Header,
      MediaType,
      Operation,
      Schema: undefined,
      Swagger: undefined
    })
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
