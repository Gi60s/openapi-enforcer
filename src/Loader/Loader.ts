import { Adapter } from '../Adapter/Adapter'
import jsonParser, { ValueNode } from 'json-to-ast'
import {
  safeLoad as loadYaml,
  Kind as YamlKind,
  YAMLNode as YamlNode,
  YAMLMapping as YamlMapping,
  YAMLSequence as YamlSequence
} from 'yaml-ast-parser'
import { Result } from '../Result'
import {
  ILoader,
  ILoaderFunction,
  ILoaderMetadata,
  ILoaderOptions,
  IReference,
  ILineEnding
} from './ILoader'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { ILocation, ILookupLocationArray, ILookupLocationObject, IPosition } from '../Locator/ILocator'
import { getLocation, saveLocation } from '../Locator/Locator'
import { getMessage } from '../i18n/i18n'

const loaders: ILoader[] = []
const rxJson = /\.json$/
const rxYaml = /\.ya?ml$/

export function define (name: string, loader: ILoaderFunction): void {
  loaders.unshift({ name, loader })
}

// using a load cache, look up a node by its path
export function getReferenceNode (loadMap: Record<string, any>, rootNodePath: string, ref: string): any {
  const rootNode = loadMap[rootNodePath]

  if (rootNode === undefined) return
  if (ref.startsWith('#/')) {
    return traverse(rootNode, ref)
  } else {
    const dirPath = Adapter.path.dirname(rootNodePath)
    let [childPath, subRef] = ref.split('#/')
    childPath = Adapter.path.resolve(dirPath, childPath)
    const node = loadMap[childPath]

    if (node === undefined) return undefined
    if (subRef === undefined) {
      return node
    } else {
      return traverse(node, '#/' + subRef)
    }
  }
}

/**
 * Load a path into memory and register locations.
 */
export async function loadAsync (path: string | object, options?: ILoaderOptions, data?: ILoaderMetadata): Promise<Result> {
  const pathIsString = typeof path === 'string'

  if (options === undefined || options === null) options = {}
  if (typeof options !== 'object') throw Error(getMessage('OPTIONS_INVALID', { details: '' }))
  if (options.dereference === undefined) options.dereference = true
  if (options.workingDirectory === undefined) options.workingDirectory = Adapter.cwd

  if (data === undefined || data === null) data = {}
  if (data.exceptionStore === undefined) data.exceptionStore = new ExceptionStore()
  if (data.cache === undefined) data.cache = {}

  // load content and cache it
  const node = pathIsString
    ? (data.cache[path] !== undefined ? data.cache[path] : await runLoadersAsync(path, data))
    : path
  const hasException = data.exceptionStore.hasError
  if (!hasException && pathIsString) data.cache[path] = node

  // dereference any $refs
  if (!hasException && node !== undefined && options.dereference) {
    const references = findRefs(node)
    const length = references.length
    const dirPath = pathIsString
      ? Adapter.path.dirname(path)
      : options.workingDirectory
    for (let i = 0; i < length; i++) {
      const { ref, parent, key } = references[i]
      let absoluteChildPath: string | undefined
      let n: any // = await dereference(node, ref, data.exception, path)

      // local reference
      if (ref.startsWith('#/')) {
        n = traverse(node, ref)

        // reference to other location
      } else {
        let [childPath, subRef] = ref.split('#/')
        childPath = Adapter.path.resolve(dirPath, childPath)
        absoluteChildPath = childPath
        const [node] = await loadAsync(childPath, options, data)
        if (subRef === undefined) {
          n = node
        } else if (node !== undefined) {
          n = traverse(node, '#/' + subRef)
        }
      }

      if (n === undefined) {
        data.exceptionStore.add({
          id: 'LOADER',
          code: 'REF_NOT_RESOLVED',
          level: 'error',
          locations: [],
          metadata: {
            reference: absoluteChildPath ?? ref
          }
        })
      } else if (parent === null) {
        // no parent means that the root node had the $ref
        return n
      } else {
        parent[key] = n
      }
    }
  }

  return new Result(node, data.exceptionStore)
}

export async function loadAsyncAndThrow<T=any> (path: string | object, options?: ILoaderOptions, data?: ILoaderMetadata): Promise<T> {
  const { value, error } = await loadAsync(path, options, data)
  if (error !== undefined) throw Error(error.toString())
  return value
}

/**
 * This function is run for in memory objects that are used as definitions. These objects will not have a source,
 * line numbers, row numbers, etc. but they can have breadcrumbs and this function creates that object to breadcrumb
 * map.
 * @param object
 * @param breadcrumbs
 */
export function saveObjectLocationData (object: Record<string, any> | any[], breadcrumbs: string = ''): ILocation {
  const existing = getLocation(object)
  if (existing !== undefined) {
    if (existing.source === undefined) {
      // if existing doesn't have a source then compare breadcrumb lengths and keep the shortest
      const prevLength = existing.breadcrumbs.split(' > ').length
      const thisLength = breadcrumbs.split(' > ').length
      if (thisLength < prevLength) {
        existing.breadcrumbs = breadcrumbs
      }
    }
    return existing
  } else if (Array.isArray(object)) {
    const lookup = saveLocation(object, { breadcrumbs }) as ILookupLocationArray
    object.forEach((item, index) => {
      const child = saveObjectLocationData(item,
        breadcrumbs + (breadcrumbs.length > 0 ? ' > ' + String(index) : String(index)))
      lookup.items.push(child)
    })
    return lookup.loc
  } else if (typeof object === 'object' && object !== null) {
    const lookup = saveLocation(object, { breadcrumbs }) as ILookupLocationObject
    Object.keys(object).forEach(key => {
      const breadcrumbsPlus = breadcrumbs + (breadcrumbs.length > 0 ? ' > ' + key : key)
      const child = saveObjectLocationData(object[key], breadcrumbsPlus)
      lookup.properties[key] = {
        key: { breadcrumbs: breadcrumbsPlus },
        value: child
      }
    })
    return lookup.loc
  } else {
    return { breadcrumbs }
  }
}

// find all the $ref properties within the node and its descendants
export function findRefs (node: any, parent: any = null, key: string = '', data: IReference[] = []): IReference[] {
  if (Array.isArray(node)) {
    node.forEach((n, i) => findRefs(n, node, String(i), data))
  } else if (node !== null && typeof node === 'object') {
    if (typeof node.$ref === 'string') {
      data.push({
        key,
        parent,
        ref: node.$ref
      })
    } else {
      Object.keys(node)
        .forEach((key: string) => {
          findRefs(node[key], node, key, data)
        })
    }
  }
  return data
}

/**
 * Convert numeric position into Position object
 * @param pos
 * @param lineEndings
 */
function getLocationFromPosition (pos: number, lineEndings: ILineEnding[]): IPosition {
  const result: IPosition = {
    line: 1,
    column: 1,
    offset: pos
  }
  let lastLine: ILineEnding = lineEndings[0]

  const length = lineEndings.length
  let found: boolean = false
  for (let i = 0; i < length; i++) {
    const lineEnding = lineEndings[i]
    if (lineEnding.pos > pos) {
      const prev = lineEndings[i - 1]
      result.column = prev === undefined
        ? pos + 1
        : pos - (prev.pos + prev.len) + 1
      lastLine = prev
      found = true
      break
    } else {
      result.line++
    }
  }

  if (!found) {
    const prev = lineEndings[length - 1]
    result.column = pos - (prev.pos + prev.len) + 1
  }

  if (result.column <= 0) {
    result.line--
    result.column = lastLine.lineLength + 1
  }

  return result
}

/**
 * This function will attempt to find a loader that will work with the provided path
 */
async function runLoadersAsync (path: string, data: ILoaderMetadata): Promise<any> {
  const length = loaders.length
  const reasons: string[] = []
  for (let i = 0; i < length; i++) {
    const loader = loaders[i]
    const result = await loader.loader(path, data)
    if (!result.loaded) {
      reasons.push(loader.name + ': ' + result.reason)
    } else {
      // if type is not known then maybe the path can tell us
      if (result.type === undefined) {
        if (rxJson.test(path)) {
          result.type = 'json'
        } else if (rxYaml.test(path)) {
          result.type = 'yaml'
        }
      }

      // make a final attempt to determine type
      if (result.type === undefined) {
        try {
          JSON.parse(result.content)
          result.type = 'json'
        } catch (e) {
          result.type = 'yaml'
        }
      }

      if (result.type === 'json' || result.type === undefined) {
        let value: any
        if (result.type === undefined) {
          try {
            value = JSON.parse(result.content)
          } catch (e) {
            if (result.type === 'json') throw e
          }
        } else {
          value = result.content
        }

        if (value !== undefined) {
          const ast = jsonParser(result.content, { source: path })
          return processJsonAst(ast, '')
        }
      }

      if (result.type === 'yaml' || result.type === undefined) {
        const rx = /\r\n|\r|\n/g
        const content = result.content
        const lineEndings: ILineEnding[] = []
        let linePos = 0
        let match
        while ((match = rx.exec(content)) !== null) {
          lineEndings.push({
            pos: match.index,
            len: match[0].length,
            lineLength: match.index - linePos
          })
          linePos = match.index + match[0].length
        }
        const ast = loadYaml(result.content)
        if (ast.errors.length > 0) throw Error(getMessage('LOADER_YAML_PARSE_ERROR', { reasons: ast.errors.join('\r  ') }))
        const built = yamlAstToObject(ast)
        yamlAstToLocations(ast, built, path, lineEndings, '')
        return built
      }
    }
  }

  data.exceptionStore?.add({
    id: 'LOADER',
    code: 'LOADER_NOT_FOUND',
    level: 'error',
    locations: [],
    metadata: {
      caller: data.callerPath,
      resource: path
    }
  })
}

/**
 * If the loaded resource was a JSON file then this will link each object, array, and value
 * to a location for later retrieval via the lookupLocation function.
 */
function processJsonAst (data: ValueNode, breadcrumbs: string): any {
  if (data.type === 'Array') {
    const built: any[] = []
    const lookup = saveLocation(built, {
      breadcrumbs,
      end: data.loc?.end as IPosition,
      source: data.loc?.source as string,
      start: data.loc?.start as IPosition
    }) as ILookupLocationArray

    data.children.forEach((child, index) => {
      const breadcrumbsPlus = breadcrumbs.length > 0 ? breadcrumbs + ' > ' + String(index) : String(index)
      const result = processJsonAst(child, breadcrumbsPlus)
      built.push(result)
      lookup.items.push({
        breadcrumbs: breadcrumbsPlus,
        end: child.loc?.end as IPosition,
        source: child.loc?.source as string,
        start: child.loc?.start as IPosition
      })
      return result
    })
    return built
  } else if (data.type === 'Literal') {
    return data.value
  } else if (data.type === 'Object') {
    const built: Record<string, any> = {}
    const lookup = saveLocation(built, {
      breadcrumbs,
      start: data.loc?.start as IPosition,
      end: data.loc?.end as IPosition,
      source: data.loc?.source as string
    }) as ILookupLocationObject

    data.children.forEach(child => {
      const propertyName = child.key.value
      const breadcrumbsPlus = breadcrumbs.length > 0 ? breadcrumbs + ' > ' + propertyName : propertyName
      built[propertyName] = processJsonAst(child.value, breadcrumbsPlus)
      lookup.properties[propertyName] = {
        key: {
          breadcrumbs: breadcrumbsPlus,
          end: child.key.loc?.end as IPosition,
          source: child.key.loc?.source as string,
          start: child.key.loc?.start as IPosition
        },
        value: {
          breadcrumbs: breadcrumbsPlus,
          end: child.value.loc?.end as IPosition,
          source: child.value.loc?.source as string,
          start: child.value.loc?.start as IPosition
        }
      }
    })
    return built
  }
}

function yamlAstToObject (data: YamlNode): any {
  if (data.kind === YamlKind.MAP) {
    // YamlKind.MAP === object
    const built: Record<string, any> = {}
    data.mappings.forEach((o: YamlMapping) => {
      const key = o.key.value
      built[key] = yamlAstToObject(o.value)
    })
    return built
  } else if (data.kind === YamlKind.SCALAR) {
    // YamlKind.SCALAR === non-object (number, string, etc.)
    return 'valueObject' in data ? data.valueObject : data.value
  } else if (data.kind === YamlKind.SEQ) {
    // YamlKind.SEQ === Array
    const built: any[] = []
    ;(data as YamlSequence).items.forEach((o: YamlNode) => {
      built.push(yamlAstToObject(o))
    })
    return built
  } else {
    throw Error(getMessage('LOADER_YAML_SUPPORT_ERROR'))
  }
}

/**
 * If the loaded resource was a YAML file then this will link each object, array, and value
 * to a location for later retrieval via the lookupLocation function.
 */
function yamlAstToLocations (data: YamlNode, built: any, source: string, lineEndings: ILineEnding[], breadcrumbs: string): void {
  const loc: ILocation = {
    breadcrumbs,
    end: getLocationFromPosition(data.endPosition, lineEndings),
    source,
    start: getLocationFromPosition(data.startPosition, lineEndings)
  }

  // object
  if (data.kind === YamlKind.MAP) {
    const lookup = saveLocation(built, loc) as ILookupLocationObject
    data.mappings.forEach((o: YamlMapping) => {
      const k = o.key
      const v = o.value as YamlNode['value']
      const key = k.value
      const value = built[key]
      const breadcrumbsPlus = breadcrumbs.length > 0 ? breadcrumbs + ' > ' + key : key
      lookup.properties[key] = {
        key: {
          breadcrumbs: breadcrumbsPlus,
          end: getLocationFromPosition(k.endPosition, lineEndings),
          source,
          start: getLocationFromPosition(k.startPosition, lineEndings)
        },
        value: {
          breadcrumbs: breadcrumbsPlus,
          end: getLocationFromPosition(v.endPosition, lineEndings),
          source,
          start: getLocationFromPosition(v.startPosition, lineEndings)
        }
      }
      yamlAstToLocations(o.value, value, source, lineEndings, breadcrumbsPlus)
    })
  } else if (data.kind === YamlKind.SEQ) {
    const lookup = saveLocation(built, loc) as ILookupLocationArray
    ;(data as YamlSequence).items.forEach((o: YamlNode, i: number) => {
      const breadcrumbsPlus = breadcrumbs.length > 0 ? breadcrumbs + ' > ' + String(i) : String(i)
      const value = built[i]
      lookup.items.push({
        breadcrumbs: breadcrumbsPlus,
        end: getLocationFromPosition(o.endPosition, lineEndings),
        source,
        start: getLocationFromPosition(o.startPosition, lineEndings)
      })
      yamlAstToLocations(o, value, source, lineEndings, breadcrumbs)
    })
  } else if (data.kind !== YamlKind.SCALAR) {
    throw Error(getMessage('LOADER_YAML_SUPPORT_ERROR'))
  }
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
