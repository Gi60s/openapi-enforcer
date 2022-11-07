import { IContact2, IContact2Definition } from './IContact'
import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { getSchema } from './ContactBase'

export class Contact extends EnforcerComponent implements IContact2 {
  email?: string
  name?: string
  url?: string

  constructor (definition: IContact2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#contact-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchema = getSchema

  static validate (definition: IContact2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }
}
