import { OASComponent } from './'
import { Component, ComponentSchema } from './helpers/builder-validator-types'
import { PathItem } from './PathItem'
import { LocationInput } from '../Exception'

export function schemaGenerator<Definition> (PathItemComponent: Component): ComponentSchema<Definition> {
  return new ComponentSchema<Definition>({
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
          exception.add.noPathsDefined(data, { node: definition })
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
          const locations: LocationInput[] = paths.map(key => {
            return {
              node: definition,
              key,
              type: 'key'
            }
          })
          exception.add.pathEndingsInconsistent(data, locations, includesTrailingSlashes, omitsTrainingSlashes)
        }
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
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class Paths<Operation> extends OASComponent {
  extensions!: Record<string, any>
  path!: {
    [path: string]: PathItem<Operation>
  }
}
