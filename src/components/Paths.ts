import {
  OASComponent,
  Version,
  Exception,
  Dereferenced,
  ComponentSchema
} from './'
import * as E from '../Exception/methods'
import * as PathItem from './PathItem'

export interface Definition {
  [key: `x-${string}`]: any
  [path: string]: PathItem.Definition
}

const schemaPaths: ComponentSchema<Definition> = {
  allowsSchemaExtensions: true,
  validator: {
    after (data) {
      const { built, definition, exception } = data.context

      const paths = Object.keys(built)
      const includesTrailingSlashes: string[] = []
      const omitsTrainingSlashes: string[] = []

      // no paths defined
      if (paths.length === 0) {
        const noPathsDefined = E.noPathsDefined({
          definition,
          locations: [{ node: definition }]
        })
        exception.message(noPathsDefined)
      }

      // determine which paths include a trailing slash and which dont
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
        const pathEndingsInconsistent = E.pathEndingsInconsistent(includesTrailingSlashes, omitsTrainingSlashes, {
          definition,
          locations: paths.map(key => {
            return { node: definition, key, type: 'key' }
          })
        })
        exception.message(pathEndingsInconsistent)
      }

      // check for duplicate operation ids
      data.root.lastly.push(() => {
        const map = data.root.metadata.operationIdMap
        Object.keys(map).forEach(operationId => {
          const operationDataArray = map[operationId]

          // if there is an operationId that belongs to more than one operation then we have a problem
          if (operationDataArray.length > 1) {
            const { reference } = operationDataArray[0].component
            E.operationIdMustBeUnique(operationId, operationDataArray, {
              definition, // paths object definition
              locations: operationDataArray.map(operationData => {
                const { definition: node } = operationData.context
                return {
                  node,
                  key: 'operationId',
                  type: 'value'
                }
              }),
              reference
            })
          }
        })
      })
    }
  },
  additionalProperties: {
    type: 'component',
    allowsRef: false,
    component: PathItem.PathItem
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Paths<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly [path: string]: PathItem.PathItem<HasReference>

  constructor (definition: Definition, version?: Version) {
    super(Paths, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#paths-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#paths-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#paths-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#paths-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#paths-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return schemaPaths
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
