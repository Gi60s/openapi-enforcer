import { IContact3, IContact3Definition } from './IContact'
import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { getSchema } from './ContactBase'

export class Contact extends EnforcerComponent implements IContact3 {
  email?: string
  name?: string
  url?: string

  constructor (definition: IContact3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#contact-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#contact-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#contact-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#contact-object'
  }

  static getSchema = getSchema

  static validate (definition: IContact3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }
}
