import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import { Operation } from './Operation'
import { Server } from './Server'
import { Parameter } from './Parameter'
import * as Core from '../PathItem'
import { PathItem3 as Definition } from '../helpers/definition-types'
import { OpenAPI } from './OpenAPI'

const methods = Core.methods.concat(['trace'])
let pathItemSchema: ComponentSchema<Definition>

export class PathItem extends Core.PathItem<Operation> {
  description?: string
  parameters?: Parameter[]
  trace?: Operation
  servers?: Server[]
  summary?: string

  constructor (definition: Definition, version?: Version) {
    super(PathItem, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#path-item-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#path-item-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#path-item-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#path-item-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (pathItemSchema === undefined) {
      pathItemSchema = Core.schemaGenerator({
        Operation: Operation,
        Parameter: Parameter
      }, methods)

      pathItemSchema.hook('after-build', data => {
        const built = data.context.built as PathItem

        // if there is no "servers" property then copy from OpenAPI.servers
        if (built.servers === undefined) {
          data.root.lastly.push(() => {
            const openapi = built.enforcer.findAncestor(OpenAPI) as OpenAPI
            if (openapi?.servers !== undefined) built.servers = openapi.servers.slice(0)
          })
        }
      })
    }
    return pathItemSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
