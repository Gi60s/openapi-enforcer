import {
  Dereferenced,
  Version,
  Exception,
  Referencable,
  ComponentSchema
} from '../'
import { Operation } from './Operation'
import * as Header from './Header'
import * as Reference from '../Reference'
import * as Core from '../Response'
import { MediaType, Definition as MediaTypeDefinition } from './MediaType'
import { Link, Definition as LinkDefinition } from './Link'

export interface Definition extends Core.Definition {
  content?: Record<string, MediaTypeDefinition>
  headers?: Record<string, Header.Definition | Reference.Definition>
  links?: Record<string, LinkDefinition | Reference.Definition>
}

export class Response<HasReference=Dereferenced> extends Core.Response {
  readonly content?: Record<string, MediaType<HasReference>>
  readonly headers?: Record<string, Referencable<HasReference, Header.Header<HasReference>>>
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
      Link: Link,
      Header: Header.Header,
      MediaType,
      Operation,
      Schema: undefined as unknown
    })
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
