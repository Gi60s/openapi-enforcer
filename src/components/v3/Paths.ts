import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import { componentValidate } from '../index'
import { PathItem } from './PathItem'
import { Operation } from './Operation'
import * as Core from '../Paths'
import { Paths3 as Definition } from '../helpers/definition-types'
import { GetOperationOptions, GetOperationResult, Method, PathsFindPathResult } from '../helpers/function-interfaces'

let pathsSchema: ComponentSchema<Definition>

export class Paths extends Core.Paths<Paths> {
  constructor (definition: Definition, version?: Version) {
    super(Paths, definition, version, arguments[2])
  }

  findOperation (method: Method, path: string, options?: GetOperationOptions): GetOperationResult<Operation, PathItem> | undefined {
    return super.findOperation(method, path, options)
  }

  findPaths (path: string): Array<PathsFindPathResult<Operation, PathItem>> {
    return super.findPaths(path)
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#paths-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#paths-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#paths-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#paths-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (pathsSchema === undefined) {
      pathsSchema = Core.schemaGenerator(PathItem)
    }
    return pathsSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
