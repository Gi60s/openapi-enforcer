import { ILocation, ILookupLocation } from './ILocator'

const map = new WeakMap<Record<string, any> | any[], ILookupLocation>()

export function saveLocation (ref: Record<string, any> | any[], location: ILocation): ILookupLocation {
  if (Array.isArray(ref)) {
    const lookup: ILookupLocation = {
      type: 'array',
      loc: location,
      items: []
    }
    map.set(ref, lookup)
    return lookup
  } else if (typeof ref === 'object' && ref !== null) {
    const lookup: ILookupLocation = {
      type: 'object',
      loc: location,
      properties: {}
    }
    map.set(ref, lookup)
    return lookup
  } else {
    throw Error('Invalid reference. It must be a non-null object or an array.')
  }
}

export function getLocation (ref: Record<string, any> | any[], key?: string | number, filter: 'key' | 'value' | 'both' = 'both'): ILocation | undefined {
  const lookup = map.get(ref)
  if (lookup === undefined) return

  if (key !== undefined) {
    if (lookup.type === 'object') {
      const match = lookup.properties[key]
      if (match !== undefined) {
        if (filter === 'both') {
          return {
            breadcrumbs: match.key.breadcrumbs,
            end: match.value.end,
            source: match.key.source,
            start: match.key.start
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
