import { ComponentSchema, Dereferenced, Exception, Version } from '../index'
import * as Core from '../Responses'
import * as Response from './Response'
import { Responses3 as Definition } from '../helpers/DefinitionTypes'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Responses<HasReference=Dereferenced> extends Core.Responses {
  readonly [code: string]: Response.Response<HasReference>

  constructor (definition: Definition, version?: Version) {
    super(Responses, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#responses-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#responses-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#responses-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#responses-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Response: Response.Response
    })
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
