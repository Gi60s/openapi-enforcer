import { OASComponent } from './'
import { Component, ComponentSchema } from './helpers/builder-validator-types'
import * as E from '../DefinitionException/methods'
import { PathItem } from './PathItem'

export function schemaGenerator<Definition> (PathItemComponent: Component): ComponentSchema<Definition> {
  return {
    allowsSchemaExtensions: true,
    validator: {
      after (data) {
        const {
          built,
          definition,
          exception
        } = data.context

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
              return {
                node: definition,
                key,
                type: 'key'
              }
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
      namespace: 'path',
      schema: {
        type: 'component',
        allowsRef: false,
        component: PathItemComponent
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class Paths extends OASComponent {
  extensions!: Record<string, any>
  path!: {
    [path: string]: PathItem
  }
}
