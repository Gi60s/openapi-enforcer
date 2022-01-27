import { componentValidate } from '../'
import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { Operation } from './Operation'
import { Header } from './Header'
import { Schema } from './Schema'
import { Swagger } from './Swagger'
import * as Core from '../Response'
import { Response2 as Definition } from '../helpers/definition-types'

let responseSchema: ComponentSchema<Definition>

export class Response extends Core.Response {
  examples?: Record<string, any>
  headers?: Record<string, Header>
  schema?: Schema

  constructor (definition: Definition, version?: Version) {
    super(Response, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#response-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (responseSchema === undefined) {
      responseSchema = Core.schemaGenerator({
        Link: undefined,
        Header,
        MediaType: undefined,
        Operation,
        Schema: Schema,
        Swagger: Swagger
      })
    }
    return responseSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
