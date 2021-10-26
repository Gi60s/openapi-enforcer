import {
  Data,
  Dereferenced,
  Version,
  Exception,
  Referencable,
  ComponentSchema, OASComponent
} from '../'
import * as Example from './Example'
import * as Reference from '../Reference'
import * as Schema from '../Schema'
import { parameterDataType, schemaGenerator } from '../Parameter'

export interface Definition {
  [key: `x-${string}`]: any
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  allowReserved?: boolean
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Example.Definition | Reference.Definition>
  explode?: boolean
  required?: boolean
  schema?: Schema.Definition3 | Reference.Definition
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'
}

export class Parameter<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly name!: string
  readonly in!: 'body' | 'cookie' | 'formData' | 'header' | 'path' | 'query'
  readonly allowEmptyValue?: boolean
  readonly description?: string
  readonly required?: boolean
  readonly schema?: Referencable<HasReference, Schema.Schema>

  // v3 properties
  readonly allowReserved?: boolean
  readonly deprecated?: boolean
  readonly example?: any
  readonly examples?: Record<string, Referencable<HasReference, Example.Example>>
  readonly explode?: boolean
  readonly style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'

  constructor (definition: Definition, version?: Version) {
    super(Parameter, definition, version, arguments[2])
  }

  static dataType = parameterDataType

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#parameter-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#parameter-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#parameter-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#parameter-object'
  }

  static schemaGenerator (data: Data<Definition>): ComponentSchema<Definition> {
    return schemaGenerator(Parameter, data)
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
