import { ILoaderMetadata, ILoaderOptions } from './ILoader'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { getMessage } from '../i18n/i18n'
import { ILocation, ILookupLocation } from '../Locator/ILocator'
export const map = new WeakMap<object, ILookupLocation>()

export function appendToPath (path: string, value: string): string {
  return path + '/' + value.replace(/~/g, '~0').replace(/\//g, '~1')
}

export function convertPathToBreadcrumbs (path: string): string {
  return path
    .split('/')
    .map(value => value.replace(/~0/g, '~').replace(/~1/g, '/'))
    .join(' > ')
}

export function getLocation (node: object, key?: string | number, filter: 'key' | 'value' | 'both' = 'both'): ILocation | undefined {
  const lookup = map.get(node)
  if (lookup === undefined) return

  if (key !== undefined) {
    if (lookup.type === 'object') {
      const match = lookup.properties[key]
      if (match !== undefined) {
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
  if (data.cache === undefined) data.cache = {}
  return data
}

export function normalizeLoaderOptions (options?: Partial<ILoaderOptions>): ILoaderOptions {
  options = Object.assign({}, options)
  if (typeof options !== 'object') throw Error(getMessage('OPTIONS_INVALID', { details: '' }))
  if (options.dereference === undefined) options.dereference = true
  if (options.reload === undefined) options.reload = true
  return options as ILoaderOptions
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
