import { PathItem } from '../PathItem/PathItem3'

import { ICallback3, ICallback3Definition } from './ICallback'
import { EnforcerComponent } from '../Component'
import { IComponentSchemaObject } from '../IComponentSchema'
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'

const schema: IComponentSchemaObject = {
  type: 'object',
  allowsSchemaExtensions: true,
  additionalProperties: {
    type: 'component',
    allowsRef: false,
    component: PathItem
  }
}

export class Callback extends EnforcerComponent implements ICallback3 {
  [extension: `x${string}`]: any
  [expression: string]: PathItem

  constructor (definition: ICallback3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#callback-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#callback-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#callback-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#callback-object'
  }

  static getSchema (): IComponentSchemaObject {
    return schema
  }

  static validate (definition: ICallback3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }
}
