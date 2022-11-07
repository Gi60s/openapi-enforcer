import { Schema } from '../Schema/Schema2'
import { IDefinitions2, IDefinitions2Definition } from './IDefinitions'
import { IComponentSpec, IVersion } from '../IComponent'
import { IComponentSchemaDefinition } from '../IComponentSchema'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'

const schema: IComponentSchemaDefinition<IDefinitions2Definition, IDefinitions2> = {
  type: 'object',
  allowsSchemaExtensions: false,
  additionalProperties: {
    type: 'component',
    allowsRef: false,
    component: Schema
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Definitions extends EnforcerComponent implements IDefinitions2 {
  [name: string]: Schema

  constructor (definition: IDefinitions2, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#definitions-object',
    '3.0.0': false,
    '3.0.1': false,
    '3.0.2': false,
    '3.0.3': false
  }

  static getSchema (): IComponentSchemaDefinition<IDefinitions2Definition, IDefinitions2> {
    return schema
  }

  static validate (definition: IDefinitions2, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }
}
