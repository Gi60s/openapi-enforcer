import { Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { componentValidate } from '../index'
import * as Core from '../SecurityScheme'
import { SecurityScheme3 as Definition } from '../helpers/definition-types'

export class SecurityScheme extends Core.SecurityScheme {
  bearerFormat?: string
  flows?: string
  openIdConnectUrl?: string
  scheme?: string

  constructor (definition: Definition, version?: Version) {
    super(SecurityScheme, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-scheme-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-scheme-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-scheme-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-scheme-object'
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
