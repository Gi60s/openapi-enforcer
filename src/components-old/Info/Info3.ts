import { IComponentSpec, IVersion } from '../IComponent'
import { IInfo2, IInfo2Definition } from '../Info/IInfo'
import { Contact } from '../Contact/Contact3'
import { ILicense } from '../License/License3'
import { getBaseSchema } from './InfoBase'
import { buildComponentFromDefinition, EnforcerComponent, validateComponentDefinition } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISchemaProcessorData } from '../ISchemaProcessor'
import { IComponentSchemaObject } from '../IComponentSchema'
import { IContact2, IContact3 } from '../Contact/IContact'
import { ILicense3 } from '../License/ILicense'

const spec: IComponentSpec = {
  '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#info-object',
  '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#info-object',
  '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#info-object',
  '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#info-object'
}

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
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#info-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#info-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#info-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#info-object'
  }

  static validate (definition: IInfo2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static getSchema (data: ISchemaProcessorData): IComponentSchemaObject {
    if (infoSchema === undefined) infoSchema = getBaseSchema(data, Contact, License)
    return infoSchema
  }
}
