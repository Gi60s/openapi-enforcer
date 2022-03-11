import { OASComponent } from './'
import { Component, ComponentSchema } from './helpers/builder-validator-types'
import { Operation } from './Operation'
import { PathItem } from './PathItem'
import { LocationInput } from '../Exception'
import {
  Method,
  GetOperationOptions,
  GetOperationResult,
  PathsFindPathResult
} from './helpers/function-interfaces'
import { edgeSlashes } from '../utils/util'

const pathParsersMap: WeakMap<Paths<any>, PathParserStore> = new WeakMap()

type PathParser = (path: string) => PathsFindPathResult<Operation, PathItem<Operation>> | undefined
type PathParserStore = PathParser[]

export function schemaGenerator<Definition> (PathItemComponent: Component): ComponentSchema<Definition> {
  return new ComponentSchema<Definition>({
    allowsSchemaExtensions: true,
    builder: {
      after (data) {
        const { built } = data.context

        // build path parser functions
        const parsers: PathParserStore = []
        pathParsersMap.set(built, parsers)
        Object.keys(built.paths).forEach((path: string) => {
          const pathItem = built.paths[path] as PathItem<any>
          const parameterNames: string[] = []

          // generate a regular expression that can be used to compare paths
          const rxFind = /{([^}]+)}/g
          let match: RegExpMatchArray | null
          let subStr
          let rxStr = ''
          let offset = 0
          while (((match = rxFind.exec(path)) != null)) {
            parameterNames.push(match[1])
            subStr = path.substring(offset, match.index)
            rxStr += escapeRegExp(subStr) + '([\\s\\S]+?)'
            offset = (match.index as number) + match[0].length
          }
          subStr = path.substr(offset)
          if (subStr.length > 0) rxStr += escapeRegExp(subStr)
          const rx = new RegExp('^' + rxStr + '$')

          // define parser function
          const parser: PathParser = (path: string) => {
            // check if this path is a match
            const match = rx.exec(path)
            if (match == null) return

            // get path parameter strings
            const pathParams: Record<string, string> = {}
            parameterNames.forEach((name, index) => {
              pathParams[name] = match[index + 1]
            })

            return {
              params: pathParams,
              path,
              pathItem
            }
          }
          parsers.push(parser)
        })
      }
    },
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

        // determine which paths include a trailing slash and which don't
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
      namespace: 'paths',
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
  paths!: {
    [path: string]: PathItem<Operation>
  }

  findOperation<P extends PathItem<any>> (method: Method, path: string, options?: GetOperationOptions): GetOperationResult<any, any> | undefined {
    if (options === undefined) options = {}
    if (options.normalizePath === undefined) options.normalizePath = true

    path = path.split('?')[0]

    method = method.toLowerCase() as Method
    path = path.split('?')[0]
    if (options?.normalizePath) path = edgeSlashes(path, true, false)

    const match = this.findPath(path)
    const pathItem = match?.pathItem
    const operation = pathItem?.[method]
    if (operation === undefined) return

    return {
      operation,
      params: match?.params as Record<string, string>,
      path: match?.path as string,
      pathItem: pathItem as P
    }
  }

  findPath (path: string): PathsFindPathResult<any, any> | undefined {
    const parsers = pathParsersMap.get(this)
    if (parsers === undefined) throw Error('Invalid execution context. Make sure you are calling from the context of the Paths instance.')

    const length = parsers.length
    for (let i = 0; i < length; i++) {
      const match = parsers[i](path)
      if (match !== null) return match
    }
  }
}

function escapeRegExp (text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
