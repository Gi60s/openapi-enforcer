import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { yes } from '../util'
import * as E from '../Exception/methods'
import * as PathItem from './PathItem'

export interface Definition {
  [pathOrExtension: string]: PathItem.Definition | any
}

export class Paths extends OASComponent {
  [pathOrExtension: string]: PathItem.PathItem | any

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Paths object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#paths-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#paths-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#paths-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#paths-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#paths-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      after ({ definition, exception }) {
        const paths = Object.keys(definition)
        const includesTrailingSlashes: string[] = []
        const omitsTrainingSlashes: string[] = []

        // no paths defined
        if (paths.length === 0) {
          exception.message(E.noPathsDefined())
        }

        paths.forEach((key: string) => {
          if (key !== '/') {
            if (key[key.length - 1] === '/') {
              includesTrailingSlashes.push(key)
            } else {
              omitsTrainingSlashes.push(key)
            }
          }
        })

        // inconsistent path endings
        if (includesTrailingSlashes.length > 0 && omitsTrainingSlashes.length > 0) {
          exception.message(E.pathEndingsInconsistent(includesTrailingSlashes, omitsTrainingSlashes))
        }
      },
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: PathItem.PathItem
      }
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
