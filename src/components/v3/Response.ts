import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import { componentValidate } from '../index'
import { Operation } from './Operation'
import { Header } from './Header'
import * as Core from '../Response'
import { MediaType } from './MediaType'
import { Link } from './Link'
import { Response3 as Definition } from '../helpers/definition-types'
import { IResponse3 } from '../interfaces/IResponse'

let responseSchema: ComponentSchema<Definition>

export class Response extends Core.Response implements IResponse3 {
  content?: Record<string, MediaType>
  headers?: Record<string, Header>
  links?: Record<string, Link>

  constructor (definition: Definition, version?: Version) {
    super(Response, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#response-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#response-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#response-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#response-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (responseSchema === undefined) {
      responseSchema = Core.schemaGenerator({
        Link,
        Header,
        MediaType,
        Operation,
        Schema: undefined,
        Swagger: undefined
      })
    }
    return responseSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
