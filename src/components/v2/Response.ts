import {
  Dereferenced,
  Version,
  Exception,
  Referencable,
  ComponentSchema
} from '../'
import { Operation } from './Operation'
import { Header } from './Header'
import { Schema } from './Schema'
import { Swagger } from './Swagger'
import * as Core from '../Response'
import { Response2 as Definition } from '../helpers/DefinitionTypes'

export class Response<HasReference=Dereferenced> extends Core.Response {
  readonly examples?: Record<string, any>
  readonly headers?: Record<string, Referencable<HasReference, Header>>
  readonly schema?: Schema

  constructor (definition: Definition, version?: Version) {
    super(Response, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#response-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Link: undefined,
      Header,
      MediaType: undefined,
      Operation,
      Schema: Schema,
      Swagger: Swagger
    })
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
