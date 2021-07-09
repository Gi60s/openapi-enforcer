import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception, Dereferenced } from './'
import { addExceptionLocation, yes } from '../util'
import * as E from '../Exception/methods'
import * as PathItem from './PathItem'
import { lookupLocation } from '../loader'

export interface Definition {
  [key: `x-${string}`]: any
  [path: string]: PathItem.Definition
}

export class Paths<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly [path: string]: PathItem.PathItem<HasReference>

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', Paths, definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#paths-object',
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#paths-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#paths-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#paths-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#paths-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      after ({ definition, exception }, def) {
        const paths = Object.keys(definition)
        const includesTrailingSlashes: string[] = []
        const omitsTrainingSlashes: string[] = []

        // no paths defined
        if (paths.length === 0) {
          const noPathsDefined = E.noPathsDefined()
          addExceptionLocation(noPathsDefined, lookupLocation(def, 'paths'))
          exception.message(noPathsDefined)
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
          const pathEndingsInconsistent = E.pathEndingsInconsistent(includesTrailingSlashes, omitsTrainingSlashes)
          paths.forEach((path: string) => {
            addExceptionLocation(pathEndingsInconsistent, lookupLocation(definition, path, 'key'))
          })
          exception.message(pathEndingsInconsistent)
        }
      },
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: PathItem.PathItem
      }
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
