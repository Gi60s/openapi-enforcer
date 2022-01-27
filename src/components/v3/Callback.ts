import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { OASComponent, componentValidate } from '../index'
import { PathItem } from './PathItem'
import { Callback3 as Definition } from '../helpers/definition-types'

let callbackSchema: ComponentSchema<Definition>

export class Callback extends OASComponent {
  extensions!: Record<string, any>
  expression!: {
    [expression: string]: PathItem
  }

  constructor (definition: Definition, version?: Version) {
    super(Callback, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#callback-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#callback-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#callback-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#callback-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (callbackSchema === undefined) {
      callbackSchema = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        additionalProperties: {
          namespace: 'expression',
          schema: {
            type: 'component',
            allowsRef: false,
            component: PathItem
          }
        }
      })
    }
    return callbackSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
