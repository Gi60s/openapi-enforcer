import { getSchema } from './ExternalDocumentationBase'
import { IComponentSpec, IVersion } from '../IComponent'
import { IExternalDocumentation3, IExternalDocumentation3Definition } from './IExternalDocumentation'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'

export class ExternalDocumentation extends EnforcerComponent<IExternalDocumentation3Definition, ExternalDocumentation> implements IExternalDocumentation3 {
  [extension: `x${string}`]: any
  description?: string
  url!: string

  constructor (definition: IExternalDocumentation3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#external-documentation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#external-documentation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#external-documentation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#external-documentation-object'
  }

  static validate (definition: IExternalDocumentation3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static getSchema = getSchema
}
