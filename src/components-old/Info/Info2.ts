import { ExceptionStore, IComponentSchemaObject, IComponentSpec, ISchemaProcessorData, IVersion } from '../IComponent'
import { IInfo2, IInfo2Definition } from './IInfo'
import { Contact } from '../Contact/Contact2'
import { ILicense } from '../License/License2'
import { getBaseSchema } from './InfoBase'
import { EnforcerComponent } from '../Component'
import { IContact2 } from '../Contact/IContact'
import { ILicense2 } from '../License/ILicense'

let infoSchema: IComponentSchemaObject

export class Info extends EnforcerComponent<IInfo2Definition, Info> implements IInfo2 {
  [extension: `x${string}`]: any
  title!: string
  description?: string
  termsOfService?: string
  contact?: IContact2
  license?: ILicense2
  version!: string

  constructor (definition: IInfo2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#info-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static validate (definition: IInfo2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static getSchema (data: ISchemaProcessorData): IComponentSchemaObject {
    if (infoSchema === undefined) infoSchema = getBaseSchema(data, Contact, License)
    return infoSchema
  }
}
