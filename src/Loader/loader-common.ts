import { ILoaderMetadata, ILoaderOptions, ILoaderReplacements } from './ILoader'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { getMessage } from '../i18n/i18n'
import { ILocation, ILookupLocation } from '../Locator/ILocator'
import { Adapter } from '../Adapter/Adapter'
import { copy } from '../util'
export const map = new WeakMap<object, ILookupLocation>()
export const rootNodeFileCache = new WeakMap<object, Record<string, any>>()

export function appendToPath (path: string, value: string): string {
  return path + '/' + value.replace(/~/g, '~0').replace(/\//g, '~1')
}

export function applyPositionInformation (path: string, node: object, options: ILoaderOptions, data: ILoaderMetadata): void {
  const isObject = node !== null && typeof node === 'object'
  if (isObject && map.has(node)) return

  if (Array.isArray(node)) {
    const lookup: ILookupLocation = {
      type: 'array',
      loc: {
        path,
        root: data.root
      },
      items: []
    }
    map.set(node, lookup)
    const length = node.length
    for (let index = 0; index < length; index++) {
      const pathPlus = appendToPath(path, String(index))
      lookup.items.push({
        path: pathPlus,
        root: data.root
      })
      applyPositionInformation(pathPlus, node[index], options, data)
    }
  } else if (isObject) {
    const lookup: ILookupLocation = {
      type: 'object',
      loc: {
        path,
        root: data.root
      },
      properties: {}
    }
    map.set(node, lookup)

    const n = node as Record<string, any>
    Object.keys(n)
      .forEach(key => {
        const pathPlus = appendToPath(path, key)
        lookup.properties[key] = {
          key: { path: pathPlus, root: data.root },
          value: { path: pathPlus, root: data.root }
        }
        applyPositionInformation(appendToPath(path, key), n[key] as object, options, data)
      })
  }
}

export function convertPathToBreadcrumbs (path: string): string {
  return path
    .replace(/^#\//, '')
    .split('/')
    .map(value => value.replace(/~0/g, '~').replace(/~1/g, '/'))
    .join(' > ')
}

/**
 * Attempts to find the file path location of a node. It can optionally target a key that can be a number (for arrays)
 * or a string (for objects) and specify whether the location information should represent the key's location, the value's
 * location, or both.
 * @param node The object or parent object to search for.
 * @param key An array index or object property name.
 * @param filter Whether to get the location of the 'key', 'value', or 'both'. Defaults to 'both'.
 * @returns Undefined if the node has no known file location, otherwise it will attempt to give the location as specified by the filter falling back to using the entire object's location if the key cannot be found.
 */
export function getLocation (node: object, key?: string | number, filter: 'key' | 'value' | 'both' = 'both'): ILocation | undefined {
  const lookup = map.get(node)
  if (lookup === undefined) return

  if (key !== undefined) {
    if (lookup.type === 'object') {
      const match = lookup.properties[key]
      if (match === undefined) {
        return lookup.loc
      } else {
        if (filter === 'both') {
          const key = match.key
          return {
            path: key.path,
            end: match.value.end,
            root: key.root,
            start: key.start
          }
        } else if (filter === 'key') {
          return match.key
        } else if (filter === 'value') {
          return match.value
        }
      }
    } else if (lookup.type === 'array') {
      return lookup.items[key as number]
    }
  } else {
    return lookup.loc
  }
}

export function normalizeLoaderMetadata (data?: ILoaderMetadata): ILoaderMetadata {
  data = Object.assign({}, data)
  if (data.exceptionStore === undefined) data.exceptionStore = new ExceptionStore()
  if (data.fileCache === undefined) data.fileCache = {}
  if (data.root === undefined) data.root = { source: '', node: {} }
  return data
}

export function normalizeLoaderOptions (options?: Partial<ILoaderOptions>): ILoaderOptions {
  options = Object.assign({}, options)
  if (typeof options !== 'object') throw Error(getMessage('OPTIONS_INVALID', { details: '' }))
  if (options.dereference === undefined) options.dereference = true
  return options as ILoaderOptions
}

export function overwriteReplacementsWithCopies (replacements: ILoaderReplacements): void {
  replacements.forEach(({ parent, key, value }) => {
    (parent as Record<string, any>)[key] = copy(value)
  })
}

export function traverse (node: any, path: string): any {
  if (path === '') return node

  const keys = path.substring(2).split('/')
  let o = node
  while (keys.length > 0) {
    const key = keys?.shift()?.replace(/~1/g, '/').replace(/~0/g, '~')
    if (key !== undefined && key !== '#') {
      if (o !== null && typeof o === 'object' && key in o) {
        o = o[key]
      } else {
        return
      }
    }
  }
  return o
}

export function traverseFromNode (node: object, ref: string): any {
  const loc = map.get(node)?.loc
  if (loc === undefined) return

  const { node: nodeRoot, source: nodeSource } = loc.root

  if (ref.startsWith('#/')) {
    return traverse(nodeRoot, ref)
  } else {
    const fileCache = rootNodeFileCache.get(nodeRoot)
    if (fileCache === undefined) return

    const [childPath, subRef] = ref.split('#/')
    const dirPath = Adapter.path.dirname(nodeSource)
    const absoluteChildPath = Adapter.path.resolve(dirPath, childPath)
    const rootNode = fileCache[absoluteChildPath]
    if (rootNode === undefined) return

    return traverse(rootNode, subRef)
  }
}
