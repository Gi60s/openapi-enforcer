import { DefinitionException, Version } from '../index'
import * as Core from '../SecurityScheme'
import { SecurityScheme2 as Definition } from '../helpers/DefinitionTypes'

export class SecurityScheme extends Core.SecurityScheme {
  authorizationUrl?: string
  flow?: string
  scopes?: Record<string, string>
  tokenUrl?: string

  constructor (definition: Definition, version?: Version) {
    super(SecurityScheme, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#security-scheme-object'
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
