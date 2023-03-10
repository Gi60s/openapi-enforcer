import { ILoaderMetadata, ILoaderOptions } from './ILoader'
import { Result } from '../Result'
import { ILookupLocation } from '../Locator/ILocator'
import { appendToPath, getLocation, map, normalizeLoaderMetadata, normalizeLoaderOptions, traverse } from './loader-common'

/**
 * Accepts an object and resolves any $ref instances as long as those $refs are local to the current object. This method
 * is also used to associate location information with an object.
 * @param definition The object to load.
 * @param [options] Load options.
 * @param [options.dereference=true] Whether to resolve $ref values.
 * @returns Result with the value of the loaded object.
 */
export function load (definition: object, options?: Partial<ILoaderOptions>): Result {
  const opts = normalizeLoaderOptions(options)

  // if this object has already been loaded then we exit now
  const found = map.get(definition)
  if (found !== undefined && !opts.reload) return new Result(definition)

  const data = normalizeLoaderMetadata(arguments[2])
  processesLoadedData('#', definition, opts, data)

  return new Result(definition, data.exceptionStore)
}

function processesLoadedData (path: string, node: object, options: ILoaderOptions, data: ILoaderMetadata): void {
  const isObject = node !== null && typeof node === 'object'
  if (isObject && !options.reload && map.has(node)) return

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
      processesLoadedData(pathPlus, node[index], options, data)
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
    if (n.$ref === undefined) {
      Object.keys(n)
        .forEach(key => {
          const pathPlus = appendToPath(path, key)
          lookup.properties[key] = {
            key: { path: pathPlus, root: data.root },
            value: { path: pathPlus, root: data.root }
          }
          processesLoadedData(appendToPath(path, key), n[key] as object, options, data)
        })
    } else if (typeof n.$ref === 'string' && options.dereference) {
      const pathPlus = appendToPath(path, '$ref')
      lookup.properties.$ref = {
        key: { path: pathPlus, root: data.root },
        value: { path: pathPlus, root: data.root }
      }

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
          Object.assign(node, found)
          delete n.$ref
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
