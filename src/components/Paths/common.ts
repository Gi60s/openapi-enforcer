import { ISchemaProcessor } from '../ISchemaProcessor'
import { getLocation } from '../../Locator/Locator'
import { methods } from '../PathItem/common'

interface IPathLink {
  type: 'static' | 'param'
  value: string
}

const rxPathVariable = /^({.+?})$/

export const after = function (data: ISchemaProcessor<any, any>, mode: 'build' | 'validate'): void {
  if (mode === 'validate') {
    const { definition, id, reference } = data.cmp
    const { exception } = data.root
    const paths = Object.keys(definition)
    if (paths.length === 0) {
      // according to the spec, it is allowed to have an empty paths object, but the user may want to know, so we
      // register it as an "ignore" and if the user wants then they can change the level
      exception.add({
        id: id + '_PATHS_EMPTY',
        level: 'ignore',
        locations: [getLocation(definition)],
        message: 'No paths were provided.',
        reference
      })
    } else {
      const pathsEndingWithSlash: string[] = []
      const pathsEndingWithoutSlash: string[] = []
      const store: Record<string, IPathLink[]> = {}
      const pathMethods: Record<string, string[]> = {}

      paths.forEach(path => {
        // look for paths that do not start with a slash
        if (path[0] !== '/') {
          exception.add({
            id: id + '_PATH_MISSING_LEADING_SLASH',
            level: 'error',
            locations: [getLocation(definition, path, 'key')],
            message: 'The path should start with a forward slash.',
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
        const parsedLength = parsed.length
        const currMethods = methods.filter(method => method in definition[path])
        const partialConflictPaths: string[] = [path]
        const fullConflictPaths: string[] = [path]
        Object.keys(store)
          .filter(key => store[key].length === parsedLength) // limit to paths with matching length
          .forEach(key => {
            const p = store[key]
            for (let i = 0; i < parsedLength; i++) {
              const prev = p[i]
              const curr = parsed[i]
              if (prev.type !== curr.type) return // different types
              if (prev.type === 'static' && prev.value !== curr.value) return // both static, different values
            }

            TODO: fix duplication of errors. It could find a problem between two and report, then find another and report again on three

            // they match so far, check for matching methods
            const existingMethods = pathMethods[key]
            const intersection = currMethods.filter(method => existingMethods.includes(method))
            if (intersection.length > 0) {
              fullConflictPaths.push(key)
            } else {
              partialConflictPaths.push(key)
            }
          })

        pathMethods[path] = currMethods
        store[path] = parsed

        if (fullConflictPaths.length > 1) {
          exception.add({
            id: id + '_PATH_OPERATION_CONFLICT',
            level: 'error',
            locations: fullConflictPaths.map(path => getLocation(definition, path, 'key')),
            message: 'One or more paths are indistinguishable due to duplicate paths and methods.',
            metadata: { paths: fullConflictPaths },
            reference
          })
        }

        if (partialConflictPaths.length > 1) {
          exception.add({
            id: id + '_PATH_CONFLICT',
            level: 'warn',
            locations: partialConflictPaths.map(path => getLocation(definition, path, 'key')),
            message: 'One or more paths are duplicates, although they do have different methods which makes them distinguishable.',
            metadata: { paths: partialConflictPaths },
            reference
          })
        }
      })

      if (pathsEndingWithSlash.length > 0 && pathsEndingWithoutSlash.length > 0) {
        exception.add({
          id: id + '_PATH_ENDINGS_INCONSISTENT',
          level: 'ignore',
          locations: paths.map(path => getLocation(definition, path, 'key')),
          message: 'Some paths end with a slash and some do not. This may confuse the users of your API.',
          metadata: { pathsEndingWithSlash, pathsEndingWithoutSlash }
        })
      }
    }
  }
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
