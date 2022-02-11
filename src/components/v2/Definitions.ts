import { DefinitionException } from '../../Exception'
import { OASComponent, componentValidate } from '../index'
import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { Definitions2 as Definition } from '../helpers/definition-types'
import { Schema } from './Schema'

let definitionsSchema: ComponentSchema<Definition>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Definitions extends OASComponent<Definition, typeof Definitions> {
  definition!: {
    [name: string]: Schema
  }

  constructor (definition: Definition, version?: Version) {
    super(Definitions, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#definitions-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (definitionsSchema === undefined) {
      definitionsSchema = new ComponentSchema({
        allowsSchemaExtensions: false,
        additionalProperties: {
          namespace: 'definition',
          schema: {
            type: 'component',
            allowsRef: false,
            component: Schema
          }
        }
      })
    }
    return definitionsSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
