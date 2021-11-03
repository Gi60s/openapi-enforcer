import { ComponentSchema, Dereferenced, DefinitionException, Version } from '../index'
import * as Core from '../Responses'
import { Response } from './Response'
import { Responses2 as Definition } from '../helpers/DefinitionTypes'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Responses<HasReference=Dereferenced> extends Core.Responses {
  readonly [code: string]: Response<HasReference>

  constructor (definition: Definition, version?: Version) {
    super(Responses, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#responses-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Response: Response
    })
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
