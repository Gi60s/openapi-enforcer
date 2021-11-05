import {
  Data,
  Dereferenced,
  Version,
  DefinitionException,
  Referencable,
  ComponentSchema, OASComponent
} from '../'
import { Example } from './Example'
import { Schema } from './Schema'
import * as Core from '../Parameter'
import { Parameter3 as Definition } from '../helpers/DefinitionTypes'

export class Parameter<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly name!: string
  readonly in!: 'body' | 'cookie' | 'formData' | 'header' | 'path' | 'query'
  readonly allowEmptyValue?: boolean
  readonly description?: string
  readonly required?: boolean
  readonly schema?: Referencable<HasReference, Schema>

  // v3 properties
  readonly allowReserved?: boolean
  readonly deprecated?: boolean
  readonly example?: any
  readonly examples?: Record<string, Referencable<HasReference, Example>>
  readonly explode?: boolean
  readonly style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'

  constructor (definition: Definition, version?: Version) {
    super(Parameter, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#parameter-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#parameter-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#parameter-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#parameter-object'
  }

  static schemaGenerator (data: Data<Definition>): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Parameter,
      Schema: Schema
    }, data)
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
