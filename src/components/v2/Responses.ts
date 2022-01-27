import { componentValidate } from '../index'
import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import * as Core from '../Responses'
import { Response } from './Response'
import { Responses2 as Definition } from '../helpers/definition-types'

let responsesSchema: ComponentSchema<Definition>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Responses extends Core.Responses {
  response!: {
    [code: string]: Response
  }

  constructor (definition: Definition, version?: Version) {
    super(Responses, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#responses-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (responsesSchema === undefined) {
      responsesSchema = Core.schemaGenerator({
        Response: Response
      })
    }
    return responsesSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
