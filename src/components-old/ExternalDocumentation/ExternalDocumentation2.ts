import { getSchema } from './ExternalDocumentationBase'
import { IComponentSpec, IVersion } from '../IComponent'
import { IExternalDocumentation2, IExternalDocumentation2Definition } from './IExternalDocumentation'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'

export class ExternalDocumentation extends EnforcerComponent<IExternalDocumentation2Definition, ExternalDocumentation> implements IExternalDocumentation2 {
  [extension: `x${string}`]: any
  description?: string
  url!: string

  constructor (definition: IExternalDocumentation2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#external-documentation-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static validate (definition: IExternalDocumentation2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static getSchema = getSchema
}
