import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import { IPathItem3 } from '../../temp-components/interfaces/IPathItem'
import { ICallback3, ICallback3Definition } from './ICallback'
import { OASComponent, componentValidate } from '../index'
import { IVersion } from '../ISchemaProcessor'

let callbackSchema: ComponentSchema<ICallback3Definition>

export class Callback extends OASComponent implements ICallback3 {
  [expression: string]: IPathItem3

  constructor (definition: ICallback3Definition, version?: IVersion) {
    super(Callback, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#callback-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#callback-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#callback-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#callback-object'
  }

  static get schema (): ComponentSchema<ICallback3Definition> {
    if (callbackSchema === undefined) {
      callbackSchema = new ComponentSchema<ICallback3Definition>({
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

  static validate (definition: ICallback3Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
