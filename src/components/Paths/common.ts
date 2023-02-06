import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { getLocation } from '../../Locator/Locator'
import { methods } from '../PathItem/common'
import { IPaths2, IPaths3 } from './IPaths'
import { IPathItemMethod, IFindPathMatchesOptions, IFindPathMatchesResult } from '../PathItem'
import { IPathsDefinition, IPaths } from '../IInternalTypes'
import { getMessage } from '../../i18n/i18n'

interface IPathLink {
  type: 'static' | 'param'
  value: string
}

interface IPathConflict {
  paths: string[]
  methods: Record<IPathItemMethod, number>
  conflict: 'none' | 'partial' | 'full'
}

interface IPathRegExp {
  path: string
  paramNames: string[]
  regexCaseSensitive: RegExp
  regexCaseInsensitive: RegExp
}

const rxPathVariable = /^({.+?})$/
const pathLookupMap: WeakMap<IPathsDefinition, IPathRegExp[]> = new WeakMap<IPaths2 | IPaths3, IPathRegExp[]>()

export const build = function (this: IPaths2 | IPaths3, data: SchemaProcessor): void {
  const { definition } = data
  const paths = Object.keys(definition)

  const rxPaths: IPathRegExp[] = []
  pathLookupMap.set(this, rxPaths)

  paths.forEach(path => {
    const rxFind = /{([^}]+)}/g
    const paramNames: string[] = []
    let subStr
    let rxStr = ''
    let offset = 0
    let match: RegExpMatchArray | null
    while ((match = rxFind.exec(path)) !== null) {
      paramNames.push(match[1])
      subStr = path.substring(offset, match.index)
      rxStr += escapeRegExp(subStr) + '([\\s\\S]+?)'
      offset = (match.index ?? 0) + match[0].length
    }
    subStr = path.substring(offset)
    if (subStr.length > 0) {
      rxStr += escapeRegExp(subStr)
    }
    rxStr = rxStr.replace(/\/+$/, '')

    rxPaths.push({
      paramNames,
      path,
      regexCaseSensitive: new RegExp('^' + rxStr + '$'),
      regexCaseInsensitive: new RegExp('^' + rxStr + '$', 'i')
    })
  })
}

export const validate = function (this: IPaths2 | IPaths3, data: SchemaProcessor<IPathsDefinition, IPaths>): void {
  const { definition } = data
  const { reference, id } = data.component
  const paths = Object.keys(definition)

  const { exception } = data
  if (paths.length === 0) {
    // according to the spec, it is allowed to have an empty paths object, but the user may want to know, so we
    // register it as an "ignore" and if the user wants then they can change the level
    exception.add({
      id,
      code: 'PATHS_EMPTY',
      level: 'ignore',
      locations: [getLocation(definition)],
      reference
    })
  } else {
    const pathsEndingWithSlash: string[] = []
    const pathsEndingWithoutSlash: string[] = []
    const store: Record<string, IPathConflict> = {}

    paths.forEach(path => {
      // look for paths that do not start with a slash
      if (path[0] !== '/') {
        exception.add({
          id,
          code: 'PATH_MISSING_LEADING_SLASH',
          level: 'error',
          locations: [getLocation(definition, path, 'key')],
          metadata: { path },
          reference
        })
      }

      // check for consistent line endings
      const lastChar = path.slice(-1)
      if (lastChar === '/') {
        pathsEndingWithSlash.push(path)
      } else {
        pathsEndingWithoutSlash.push(path)
      }

      // check for path conflicts
      // a "warn" exception will be issued if paths conflict but methods are different
      // an "error" exception will be issued if paths conflict and methods conflict
      const parsed = parsePath(path)
      const parsedKey = parsed.map(item => item.type === 'param' ? '{}' : item.value).join('/')
      const currMethods = methods.filter(method => method in (definition as any)[path])
      if (store[parsedKey] === undefined) {
        store[parsedKey] = {
          paths: [path],
          methods: {
            get: currMethods.includes('get') ? 1 : 0,
            put: currMethods.includes('put') ? 1 : 0,
            post: currMethods.includes('post') ? 1 : 0,
            delete: currMethods.includes('delete') ? 1 : 0,
            options: currMethods.includes('options') ? 1 : 0,
            head: currMethods.includes('head') ? 1 : 0,
            patch: currMethods.includes('patch') ? 1 : 0,
            trace: currMethods.includes('trace') ? 1 : 0
          },
          get conflict (): 'none' | 'partial' | 'full' {
            const length = methods.length
            let result: 'none' | 'partial' | 'full' = 'none'
            if (this.paths.length > 1) result = 'partial'
            for (let i = 0; i < length; i++) {
              if (this.methods[methods[i]] > 1) {
                result = 'full'
                break
              }
            }
            return result
          }
        }
      } else {
        const match = store[parsedKey]
        currMethods.forEach(method => {
          match.methods[method]++
        })
      }
    })

    Object.keys(store).forEach(key => {
      const item = store[key]
      if (item.conflict === 'partial') {
        exception.add({
          id,
          code: 'PATH_SPEC_CONFLICT',
          level: 'warn',
          locations: item.paths.map(path => getLocation(definition, path, 'key')),
          metadata: { paths: item.paths },
          reference
        })
      } else if (item.conflict === 'full') {
        exception.add({
          id,
          code: 'PATH_OPERATION_CONFLICT',
          level: 'error',
          locations: item.paths.map(path => getLocation(definition, path, 'key')),
          metadata: { paths: item.paths },
          reference
        })
      }
    })

    if (pathsEndingWithSlash.length > 0 && pathsEndingWithoutSlash.length > 0) {
      exception.add({
        id,
        code: 'PATH_ENDINGS_INCONSISTENT',
        level: 'ignore',
        locations: paths.map(path => getLocation(definition, path, 'key')),
        metadata: { pathsEndingWithSlash, pathsEndingWithoutSlash }
      })
    }
  }
}

export function findPathMatches (context: IPaths2 | IPaths3, searchPath: string, options: Required<IFindPathMatchesOptions>): IFindPathMatchesResult {
  const lookups = pathLookupMap.get(context)
  const results: Array<{
    params: Record<string, string>
    path: string
  }> = []

  searchPath = searchPath.split('?')[0]
  if (options.trimTrailingSlashes) {
    searchPath = searchPath.replace(/\/+$/, '')
  }

  if (lookups !== undefined) {
    const length = lookups.length
    for (let i = 0; i < length; i++) {
      const lookup = lookups[i]
      const rx = options.useCaseSensitivePaths ? lookup.regexCaseSensitive : lookup.regexCaseInsensitive
      const match = rx.exec(searchPath)
      if (match !== null) {
        results.push({
          params: Array.from(match).reduce<Record<string, string>>((map, value, index) => {
            if (index > 0) {
              const name = lookup.paramNames[index - 1]
              map[name] = value
            }
            return map
          }, {}),
          path: lookup.path
        })
      }
    }
  }

  return results
}

export function getPathParameterNames (context: IPathsDefinition, path: string): string[] {
  const lookups = pathLookupMap.get(context)
  const match = lookups?.find(lookup => lookup.path === path)
  if (match === undefined) {
    throw new Error(getMessage('PATH_NOT_FOUND', { path }))
  }
  return match.paramNames.slice(0)
}

function escapeRegExp (text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function parsePath (path: string): IPathLink[] {
  return path
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .split('/')
    .map(part => {
      const match = rxPathVariable.exec(part)
      return match === null
        ? { type: 'static', value: part }
        : { type: 'param', value: match[1] }
    })
}
