import { ILoaderMetadata, ILoaderOptions } from './ILoader'
import { Result } from '../Result'
import { ILookupLocation } from '../Locator/ILocator'
import {
  appendToPath,
  applyPositionInformation,
  getLocation,
  map,
  normalizeLoaderMetadata,
  normalizeLoaderOptions,
  traverse
} from './loader-common'

/**
 * Accepts an object and resolves any $ref instances as long as those $refs are local to the current object. This method
 * is also used to associate location information with an object.
 * @param definition The object to load.
 * @param [options] Load options.
 * @param [options.dereference=true] Whether to resolve $ref values.
 * @returns Result with the value of the loaded object.
 */
export function load (definition: object, options?: Partial<ILoaderOptions>): Result {
  return loadWithData(definition, normalizeLoaderOptions(options), normalizeLoaderMetadata())
}

/**
 * Accepts an object and resolves any $ref instances as long as those $refs are local to the current object. This method
 * is also used to associate location information with an object. If an error is encountered then it will be thrown.
 * @param definition The object to load.
 * @param [options] Load options.
 * @param [options.dereference=true] Whether to resolve $ref values.
 * @returns The loaded object.
 */
export function loadAndThrow<T extends object=object> (definition: T, options?: ILoaderOptions): T {
  const { error } = loadWithData(definition, normalizeLoaderOptions(options), normalizeLoaderMetadata())
  if (error !== undefined) throw Error(error.toString())
  return definition
}

export function loadWithData (definition: object, options: ILoaderOptions, data: ILoaderMetadata): Result {
  // if this object has already been loaded then we exit now
  const found = map.get(definition)
  if (found !== undefined) return new Result(definition)

  data.root = { source: '', node: definition }
  applyPositionInformation('#', definition, options, data)

  const parent = { _: definition }
  if (options.dereference) resolveRefs('#', data, parent, '_')
  return new Result(parent._, data.exceptionStore)
}

function resolveRefs (path: string, data: ILoaderMetadata, parent: object, key: string): void {
  const node = (parent as Record<string, any>)[key] as object
  const isObject = node !== null && typeof node === 'object'

  if (Array.isArray(node)) {
    const length = node.length
    for (let index = 0; index < length; index++) {
      const i = String(index)
      resolveRefs(appendToPath(path, i), data, node, i)
    }
  } else if (isObject) {
    const n = node as Record<string, any>
    if (n.$ref === undefined) {
      Object.keys(n)
        .forEach(key => {
          resolveRefs(appendToPath(path, key), data, n, key)
        })
    } else if (typeof n.$ref === 'string') {
      if (!n.$ref.startsWith('#/')) {
        data.exceptionStore.add({
          id: 'LOADER',
          code: 'REF_NOT_RESOLVED',
          level: 'error',
          locations: [getLocation(node, '$ref', 'value')],
          metadata: { reference: n.$ref }
        })
      } else {
        const found = traverse(data.root.node, n.$ref)
        if (found === undefined) {
          data.exceptionStore.add({
            id: 'LOADER',
            code: 'REF_NOT_RESOLVED',
            level: 'error',
            locations: [getLocation(node, '$ref', 'value')],
            metadata: { reference: n.$ref }
          })
        } else {
          (parent as Record<string, any>)[key] = found
        }
      }
    } else {
      data.exceptionStore.add({
        id: 'LOADER',
        code: 'REF_NOT_RESOLVED',
        level: 'error',
        locations: [getLocation(node, '$ref', 'value')],
        metadata: { reference: n.$ref }
      })
    }
  }
}
