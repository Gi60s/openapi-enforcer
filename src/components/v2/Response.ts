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
import * as Schema from '../Schema'
import * as Core from '../Response'

export interface Definition extends Core.Definition {
  examples?: Record<string, any>
  headers?: Record<string, Header.Definition>
  schema?: Schema.Definition2 | Reference.Definition
}

export class Response<HasReference=Dereferenced> extends Core.Response {
  readonly examples?: Record<string, any>
  readonly headers?: Record<string, Referencable<HasReference, Header.Header>>
  readonly schema?: Schema.Schema

  constructor (definition: Definition, version?: Version) {
    super(Response, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#response-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Link: undefined as unknown,
      Header: Header.Header,
      MediaType: undefined as unknown,
      Operation: Operation,
      Schema: Schema.Schema
    })
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
